import React, { useMemo } from "react";
import { graphql, useStaticQuery, Link } from "gatsby";
import "./RecentImages.css";

// Helper: parse various possible date fields safely
const getDateValue = (p, orderByFallback = []) => {
  const candidates = [
    p?.created_at,
    p?.createdAt,
    p?.updatedAt,
    p?.date,
    ...orderByFallback.map((k) => p?.[k]),
  ].filter(Boolean);

  if (candidates.length === 0) return 0;

  // Take the first available and try to parse
  const v = candidates[0];
  if (typeof v === "string") {
    const parsed = Date.parse(v);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  const n = +v;
  return Number.isNaN(n) ? 0 : n;
};

/**
 * RecentImages
 * - If `products` prop is provided, uses it (assumed already sorted by the caller, e.g., Shop logic)
 * - Otherwise falls back to StaticQuery (build-time) and sorts client-side by the best available date field
 */
const RecentImages = ({ products: productsProp = [], limit = 3, orderBy = "created_at", direction = "desc" }) => {
  // Fallback StaticQuery only when no products are provided via props
  const data = useStaticQuery(graphql`
    query RecentImages_Home_Fallback {
      allPrintfulProduct(limit: 24) {
        nodes {
          id
          name
          slug
          thumbnail_url
        }
      }
    }
  `);

  const source = productsProp.length > 0
    ? productsProp
    : (data?.allPrintfulProduct?.nodes || []);

  const newest = useMemo(() => {
    // If caller provided products (e.g., Shop already sorted), keep order and just take the first `limit`.
    if (productsProp.length > 0) {
      return productsProp.slice(0, limit);
    }

    // Otherwise, sort by the best available date-like field, falling back gracefully.
    const fallbackKeys = Array.isArray(orderBy) ? orderBy : [orderBy];

    const withScores = source.map((p, idx) => ({
      p,
      score: getDateValue(p, fallbackKeys),
      idx,
    }));

    // If no scores are available (all 0), preserve original order
    const anyScore = withScores.some((x) => x.score !== 0);
    const sorted = anyScore
      ? withScores.sort((a, b) => {
          const diff = a.score - b.score;
          return direction === "asc" ? diff : -diff;
        })
      : withScores; // keep as-is

    return sorted.slice(0, limit).map((x) => x.p);
  }, [productsProp, source, limit, orderBy, direction]);

  return (
    <div className="image-gallery">
      {newest.length === 0 && <p>Aucun produit trouvé.</p>}
      {newest.map((product) => (
        <div key={product.id} className="image-container">
          <Link to={`/en/product/${product.slug}/`}>
            <img
              src={product.thumbnail_url || "/placeholder.jpg"}
              alt={product.name}
              className="product-image"
              loading="lazy"
            />
            <p className="product-name">{product.name}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default RecentImages;