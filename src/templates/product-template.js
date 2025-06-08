import React, { useState, useEffect, useContext } from "react";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import { CartContext } from "../context/CartContext";
import "./product-template.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

function parseVariantName(fullName) {
  const result = { color: "", size: "" };
  if (!fullName) return result;

  const parts = fullName.split("/").map((part) => part.trim());

  if (parts.length === 2) {
    result.size = parts[1];
  } else if (parts.length >= 3) {
    result.color = parts[1];
    result.size = parts[2];
  }

  return result;
}

const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");

function getProductImage(product, variant) {
  if (!variant || !variant.files || variant.files.length === 0) {
    return product.thumbnail_url;
  }

  const validImage = variant.files.find((file) => {
    const filename = file.filename?.toLowerCase() || "";
    return (
      file.preview_url &&
      filename.includes("front") &&
      !filename.includes("logo") &&
      !filename.includes("preview-file")
    );
  });

  return validImage?.preview_url || product.thumbnail_url;
}

const ProductTemplate = ({ data }) => {
  if (!data || !data.printfulProduct) {
    return <div>Produit non trouvé</div>;
  }

  const product = data.printfulProduct;
  const variants = product.sync_variants || [];

  const productSlug = slugify(product.name);
  const customImages = [1, 2, 3].map(
    (i) => `/products/${productSlug}/${i}.jpg`
  );
  const allImages = [
    ...customImages,
    ...variants
      .flatMap((variant) => variant.files || [])
      .filter(
        (file) =>
          file.preview_url &&
          !file.filename.includes("mockup") &&
          !file.filename.includes("logo")
      )
      .map((file) => file.preview_url),
  ];

  const isBrowser = typeof window !== "undefined";
  const cartContext = isBrowser ? useContext(CartContext) : null;
  const addToCart = cartContext ? cartContext.addToCart : null;

  if (!isBrowser) {
    return <p>Chargement...</p>;
  }

  const productName = product.name.split("/")[0];

  const extractedVariants = variants.map((variant) =>
    parseVariantName(variant.name)
  );
  const availableColors = Array.from(
    new Set(extractedVariants.map((variant) => variant.color).filter(Boolean))
  );
  const availableSizes = Array.from(
    new Set(extractedVariants.map((variant) => variant.size).filter(Boolean))
  );

  const [selectedColor, setSelectedColor] = useState(() => availableColors[0] || null);
  const [selectedSize, setSelectedSize] = useState(() => availableSizes[0] || null);
  const [selectedImage, setSelectedImage] = useState(product.thumbnail_url);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  useEffect(() => {
    if (!selectedColor || !selectedSize) {
      setSelectedImage(product.thumbnail_url);
      return;
    }

    const matchingVariant = variants.find((variant) => {
      const parsed = parseVariantName(variant.name);
      return (
        parsed.color?.toLowerCase() === selectedColor.toLowerCase() &&
        parsed.size?.toLowerCase() === selectedSize.toLowerCase()
      );
    });

    let image = product.thumbnail_url;

    if (matchingVariant?.files?.length) {
      const validImage = matchingVariant.files.find((file) => {
        const filename = file.filename?.toLowerCase() || "";
        return (
          file.preview_url &&
          filename.includes("front") &&
          !filename.includes("logo") &&
          !filename.includes("preview-file")
        );
      });

      if (validImage?.preview_url && validImage.preview_url !== product.thumbnail_url) {
        image = validImage.preview_url;
      }
    }

    setSelectedImage(image);
  }, [selectedColor, selectedSize, variants, product]);

  const handleAddToCart = () => {
    const selectedVariant = variants.find((variant) => {
      const variantName = parseVariantName(variant.name);
      return (
        (!selectedColor || variantName.color === selectedColor) &&
        (!selectedSize || variantName.size === selectedSize)
      );
    });

    const variant = selectedVariant || variants[0];

    addToCart({
      id: variant.id,
      name: product.name,
      color: selectedColor || "Aucune",
      size: selectedSize || "Aucune",
      price: parseFloat(variant.retail_price) || 0,
      image: getProductImage(product, variant),
    });

    alert("Produit ajouté au panier !");
  };

  return (
    <Layout>
      <div className="product-container">
        <div className="product-images-container">
          <img
            src={selectedImage}
            alt="Image principale du produit"
            className="main-product-image"
            style={{ width: "500px", height: "500px", objectFit: "cover" }}
          />
        </div>

        <div className="product-info">
          <h1 className="product-title">{productName}</h1>
          <p className="product-price">CHF {variants[0]?.retail_price || "N/A"}</p>
          <p className="tax-info">Taxes incluses.</p>

          {availableColors.length > 0 && (
            <div className="color-selection">
              <p><strong>Couleur</strong></p>
              <div className="color-buttons">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`color-button ${color === selectedColor ? "selected" : ""}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {availableSizes.length > 0 && (
            <div className="size-selection">
              <p><strong>Taille</strong></p>
              <div className="size-buttons">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`size-button ${size === selectedSize ? "selected" : ""}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="product-actions">
            <button className="add-to-cart" onClick={handleAddToCart}>
              Ajouter au panier
            </button>
            <button className="description-button" onClick={() => setIsDescriptionOpen(true)}>
              Description
            </button>
          </div>
        </div>
      </div>

      {isDescriptionOpen && (
        <div className={`description-overlay ${isDescriptionOpen ? "open" : ""}`}>
          <div className="description-panel">
            <button
              className="close-description"
              onClick={() => setIsDescriptionOpen(false)}
            >
              ×
            </button>
            <h2>Description</h2>
            <p>{product.description}</p>

            {product.size_guide && product.size_guide.length > 0 && (
              <div className="size-guide">
                <h3>Guide des tailles</h3>
                <table>
                  <thead>
                    <tr>
                      {Object.keys(product.size_guide[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {product.size_guide.map((size, index) => (
                      <tr key={index}>
                        {Object.values(size).map((value, i) => (
                          <td key={i}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export const query = graphql`
  query ($id: String!) {
    printfulProduct(id: { eq: $id }) {
      id
      name
      description
      thumbnail_url
      sync_variants {
        id
        name
        retail_price
        currency
        files {
          filename
          preview_url
        }
      }
      size_guide {
        size
        chest
        length
      }
    }
  }
`;

export default ProductTemplate;