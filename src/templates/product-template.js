import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import './product-template.css';

/**
 * Extrait la couleur et la taille d’un nom de variante.
 */
function parseVariantName(fullName) {
  const result = { color: '', size: '' };
  if (!fullName) return result;

  const parts = fullName.split('/').map(part => part.trim());

  if (parts.length === 2) {
    result.size = parts[1];
  } else if (parts.length >= 3) {
    result.color = parts[1];
    result.size = parts[2];
  }

  return result;
}

/**
 * Filtre et sélectionne uniquement l'image principale du produit.
 */
function getMainProductImage(files = []) {
  return files
    .filter(file => 
      !file.filename.toLowerCase().includes("logo") &&  
      !file.filename.toLowerCase().includes("mockup") && 
      !file.filename.toLowerCase().includes("preview") && 
      (file.filename.toLowerCase().includes("front") || file.filename.toLowerCase().includes("main")) 
    )
    .map(file => file.preview_url);
}

const ProductTemplate = ({ data }) => {
  const product = data.printfulProduct;
  const variants = product.sync_variants || [];

  console.log("Données récupérées :", product);

  const productName = product.name.split('/')[0];

  const extractedVariants = variants.map(variant => parseVariantName(variant.name));

  const availableColors = Array.from(
    new Set(
      extractedVariants.map(variant => variant.color).filter(Boolean)
    )
  );

  const hasColors = availableColors.length > 0;

  const availableSizes = Array.from(
    new Set(
      extractedVariants.map(variant => variant.size).filter(Boolean)
    )
  );

  const [selectedColor, setSelectedColor] = useState(hasColors ? availableColors[0] : null);
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  // 📌 Récupérer la description depuis la première variante (si dispo)
  const productDescription = variants.length > 0 ? variants[0].name : "Aucune description disponible.";

  const mainProductImage = hasColors
    ? getMainProductImage(
        variants
          .filter(variant => parseVariantName(variant.name).color === selectedColor)
          .flatMap(variant => variant.files)
      )
    : getMainProductImage(variants.flatMap(variant => variant.files));

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedColor]);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  return (
    <Layout>
      <div className="product-container">
        {/* Section Images */}
        <div className="product-images-container">
          {mainProductImage.length > 0 ? (
            <img 
              src={mainProductImage[0]} 
              alt="Image principale du produit" 
              className="main-product-image" 
              style={{ width: "500px", height: "500px", objectFit: "cover" }}
            />
          ) : (
            <img src={product.thumbnail_url} alt="Aucune image" className="main-product-image" />
          )}
        </div>

        {/* Section Informations */}
        <div className="product-info">
          <h1 className="product-title">{productName}</h1>
          <p className="product-price">CHF 46.00</p>
          <p className="tax-info">Taxes incluses.</p>

          {hasColors && (
            <div className="color-selection">
              <p><strong>Couleur</strong></p>
              <div className="color-buttons">
                {availableColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`color-button ${color === selectedColor ? 'selected' : ''}`}
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
                {availableSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`size-button ${size === selectedSize ? 'selected' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bouton pour ouvrir la description */}
          <div className="product-actions">
            <button className="description-button" onClick={() => setIsDescriptionOpen(true)}>Description</button>
            <button className="add-to-cart">Ajouter au panier</button>
          </div>
        </div>
      </div>

      {/* Fenêtre latérale de description */}
      {isDescriptionOpen && (
        <div className={`description-overlay ${isDescriptionOpen ? "open" : ""}`}>
          <div className="description-panel">
          <button className="close-description" onClick={() => setIsDescriptionOpen(false)}>×</button>
            <h2>Description</h2>
            <p>{productDescription}</p>
          </div>
        </div>
      )}

    </Layout>
  );
};

export const query = graphql`
  query($id: String!) {
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
          id
          filename
          preview_url
        }
      }
    }
  }
`;

export default ProductTemplate;