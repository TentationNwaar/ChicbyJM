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
function getProductImage(product, variant) {
  console.log("🔎 Variant files:", variant.files.map(f => f.filename));
  console.log("🧵 Product variant image test", {
  name: product.name,
  selectedColor,
  selectedSize,
  selectedImage,
  fallback: product.thumbnail_url
});
  if (!variant || !variant.files || variant.files.length === 0) {
    return product.thumbnail_url;
  }

  const validImage = variant.files.find((file) => {
    const filename = file.filename?.toLowerCase() || "";
    return (
      file.preview_url &&
      filename.includes("front") && // prioritize front-facing full image
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
  const [selectedColor, setSelectedColor] = useState(() => {
    const first = availableColors[0];
    return first || null;
  });

  const [selectedSize, setSelectedSize] = useState(() => {
    const first = availableSizes[0];
    return first || null;
  });
  const [selectedImage, setSelectedImage] = useState(product.thumbnail_url);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  // Met à jour l'image sélectionnée chaque fois que la couleur ou la taille change
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
    console.log("🔎 Variant files:", matchingVariant.files.map(f => f.filename));
    console.log("🧵 Image debug", {
      name: product.name,
      selectedColor,
      selectedSize,
      fallback: product.thumbnail_url
    });

    const validImage = matchingVariant.files.find((file) => {
      const filename = file.filename?.toLowerCase() || "";
      return (
        file.preview_url &&
        filename.includes("front") && // essaie de choper une vraie mockup
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
    // Si aucune couleur ou taille n'est sélectionnée, utilisez la première variante disponible
    const selectedVariant = variants.find((variant) => {
      const variantName = parseVariantName(variant.name);
      return (
        (!selectedColor || variantName.color === selectedColor) &&
        (!selectedSize || variantName.size === selectedSize)
      );
    });
  
    // Si aucune variante correspondante n'est trouvée, utiliser la première variante disponible
    if (!selectedVariant) {
      alert("Produit ajouté au panier sans couleur ni taille spécifiées.");
      const defaultVariant = variants[0]; // Utilisation de la première variante disponible.
      addToCart({
        id: defaultVariant.id,
        name: product.name,
        color: selectedColor || "Aucune",
        size: selectedSize || "Aucune",
        price: parseFloat(defaultVariant.retail_price || product.sync_variants[0].retail_price) || 0,
        image: getProductImage(product, defaultVariant),
      });
      alert("Produit ajouté au panier !");
    } else {
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
    }
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