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
 * Récupère les images principales d’une variante.
 */
function getMainProductImage(variant) {
  if (!variant || !variant.files) return [];

  return variant.files
    .filter(file => 
      file.filename &&
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
  const [selectedImage, setSelectedImage] = useState(product.thumbnail_url);
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  // 📌 Mettre à jour l’image principale lorsqu’on change de couleur
  useEffect(() => {
    const matchingVariant = variants.find(variant => parseVariantName(variant.name).color === selectedColor);
    if (matchingVariant) {
      const newImage = getMainProductImage(matchingVariant);
      setSelectedImage(newImage.length > 0 ? newImage[0] : product.thumbnail_url);
    }
  }, [selectedColor]);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  return (
    <Layout>
      <div className="product-container">
        {/* Section Images */}
        <div className="product-images-container">
          <img 
            src={selectedImage} 
            alt="Image principale du produit" 
            className="main-product-image" 
            style={{ width: "500px", height: "500px", objectFit: "cover" }}
          />
        </div>

        {/* Section Informations */}
        <div className="product-info">
          <h1 className="product-title">{productName}</h1>
          <p className="product-price">CHF {variants[0]?.retail_price || "N/A"}</p>
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
            <p>{product.description}</p>

            {/* Guide des tailles */}
            {product.size_guide && (
              <div className="size-guide">
                <h3>Guide des tailles</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Taille</th>
                      <th>Tour de poitrine (cm)</th>
                      <th>Longueur (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.size_guide.map((size, index) => (
                      <tr key={index}>
                        <td>{size.size}</td>
                        <td>{size.chest}</td>
                        <td>{size.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Informations de provenance */}
            {product.sourcing && (
              <>
                <h3>Informations de provenance</h3>
                <p><strong>Pays d'origine :</strong> {product.sourcing.origin_country}</p>
                {product.sourcing.materials.length > 0 && (
                  <p><strong>Matériaux :</strong> {product.sourcing.materials.join(", ")}</p>
                )}
              </>
            )}
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
    size_guide {
      size
      chest
      length
    }
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
  }
}
`;

export default ProductTemplate;