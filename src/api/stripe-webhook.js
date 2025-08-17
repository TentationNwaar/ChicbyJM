// ✅ Gatsby Functions: parse Stripe webhooks as *text* to preserve exact raw payload
export const config = {
  bodyParser: {
    text: {
      type: "application/json",
      limit: "1mb",
    },
  },
};

import Stripe from "stripe";
import fetch from "node-fetch";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const SITE_URL = process.env.SITE_URL || "http://localhost:8000";
const AUTO_CONFIRM_PRINTFUL = process.env.PRINTFUL_AUTO_CONFIRM === "true";

// Helper: get raw body as Buffer (with bodyParser.text we receive the exact JSON string)
async function getRawBody(req) {
  try {
    // 1) Gatsby with bodyParser.text => req.body is the exact JSON string
    if (typeof req.body === "string" && req.body.length > 0) {
      return Buffer.from(req.body);
    }
    // 2) If another middleware put a Buffer somewhere
    if (req.body && Buffer.isBuffer(req.body)) {
      return req.body;
    }
    if (req.rawBody) {
      return Buffer.isBuffer(req.rawBody) ? req.rawBody : Buffer.from(req.rawBody);
    }
    // 3) As a last resort, read the stream
    if (typeof req.on === "function") {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      if (chunks.length) return Buffer.concat(chunks);
    }
    return Buffer.from("");
  } catch (e) {
    console.error("Failed to read raw body:", e?.message);
    return Buffer.from("");
  }
}

export default async function handler(req, res) {
  const sig = req.headers["stripe-signature"];
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!whSecret) {
    console.error("❌ STRIPE_WEBHOOK_SECRET is missing from environment. Cannot verify webhook.");
    return res.status(400).send("Missing STRIPE_WEBHOOK_SECRET");
  }
  if (!sig) {
    console.error("❌ Missing Stripe signature header (stripe-signature).");
    return res.status(400).send("Missing stripe-signature header");
  }

  let event;
  try {
    const rawBody = await getRawBody(req);
    console.log(`🔎 Webhook content-type: ${req.headers["content-type"]}`);
    console.log(`🔎 Webhook raw body length: ${rawBody.length} bytes`);
    event = stripe.webhooks.constructEvent(rawBody, sig, whSecret);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err?.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object;

        const customerEmail =
          pi?.receipt_email ||
          pi?.charges?.data?.[0]?.billing_details?.email ||
          null;

        const shipping =
          pi?.shipping ||
          pi?.charges?.data?.[0]?.shipping ||
          null;

        // Read compact cart from PI metadata (populated in /api/create-payment-intent)
        let items = [];
        try {
          if (pi?.metadata?.cart) {
            items = JSON.parse(pi.metadata.cart);
          }
        } catch (e) {
          console.error("Impossible de parser metadata.cart :", e?.message);
        }

        const normalizedItems = (Array.isArray(items) ? items : [])
          .map((it) => ({
            sync_variant_id: it?.sync_variant_id ?? it?.variant_id ?? null,
            quantity: Number(it?.quantity) || 1,
          }))
          .filter((it) => !!it.sync_variant_id);

        if (!normalizedItems.length) {
          console.warn("⚠️ Aucun sync_variant_id valide trouvé; aucune commande Printful créée.");
          break;
        }

        try {
          const printfulBody = {
            recipient: {
              name: shipping?.name || "",
              address1: shipping?.address?.line1 || "",
              address2: shipping?.address?.line2 || "",
              city: shipping?.address?.city || "",
              state_code: shipping?.address?.state || "",
              country_code: shipping?.address?.country || "",
              zip: shipping?.address?.postal_code || "",
              email: customerEmail || "",
            },
            items: normalizedItems,
            external_id: pi.id,
            confirm: AUTO_CONFIRM_PRINTFUL,
          };

          const resp = await fetch("https://api.printful.com/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
            },
            body: JSON.stringify(printfulBody),
          });

          const data = await resp.json();
          if (!resp.ok) {
            console.error("Printful create order failed:", data);
          } else {
            console.log("✅ Printful order created:", data?.result?.id || data);
          }
        } catch (err) {
          console.error("Erreur lors de l'appel à Printful :", err?.message);
        }

        break;
      }
      case "payment_intent.payment_failed":
        console.warn("❌ Paiement échoué:", event?.data?.object?.last_payment_error?.message);
        break;
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
        break;
    }
    res.json({ received: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Webhook handler failed" });
  }
}