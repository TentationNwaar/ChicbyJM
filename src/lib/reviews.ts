// src/lib/reviews.ts
import { supabase } from "../supabaseClient";

export async function getProductRating(productId: string) {
  const { data, error } = await supabase
    .from("product_ratings")
    .select("*")
    .eq("product_id", productId)
    .maybeSingle();
  if (error) throw error;
  return data || { product_id: productId, avg_rating: null, review_count: 0 };
}

export async function listReviews(productId: string, {from=0, to=9} = {}) {
  const { data, error } = await supabase
    .from("product_reviews")
    .select("id,rating,title,body,created_at,user_id")
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw error;
  return data;
}

export async function upsertMyReview(productId: string, rating: number, title: string, body: string, userId: string) {
  const { data, error } = await supabase
    .from("product_reviews")
    .upsert({ product_id: productId, user_id: userId, rating, title, body })
    .select()
    .single();
  if (error) throw error;
  return data;
}