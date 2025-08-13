import React, { useMemo, useState, useContext, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, AddressElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Layout from "../components/Layout";
import { CartContext } from "../context/CartContext";

const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLISHABLE_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, clearCart } = useContext(CartContext);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const total = useMemo(
    () => cart.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0),
    [cart]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setMessage("");

    try {
      const returnUrl = `${process.env.SITE_URL || window.location.origin}/checkout-result`;

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: returnUrl },
      });

      if (error) setMessage(error.message || "Une erreur est survenue.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 520, margin: "0 auto", display: "grid", gap: 16 }}>
      <AddressElement options={{ mode: "shipping" }} />
      <PaymentElement />
      <button disabled={!stripe || submitting} style={{ padding: "12px 16px", fontWeight: 600 }}>
        {submitting ? "Traitement…" : `Payer CHF ${total.toFixed(2)}`}
      </button>
      {message && <div style={{ color: "crimson" }}>{message}</div>}
    </form>
  );
}

export default function CheckoutPage() {
  const { cart } = useContext(CartContext);
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    const createPI = async () => {
      const resp = await fetch("/api/create-payment-intent", {
        method: "POST",
        body: JSON.stringify({
          items: cart.map(c => ({ price: c.price, quantity: c.quantity })),
          customerEmail: null, // si tu as un email
        }),
      });
      const json = await resp.json();
      setClientSecret(json.clientSecret);
    };
    createPI();
  }, [cart]);

  const options = useMemo(
    () => clientSecret ? ({ clientSecret, appearance: { theme: "stripe" } }) : null,
    [clientSecret]
  );

  return (
    <Layout>
      <div style={{ padding: "24px 16px" }}>
        <h1>Paiement</h1>
        {!clientSecret ? (
          <p>Préparation du paiement…</p>
        ) : (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
    </Layout>
  );
}