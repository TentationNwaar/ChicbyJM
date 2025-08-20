// src/components/ProductReviews.tsx
import React, { useEffect, useState } from "react";
import { getProductRating, listReviews, upsertMyReview } from "../lib/reviews";
import { StarDisplay, StarInput } from "./StarRating";
import { supabase } from "../lib/supabaseClient";

export default function ProductReviews({ productId }:{ productId:string }) {
  const [rating, setRating] = useState<{avg_rating:number|null, review_count:number}>({avg_rating:null, review_count:0});
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [my, setMy] = useState({ rating: 0, title: "", body: "" });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const [{ data: { user } }, r, lst] = await Promise.all([
        supabase.auth.getUser(),
        getProductRating(productId),
        listReviews(productId, {from:0, to:9})
      ]);
      setUser(user);
      setRating({ avg_rating: r.avg_rating, review_count: r.review_count });
      setReviews(lst);
      setLoading(false);
    };
    init();
  }, [productId]);

  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Connecte-toi pour laisser un avis.");
    await upsertMyReview(productId, my.rating, my.title, my.body, user.id);
    // refresh
    const [r, lst] = await Promise.all([
      getProductRating(productId),
      listReviews(productId, {from:0, to:9})
    ]);
    setRating({ avg_rating: r.avg_rating, review_count: r.review_count });
    setReviews(lst);
    setMy({ rating: 0, title: "", body: "" });
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
        {!user && <p style={{ color:"#666", marginTop:8 }}>Connecte‑toi pour noter et commenter.</p>}
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
                {new Date(r.created_at).toLocaleDateString()}
              </div>
            </li>
          ))
        }
      </ul>
    </section>
  );
}