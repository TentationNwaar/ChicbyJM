import React, { useState } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import './product-template.css';

/**
 * Extrait la couleur et la taille d’un nom de variante.
 * Exemple : "Casquette Snapback JM / Noir - M" donnera { color: "Noir", size: "M" }.
 */
function parseVariantName(fullName) {
  const result = { color: '', size: '' };
  if (!fullName) return result;

  const parts = fullName.split('/');
  if (parts.length < 2) return result;
  
  // La partie après '/' contient "Couleur - Taille"
  const details = parts[1].trim();
  const detailParts = details.split('-');
  if (detailParts.length >= 1) {
    result.color = detailParts[0].trim();
  }
  if (detailParts.length >= 2) {
    result.size = detailParts[1].trim();
  }
  return result;
}

function filterProductImages(files = []) {
  return files.filter(file => {
    const url = file.preview_url.toLowerCase();
    return (
      !url.includes("logo") &&      // Exclure les images avec "logo"
      !url.includes("mockup") &&    // Exclure les mockups si présents
      !url.includes("icon") &&      // Exclure les icônes éventuelles
      (url.includes("front") || url.includes("back") || url.includes("side")) // Prendre les images principales
    );
  });
}

const ProductTemplate = ({ data }) => {
  const product = data.printfulProduct;
  const variants = product.sync_variants || [];

  // Extraire toutes les couleurs uniques
  const availableColors = Array.from(
    new Set(
      variants
        .map(variant => {
          const { color } = parseVariantName(variant.name);
          return color;
        })
        .filter(Boolean)
    )
  );

  // État : couleur et taille sélectionnées
  const [selectedColor, setSelectedColor] = useState(availableColors[0] || null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Tailles disponibles pour la couleur sélectionnée
  const availableSizes = variants
    .filter(variant => {
      const { color } = parseVariantName(variant.name);
      return color.toLowerCase() === selectedColor?.toLowerCase();
    })
    .map(variant => parseVariantName(variant.name).size)
    .filter(Boolean);

  // Mettre à jour la taille sélectionnée à chaque fois qu’une nouvelle couleur est choisie
  React.useEffect(() => {
    setCurrentImageIndex(0); // Réinitialiser l'image affichée à la première disponible
  }, [selectedColor]);

  const sortedSizes = availableSizes.sort((a, b) => {
    const sizeOrder = ["2XS", "XS", "S", "M", "L", "XL", "XXL"];
    return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
  });

  // Variante actuellement sélectionnée
  const currentVariant = variants.find(variant => {
    const { color, size } = parseVariantName(variant.name);
    return (
      color.toLowerCase() === selectedColor?.toLowerCase() &&
      size.toLowerCase() === selectedSize?.toLowerCase()
    );
  }) || null;

  // Images : filtrer par couleur et exclure les logos
  const colorImages = variants
    .filter(variant => {
      const { color } = parseVariantName(variant.name);
      return color.toLowerCase() === selectedColor?.toLowerCase();
    })
    .flatMap(variant => filterProductImages(variant.files))
    .filter(Boolean);

  // Utiliser les images du produit par défaut si aucune image de variante disponible
  const imagesToDisplay = colorImages.length > 0 ? colorImages : [{ id: 'fallback', preview_url: product.thumbnail_url }];

  // Carousel d'images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imagesToDisplay.length);
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imagesToDisplay.length) % imagesToDisplay.length);
  };

  // Trouver le prix le plus bas parmi toutes les variantes
  const minPrice = variants.length ? Math.min(...variants.map(variant => parseFloat(variant.retail_price))) : null;

  const addToCart = () => {
    alert(`Ajouté au panier :
- Produit : ${product.name}
- Couleur : ${selectedColor}
- Taille : ${selectedSize}
- Prix : ${currentVariant?.retail_price} ${currentVariant?.currency}`);
  };

  return (
    <Layout>
      <div className="product-container">
        {/* Section Images (Carousel) */}
        <div className="product-images">
          {imagesToDisplay.length > 0 && (
            <div className="carousel">
              <button onClick={prevImage} className="carousel-button left">❮</button>
              <img
                src={imagesToDisplay[currentImageIndex].preview_url}
                alt={`Image ${currentImageIndex + 1}`}
                className="main-product-image"
              />
              <button onClick={nextImage} className="carousel-button right">❯</button>
            </div>
          )}
          <div className="thumbnails">
            {imagesToDisplay.map((image, index) => (
              <img
                key={index}
                src={image.preview_url}
                alt={`Miniature ${index + 1}`}
                className={`thumbnail-image ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Section Informations */}
        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>

          {/* Couleurs disponibles */}
          {availableColors.length > 0 && selectedColor && (
            <div className="color-selection">
              <p><strong>Couleurs disponibles :</strong></p>
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

          {/* Tailles disponibles */}
          {availableSizes.length > 0 && selectedSize && (
            <div className="size-selection">
              <p><strong>Tailles disponibles :</strong></p>
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

          {/* Affichage du prix */}
          <p className="product-price">
            {currentVariant ? (
              <>
                {currentVariant.retail_price} {currentVariant.currency}
              </>
            ) : (
              <>
                {minPrice ? `${minPrice.toFixed(2)} CHF` : "Prix indisponible"}
              </>
            )}
          </p>

          {/* Boutons d'action */}
          <div className="product-actions">
            <button onClick={addToCart} className="add-to-cart">Ajouter au panier</button>
          </div>
        </div>
      </div>
    </Layout>
  );
  {sortedSizes.map(size => (
    <button
      key={size}
      onClick={() => setSelectedSize(size)}
      className={`size-button ${size === selectedSize ? 'selected' : ''}`}
    >
      {size}
    </button>
  ))}
};

export const query = graphql`
  query($id: String!) {
    printfulProduct(id: { eq: $id }) {
      id
      name
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