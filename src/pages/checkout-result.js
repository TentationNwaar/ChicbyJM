import React from "react";
import { useLocation } from "@reach/router";
import Layout from "../components/Layout";

export default function CheckoutResult() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const success = params.get("success") === "true";

  return (
    <Layout>
      <div style={{ padding: 24, textAlign: "center" }}>
        {success ? (
          <>
            <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem", fontWeight: "600", letterSpacing: "0.02em" }}>Merci !</h1>
            <p>Votre paiement a bien été reçu. Vous recevrez une confirmation sous peu.</p>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem", fontWeight: "600", letterSpacing: "0.02em" }}>Une erreur est survenue</h1>
            <p>
              Le paiement a été annulé ou interrompu. Veuillez réessayer ou nous
              contacter pour résoudre le problème.
            </p>
          </>
        )}
      </div>
    </Layout>
  );
}