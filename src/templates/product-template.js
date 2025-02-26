import React, { useState, useEffect, useContext } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import { CartContext } from '../context/CartContext'; 
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

function getProductImage(product, selectedVariant) {
  if (selectedVariant && selectedVariant.files && selectedVariant.files.length > 0) {
    const variantImage = selectedVariant.files.find(file =>
      file.filename &&
      !file.filename.toLowerCase().includes("logo") &&
      !file.filename.toLowerCase().includes("mockup") &&
      !file.filename.toLowerCase().includes("preview")
    );
    if (variantImage) {
      return variantImage.preview_url;
    }
  }
  return product.thumbnail_url; // Image principale du produit par défaut
}

const ProductTemplate = ({ data }) => {
  const product = data.printfulProduct;
  const variants = product.sync_variants || [];

  const isBrowser = typeof window !== "undefined";
  const cartContext = isBrowser ? useContext(CartContext) : null;
  const addToCart = cartContext ? cartContext.addToCart : null;

  console.log("Product Data:", product);
  console.log("Variants:", variants);

  console.log("Données récupérées :", product);

  if (!isBrowser) {
    return null; // 🚀 Empêche l'erreur en SSR en ne rendant rien
  }

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

  // ✅ États
  const [selectedColor, setSelectedColor] = useState(hasColors ? availableColors[0] : null);
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || null);
  const [selectedImage, setSelectedImage] = useState(product.thumbnail_url);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  

  // 📌 Met à jour l’image et les tailles selon la couleur sélectionnée
  useEffect(() => {
    const matchingVariant = variants.find(
      variant => parseVariantName(variant.name).color === selectedColor
    );
  
    setSelectedImage(getProductImage(product, matchingVariant)); // ✅ Met à jour l’image dynamiquement
  }, [selectedColor]);

  const handleAddToCart = () => {
    const selectedVariant = variants.find(
      variant =>
        parseVariantName(variant.name).color === selectedColor &&
        parseVariantName(variant.name).size === selectedSize
    );
  
    if (!selectedVariant && hasColors) {
      alert("Veuillez sélectionner une couleur.");
      return;
    }
  
    // Récupération de l'image correcte
    const productImage = getProductImage(product, selectedVariant);
  
    addToCart({
      id: selectedVariant?.id || product.id, // Utilise l'ID de la variante si dispo, sinon du produit
      name: product.name,
      color: selectedColor || "Aucune",
      size: selectedSize || "Aucune",
      price: parseFloat(selectedVariant?.retail_price || product.sync_variants[0]?.retail_price) || 0,
      image: productImage, // ✅ Image correspondant à la sélection
    });
  
    alert("Produit ajouté au panier !");
  };

  if (!isBrowser) {
    return <p>Chargement...</p>;
  }

  
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

          {/* Bouton Ajouter au panier */}
          <div className="product-actions">
          <button className="add-to-cart" onClick={handleAddToCart}>Ajouter au panier</button>
            <button className="description-button" onClick={() => setIsDescriptionOpen(true)}>
              Description
            </button>
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