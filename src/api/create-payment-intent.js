export const config = { runtime: "nodejs18.x" };

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Server endpoint to create/update a PaymentIntent from cart items.
 * - Computes the amount (in CHF cents)
 * - Stores useful metadata (user_id, compact cart) on the PI
 * - Supports updating an existing PI to keep the amount in sync
 */
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Gatsby/Node serverless can pass a string body in dev; normalize it.
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const {
      items = [],
      payment_intent_id = null,
      customerEmail = null,
      user_id = null,
    } = body;

    // Compute total in cents from cart lines
    const total = Array.isArray(items)
      ? items.reduce((sum, it) => {
          const price = Number(it?.price) || 0;
          const qty = Number(it?.quantity) || 1;
          return sum + price * qty;
        }, 0)
      : 0;

    const amount = Math.round(total * 100); // CHF cents

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    // Normalize incoming line items for Stripe metadata (and later Printful)
    const normalizeSyncVariantId = (val) => {
      const n = Number(val);
      return Number.isFinite(n) && n > 0 ? n : null;
    };

    const compactLines = (Array.isArray(items) ? items : [])
      .map((it) => {
        const syncVariant =
          normalizeSyncVariantId(
            it?.sync_variant_id ??
            it?.variant_id ??
            it?.syncVariantId ??
            it?.sync_variantId
          );

        return {
          id: it?.id ?? it?.product_id ?? null,
          sync_variant_id: syncVariant,
          name: it?.name ?? "",
          color: it?.color ?? "",
          size: it?.size ?? "",
          price: Number(it?.price) || 0,
          quantity: Number(it?.quantity) || 1,
        };
      })
      // Remove any lines with invalid quantity (0 or less)
      .filter((l) => l.quantity > 0);

    const validSyncCount = compactLines.filter(l => l.sync_variant_id).length;
    console.log(`🧾 create-payment-intent: ${compactLines.length} lines, ${validSyncCount} with sync_variant_id`);

    // Stripe metadata limits values to 500 chars. Keep it compact & safe.
    const cartJson = JSON.stringify(compactLines);
    const truncate = (s, n = 480) => (s && s.length > n ? s.slice(0, n) + "…" : s);
    const metadata = {
      ...(user_id ? { user_id: String(user_id) } : {}),
      cart: truncate(cartJson),
    };

    let pi;
    if (payment_intent_id) {
      // Update existing PI (amount change or metadata refresh)
      pi = await stripe.paymentIntents.update(
        payment_intent_id,
        {
          amount,
          currency: "chf",
          ...(customerEmail ? { receipt_email: customerEmail } : {}),
          metadata,
        }
      );
    } else {
      // Create a new PI
      pi = await stripe.paymentIntents.create(
        {
          amount,
          currency: "chf",
          automatic_payment_methods: { enabled: true }, // TWINT + cards + wallets per dashboard
          ...(customerEmail ? { receipt_email: customerEmail } : {}),
          metadata,
        }
      );
    }

    return res.json({
      clientSecret: pi.client_secret,
      paymentIntentId: pi.id,
      amount: pi.amount,
      currency: pi.currency,
    });
  } catch (e) {
    console.error("PI error:", e);
    return res.status(500).json({ error: e?.message || "Internal error" });
  }
}