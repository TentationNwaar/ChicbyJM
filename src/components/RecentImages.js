import React from "react";
import { graphql, useStaticQuery, Link } from "gatsby";
import "./RecentImages.css";

// Helper: parse various possible date fields safely
const getDateValue = (p) => {
  const v = p?.created_at ?? p?.createdAt ?? p?.updatedAt ?? p?.date ?? p?.id ?? 0;
  if (!v) return 0;
  return typeof v === "string" && !/^[0-9]+$/.test(v) ? Date.parse(v) : +v || 0;
};

const RecentImages = () => {
  // Fetch more than 3, then sort & slice client-side to ensure "latest"
  const data = useStaticQuery(graphql`
    query RecentImages_Home {
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

  const products = data?.allPrintfulProduct?.nodes || [];

  // Sort newest first then take top 3
  const newest = [...products]
    .sort((a, b) => getDateValue(b) - getDateValue(a))
    .slice(0, 3);

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
            />
            <p className="product-name">{product.name}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default RecentImages;