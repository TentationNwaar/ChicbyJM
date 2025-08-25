// src/components/ProductReviews.tsx
import React, { useEffect, useState } from "react";
import { getProductRating, listReviews, upsertMyReview, getMyReview, deleteMyReview } from "../lib/reviews";
import { StarDisplay, StarInput } from "./StarRating";
import { supabase } from "../lib/supabaseClient";

export default function ProductReviews({ productId }:{ productId:string }) {
  const [rating, setRating] = useState<{avg_rating:number|null, review_count:number}>({avg_rating:null, review_count:0});
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [my, setMy] = useState({ rating: 0, title: "", body: "" });
  const [user, setUser] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const [{ data: { user } }, r, lst] = await Promise.all([
          supabase.auth.getUser(),
          getProductRating(productId),
          listReviews(productId, { from: 0, to: 9 })
        ]);
        if (!mounted) return;
        setUser(user);
        setRating({ avg_rating: r?.avg_rating ?? null, review_count: r?.review_count ?? 0 });
        setReviews(lst ?? []);
        // Pré-remplir le formulaire si l'utilisateur a déjà un avis
        if (user?.id) {
          try {
            const mine = await getMyReview(productId, user.id);
            if (mine) {
              setMy({ rating: mine.rating || 0, title: mine.title || "", body: mine.body || "" });
            }
          } catch (e) {
            console.error("getMyReview failed", e);
          }
        }
      } catch (e:any) {
        console.error("init reviews failed", e);
        if (mounted) setErr(e?.message ?? "Une erreur est survenue lors du chargement des avis.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [productId]);

  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
      setErr(null);
      if (!user) {
        setErr("Connecte-toi pour laisser un avis.");
        return;
      }
      if (!my.rating) {
        setErr("Choisis une note (1 à 5).");
        return;
      }
      if (!productId) {
        setErr("Identifiant produit manquant.");
        return;
      }
      // ➜ nom d’affichage (full_name > name > email prefix > fallback)
      const displayName =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        (user?.email ? user.email.split("@")[0] : null) ||
        "Client";

      // passe le displayName dans l’upsert
      const saved = await upsertMyReview(productId, my.rating, my.title, my.body, user.id, displayName);
      const [r, lst] = await Promise.all([
        getProductRating(productId),
        listReviews(productId, { from: 0, to: 9 })
      ]);
      setRating({ avg_rating: r?.avg_rating ?? null, review_count: r?.review_count ?? 0 });
      setReviews(lst ?? []);
      setMy({ rating: 0, title: "", body: "" });
    } catch (e:any) {
      console.error("submit review failed", e);
      const msg = e?.message || (e?.error_description ?? e?.hint) || "Impossible d’enregistrer l’avis.";
      setErr(msg);
      alert(msg);
    }
  };

  return (
    <section style={{ marginTop: 24 }}>
      {/* Résumé */}
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <StarDisplay value={rating.avg_rating} />
        <span style={{ fontWeight:600 }}>{rating.avg_rating ?? "–"}/5</span>
        <span style={{ color:"#666" }}>({rating.review_count} avis)</span>
      </div>

      {/* Formulaire (optionnel si connecté) */}
      <div style={{ marginTop: 12, padding: 12, border:"1px solid #eee", borderRadius:12 }}>
        <h4 style={{ margin:"0 0 8px" }}>Ton avis</h4>
        <form onSubmit={submit} style={{ display:"grid", gap:8 }}>
          <StarInput value={my.rating} onChange={(v)=>setMy(s=>({...s, rating:v}))} />
          <input
            type="text" placeholder="Titre (optionnel)"
            value={my.title} onChange={e=>setMy(s=>({...s, title:e.target.value}))}
            style={{ padding:10, border:"1px solid #ddd", borderRadius:8 }}
          />
          <textarea
            placeholder="Ton commentaire (optionnel)"
            value={my.body} onChange={e=>setMy(s=>({...s, body:e.target.value}))}
            rows={4} style={{ padding:10, border:"1px solid #ddd", borderRadius:8 }}
          />
          <button className="add-to-cart" type="submit">Publier mon avis</button>
        </form>
        {err ? (
          <p style={{ color: "#b00020", marginTop: 8 }}>{err}</p>
        ) : !user ? (
          <p style={{ color: "#666", marginTop: 8 }}>Connecte‑toi pour noter et commenter.</p>
        ) : null}
      </div>

      {/* Liste des avis */}
      <ul style={{ marginTop: 16, padding:0, listStyle:"none" }}>
        {loading ? <li>Chargement…</li> :
          reviews.length === 0 ? <li>Aucun avis pour le moment.</li> :
          reviews.map(r => (
            <li key={r.id} style={{ padding:"12px 0", borderBottom:"1px solid #eee" }}>
              <StarDisplay value={r.rating} />
              {r.title && <div style={{ fontWeight:600, marginTop:4 }}>{r.title}</div>}
              {r.body && <div style={{ color:"#333", marginTop:4, whiteSpace:"pre-wrap" }}>{r.body}</div>}
              <div style={{ color:"#777", fontSize:12, marginTop:4 }}>
                {r.author_name ? <strong style={{ color:"#444" }}>{r.author_name}</strong> : null}
                {r.author_name ? " • " : ""}
                {new Date(r.created_at).toLocaleDateString()}
                {r.updated_at && new Date(r.updated_at).getTime() !== new Date(r.created_at).getTime() ? (
                  <span style={{ marginLeft: 6, fontStyle: "italic", color: "#999" }}>
                    (modifié le {new Date(r.updated_at).toLocaleDateString()})
                  </span>
                ) : null}
              </div>
              {user?.id === r.user_id && (
                <div style={{ marginTop: 6, display: "flex", gap: 12 }}>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        if (!confirm("Supprimer votre avis ?")) return;
                        await deleteMyReview(productId, user.id);
                        const [rt, lst2] = await Promise.all([
                          getProductRating(productId),
                          listReviews(productId, { from: 0, to: 9 })
                        ]);
                        setRating({ avg_rating: rt?.avg_rating ?? null, review_count: rt?.review_count ?? 0 });
                        setReviews(lst2 ?? []);
                        setMy({ rating: 0, title: "", body: "" });
                      } catch (e:any) {
                        console.error("delete review failed", e);
                        alert(e?.message ?? "Suppression impossible.");
                      }
                    }}
                    style={{ border: "none", background: "transparent", color: "#b00020", cursor: "pointer" }}
                  >
                    Supprimer mon avis
                  </button>
                  <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    style={{ border: "none", background: "transparent", color: "#555", cursor: "pointer" }}
                  >
                    Modifier
                  </button>
                </div>
              )}
            </li>
          ))
        }
      </ul>
    </section>
  );
}