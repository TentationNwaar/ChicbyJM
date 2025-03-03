import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { Link } from "gatsby";
import "./RecentImages.css";

const RecentImages = () => {
  const data = useStaticQuery(graphql`
    query {
      allPrintfulProduct(limit: 3, sort: { fields: id, order: DESC }) {
        nodes {
          id
          name
          slug
          thumbnail_url
        }
      }
    }
  `);

  const products = data.allPrintfulProduct.nodes;

  return (
    <div className="image-gallery">
      {products.length === 0 && <p>Aucun produit trouvé.</p>}
      {products.map((product) => (
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