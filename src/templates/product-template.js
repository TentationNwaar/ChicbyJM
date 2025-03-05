import React, { useState, useEffect, useContext } from "react";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import { CartContext } from "../context/CartContext";
import "./product-template.css";

/**
 * Extrait la couleur et la taille d’un nom de variante.
 * Gère les cas où le nom de la variante peut avoir 2 ou 3 parties.
 */
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

/**
 * Retourne l'URL de l'image du produit en fonction de la variante sélectionnée.
 * Priorise les images de la variante et gère les cas où certaines informations
 * pourraient être manquantes.
 */
function getProductImage(product, selectedVariant) {
  if (selectedVariant && selectedVariant.files && selectedVariant.files.length > 0) {
    const variantImage = selectedVariant.files.find((file) => {
      const filename = file.filename ? file.filename.toLowerCase() : "";

      // Si le fichier est un "preview-file", on affiche l'image par défaut
      if (filename.includes("preview-file")) {
        return false; // ignorer les fichiers preview-file
      }
      
      // On ignore les fichiers logo et mockup
      return (
        filename &&
        !filename.includes("logo") &&
        !filename.includes("mockup")
      );
    });

    // Si une image variante est trouvée, retourner son URL
    if (variantImage) {
      return variantImage.preview_url;
    }
  }

  // Retourne l'image principale par défaut si pas de variante spécifique
  return product.thumbnail_url;
}

const ProductTemplate = ({ data }) => {
  if (!data || !data.printfulProduct) {
    return <div>Produit non trouvé</div>;
  }

  const product = data.printfulProduct;
  const variants = product.sync_variants || [];

  const isBrowser = typeof window !== "undefined";
  const cartContext = isBrowser ? useContext(CartContext) : null;
  const addToCart = cartContext ? cartContext.addToCart : null;

  // Si ce n'est pas un rendu côté client, ne rien rendre
  if (!isBrowser) {
    return <p>Chargement...</p>;
  }

  // Données de produit
  const productName = product.name.split("/")[0];

  // Extraction des couleurs et tailles disponibles à partir des variantes
  const extractedVariants = variants.map((variant) =>
    parseVariantName(variant.name)
  );
  const availableColors = Array.from(
    new Set(extractedVariants.map((variant) => variant.color).filter(Boolean))
  );
  const availableSizes = Array.from(
    new Set(extractedVariants.map((variant) => variant.size).filter(Boolean))
  );

  // États pour la couleur, la taille et l'image sélectionnées
  const [selectedColor, setSelectedColor] = useState(
    availableColors.length > 0 ? availableColors[0] : null
  );
  const [selectedSize, setSelectedSize] = useState(availableSizes.length > 0 ? availableSizes[0] : null);
  const [selectedImage, setSelectedImage] = useState(product.thumbnail_url);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  // Met à jour l'image sélectionnée chaque fois que la couleur ou la taille change
  useEffect(() => {
    // Si une couleur et une taille sont sélectionnées, chercher la variante
    if (selectedColor && selectedSize) {
      const matchingVariant = variants.find(
        (variant) =>
          parseVariantName(variant.name).color === selectedColor &&
          parseVariantName(variant.name).size === selectedSize
      );

      // Utiliser l'image de la variante, sinon l'image principale
      const productImage = matchingVariant
        ? getProductImage(product, matchingVariant)
        : product.thumbnail_url;

      setSelectedImage(productImage);
    } else {
      // Si aucune couleur ou taille n'est sélectionnée, afficher l'image principale
      setSelectedImage(product.thumbnail_url);
    }
  }, [selectedColor, selectedSize, variants, product]);

  // Ajout du produit au panier
  const handleAddToCart = () => {
    const selectedVariant = variants.find(
      (variant) =>
        parseVariantName(variant.name).color === selectedColor &&
        parseVariantName(variant.name).size === selectedSize
    );

    if (!selectedVariant) {
      alert("Veuillez sélectionner une couleur et une taille valides.");
      return;
    }

    const productImage = getProductImage(product, selectedVariant);

    addToCart({
      id: selectedVariant.id,
      name: product.name,
      color: selectedColor || "Aucune",
      size: selectedSize || "Aucune",
      price: parseFloat(selectedVariant.retail_price || product.sync_variants[0].retail_price) || 0,
      image: productImage,
    });

    alert("Produit ajouté au panier !");
  };

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

          {/* Sélection des couleurs */}
          {availableColors.length > 0 && (
            <div className="color-selection">
              <p>
                <strong>Couleur</strong>
              </p>
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

          {/* Sélection des tailles */}
          {availableSizes.length > 0 && (
            <div className="size-selection">
              <p>
                <strong>Taille</strong>
              </p>
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

          {/* Bouton Ajouter au panier */}
          <div className="product-actions">
            <button className="add-to-cart" onClick={handleAddToCart}>
              Ajouter au panier
            </button>
            <button
              className="description-button"
              onClick={() => setIsDescriptionOpen(true)}
            >
              Description
            </button>
          </div>
        </div>
      </div>

      {/* Fenêtre latérale de description */}
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