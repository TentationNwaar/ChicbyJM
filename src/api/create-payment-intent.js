export const config = { runtime: "nodejs18.x" };

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { items, customerEmail } = JSON.parse(req.body || "{}");

    // ⚠️ Calcule le montant côté serveur (ne jamais faire confiance au front)
    // Ici, on suppose que chaque item a {price, quantity}
    const amount = Math.max(
      100, // min 1.00 CHF
      Math.round(
        (items || []).reduce((sum, it) => sum + (Number(it.price || 0) * Number(it.quantity || 1)), 0) * 100
      )
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "chf", // TWINT & PayPal via Stripe marcheront en CHF si activés
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "always", // utile pour méthodes redirigées (TWINT/PayPal)
      },
      receipt_email: customerEmail || undefined,
      // Optionnel : metadata pour ta logique interne
      metadata: { source: "gatsby-site" },
    });

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
}