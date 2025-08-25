// src/lib/reviews.ts
import { supabase } from "./supabaseClient";

export async function getProductRating(productId: string) {
  const { data, error } = await supabase
    .from("product_ratings")
    .select("*")
    .eq("product_id", productId)
    .maybeSingle();
  if (error) throw error;
  return data || { product_id: productId, avg_rating: null, review_count: 0 };
}

// listReviews: ajoute author_name dans le select
export async function listReviews(productId: string, {from=0, to=9} = {}) {
  const { data, error } = await supabase
    .from("product_reviews")
    .select("id,rating,title,body,created_at,user_id,author_name") // <= ajouté
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw error;
  return data;
}

// upsertMyReview: accepte un authorName et l’envoie
export async function upsertMyReview(
  productId: string,
  rating: number,
  title: string,
  body: string,
  userId: string,
  authorName?: string
) {
  const safeRating = Math.max(1, Math.min(5, Math.round(Number(rating))));
  const payload: any = { product_id: productId, user_id: userId, rating: safeRating, title, body };
  if (authorName) payload.author_name = authorName;

  const { data, error } = await supabase
    .from("product_reviews")
    .upsert(payload, { onConflict: "product_id,user_id" })
    .select()
    .single();

  if (error) {
    console.error("upsertMyReview error", error);
    throw error;
  }
  return data;
}