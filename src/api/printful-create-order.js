export const config = { runtime: "nodejs18.x" };

import fetch from "node-fetch";

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const AUTO_CONFIRM = String(process.env.PRINTFUL_AUTO_CONFIRM || "false").toLowerCase() === "true";

// Utilitaire: transforme les items du panier -> items Printful
function mapCartToPrintfulItems(items = []) {
  return items
    .filter((it) => Number(it.quantity) > 0 && (it.variant_id || it.sync_variant_id))
    .map((it) => {
      const syncVariantId = Number(it.sync_variant_id || it.variant_id);
      const qty = Number(it.quantity) || 1;

      const mapped = {
        sync_variant_id: syncVariantId,
        quantity: qty,
      };

      // Prix de vente affiché côté Printful (optionnel)
      if (it.price != null && !Number.isNaN(Number(it.price))) {
        mapped.retail_price = String(Number(it.price).toFixed(2));
      }

      // Ajoute une note compacte pour retrouver couleur/taille dans le dashboard
      const notes = [];
      if (it.name) notes.push(it.name);
      if (it.color) notes.push(`color:${it.color}`);
      if (it.size) notes.push(`size:${it.size}`);
      if (notes.length) {
        mapped.notes = notes.join(" | ");
      }

      return mapped;
    });
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (!PRINTFUL_API_KEY) {
      return res.status(500).json({ error: "PRINTFUL_API_KEY manquant" });
    }

    const {
      customerEmail = null,
      shipping, // {name, address:{...}, phone}
      items = [],
      confirm = AUTO_CONFIRM, // piloté par PRINTFUL_AUTO_CONFIRM en prod
      external_id = null, // optionnel: ta référence (ex: le PaymentIntent id Stripe)
      packing_slip = null, // optionnel
      shipping_method = "STANDARD", // "STANDARD" | "EXPRESS" | etc.
      metadata = null, // objet libre à archiver côté Printful
    } = req.body || {};

    const printfulItems = mapCartToPrintfulItems(items);
    if (!printfulItems.length) {
      return res.status(400).json({ error: "Aucun article valide pour Printful" });
    }

    const recipient = {
      name: shipping?.name || "Client",
      address1: shipping?.address?.line1 || "",
      address2: shipping?.address?.line2 || "",
      city: shipping?.address?.city || "",
      state_code: shipping?.address?.state || "",
      country_code: shipping?.address?.country || "CH", // par défaut CH
      zip: shipping?.address?.postal_code || "",
      phone: shipping?.phone || "",
      email: customerEmail || "",
    };

    // Récapitulatif retail facultatif (affichage dans le dashboard)
    const subtotal = items.reduce((sum, it) => {
      const p = Number(it.price) || 0;
      const q = Number(it.quantity) || 1;
      return sum + p * q;
    }, 0);
    const retail_costs = {
      currency: "CHF",
      subtotal: Number(subtotal.toFixed(2)),
      shipping: 0,
      discount: 0,
      tax: 0,
      total: Number(subtotal.toFixed(2)),
    };

    const payload = {
      external_id: external_id || undefined,
      recipient,
      items: printfulItems,
      shipping: shipping_method || undefined, // facultatif, sinon défaut de Printful
      confirm, // false = Draft; true = lance la prod
      packing_slip: packing_slip || undefined,
      retail_costs,
      external_data: metadata ? JSON.stringify(metadata) : undefined,
    };

    if (process.env.NODE_ENV !== "production") {
      console.log("[printful-create-order] Payload ⇣");
      console.log(JSON.stringify(payload, null, 2));
    }

    const resp = await fetch("https://api.printful.com/orders", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error("Printful create order error:", data);
      // Harmonise le message d'erreur
      const msg = data?.error?.message || data?.error || data?.result || "Printful error";
      return res.status(resp.status).json({ error: msg, details: data });
    }

    // data.result contient la commande créée
    return res.status(200).json({ order: data.result });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}