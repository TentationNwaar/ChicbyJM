export const config = { runtime: "nodejs18.x" };

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const sig = req.headers["stripe-signature"];
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks);

    event = stripe.webhooks.constructEvent(rawBody, sig, whSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        // ✅ Paiement OK — créer la commande, vider panier côté client via retour, etc.
        break;
      case "payment_intent.payment_failed":
        // ❌ Paiement KO — log/alerte
        break;
      default:
        break;
    }
    res.json({ received: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Webhook handler failed" });
  }
}