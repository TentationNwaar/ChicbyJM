import React, { useMemo, useState, useContext, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  AddressElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import Layout from "../components/Layout";
import { CartContext } from "../context/CartContext";

// --- Stripe publishable key (frontend) ---
const publishableKey = process.env.GATSBY_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey && typeof window !== "undefined") {
  // aide au debug pendant le dev
  // eslint-disable-next-line no-console
  console.error("❌ GATSBY_STRIPE_PUBLISHABLE_KEY est absent. Vérifie .env.development");
}

const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

/**
 * Formulaire de paiement Stripe (PaymentElement + AddressElement)
 * - Valide les éléments
 * - Récupère l'adresse
 * - Confirme le paiement en joignant l'adresse (shipping) au PaymentIntent
 */
function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, clearCart, user } = useContext(CartContext);

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Total côté client uniquement pour l'affichage du bouton
  const total = useMemo(
    () => cart.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0),
    [cart]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setMessage("");

    // 1) Valider les éléments (email si inclus, adresse, etc.)
    const submitResult = await elements.submit();
    if (submitResult?.error) {
      setMessage(submitResult.error.message || "Veuillez corriger les informations.");
      setSubmitting(false);
      return;
    }

    // 2) Récupérer l’adresse depuis AddressElement
    const addressEl = elements.getElement(AddressElement);
    let addressValue = {};
    try {
      const { value } = (await addressEl?.getValue()) || {};
      addressValue = value || {};
    } catch {
      // ignore si pas dispo
    }

    // 3) Confirmer le paiement avec l’adresse (shipping attaché au PI)
    try {
      const returnUrl = `${process.env.SITE_URL || window.location.origin}/checkout-result`;
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
          shipping: {
            name: addressValue?.name || user?.full_name || user?.email || "",
            address: addressValue?.address || {},
            phone: addressValue?.phone || "",
          },
          // receipt_email peut être défini si tu as un email côté client
          receipt_email: user?.email || undefined,
        },
      });

      if (error) {
        setMessage(error.message || "Une erreur est survenue.");
      } else {
        // success redirigé par Stripe vers return_url
      }
    } catch (err) {
      setMessage(err?.message || "Erreur inattendue.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 520, margin: "0 auto", display: "grid", gap: 16 }}>
      <AddressElement options={{ mode: "shipping" }} />
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || submitting}
        style={{ padding: "12px 16px", fontWeight: 600 }}
      >
        {submitting ? "Traitement…" : `Payer CHF ${total.toFixed(2)}`}
      </button>
      {message && <div style={{ color: "crimson" }}>{message}</div>}
    </form>
  );
}

/**
 * Page Checkout :
 * - Crée/Met à jour le PaymentIntent côté serveur avec le détail du panier
 * - Monte <Elements> avec le clientSecret
 */
export default function CheckoutPage() {
  const { cart, user } = useContext(CartContext);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);

  useEffect(() => {
    const createPI = async () => {
      try {
        const _itemsForPi = cart.map((c) => ({
          price: Number(c.price),
          quantity: Number(c.quantity || 1),
          id: c.id,
          product_id: c.product_id ?? c.id ?? null,
          name: c.name,
          color: c.color,
          size: c.size,
          currency: c.currency || "CHF",
          image: c.image || null,
          sync_variant_id: Number(
            c.sync_variant_id ?? c.variant_id ?? c.syncVariantId ?? c.sync_variantId ?? c.id
          ) || null,
          variant_id: Number(c.variant_id ?? c.sync_variant_id ?? c.id) || null,
        }));
        // Debug côté client : combien de lignes et combien avec sync_variant_id ?
        try {
          const _withSync = _itemsForPi.filter(it => Number(it.sync_variant_id)).length;
          // eslint-disable-next-line no-console
          console.debug(`🧾 sending to PI: ${_itemsForPi.length} lines, ${_withSync} with sync_variant_id`);
        } catch {}

        const resp = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: _itemsForPi,
            customerEmail: user?.email ?? null,
            user_id: user?.id ?? null,
            payment_intent_id: paymentIntentId || null,
          }),
        });

        const json = await resp.json();
        if (!resp.ok) {
          // eslint-disable-next-line no-console
          console.error("PI error:", json);
          return;
        }
        setClientSecret(json.clientSecret);
        setPaymentIntentId(json.paymentIntentId || null);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    };

    if (cart?.length) createPI();
  }, [cart, user, paymentIntentId]);

  const options = useMemo(
    () =>
      clientSecret
        ? ({
            clientSecret,
            appearance: { theme: "stripe" },
          })
        : null,
    [clientSecret]
  );

  return (
    <Layout>
      <div style={{ padding: "24px 16px" }}>
        <h1>Paiement</h1>
        {!clientSecret ? (
          <p>Préparation du paiement…</p>
        ) : !stripePromise ? (
          <p style={{ color: "crimson" }}>
            Clé publique Stripe manquante. Vérifie la variable GATSBY_STRIPE_PUBLISHABLE_KEY.
          </p>
        ) : (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
    </Layout>
  );
}