import React from "react";
import Layout from "../components/Layout";

export default function CheckoutResult() {
  return (
    <Layout>
      <div style={{ padding: 24, textAlign: "center" }}>
        <h1>Merci !</h1>
        <p>Si le paiement a réussi, vous recevrez une confirmation.</p>
      </div>
    </Layout>
  );
}