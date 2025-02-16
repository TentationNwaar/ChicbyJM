import React, { useState } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import './product-template.css';

const ProductTemplate = ({ data }) => {
  const productNodes = data.allProductsCsv.nodes;

// Fonction pour ajuster le nom des couleurs en fonction de l'image ou d'autres critères
const adjustColorName = (imageUrl, originalColor) => {
  if (!imageUrl || originalColor.toLowerCase().includes('default title')) return null; // Ne pas afficher si l'image est absente ou la couleur contient 'default title'

  // Définir des correspondances basées sur des parties d'URL ou d'autres attributs
  if (imageUrl.includes('maroon')) return 'Bordeaux';
  if (imageUrl.includes('black')) return 'Noir';
  if (imageUrl.includes('red')) return 'Rouge';
  if (imageUrl.includes('navy')) return 'Bleu Marine';
  if (imageUrl.includes('purple')) return 'Violet';
  if (imageUrl.includes('royal')) return 'Bleu Roi';
  if (imageUrl.includes('charcoal')) return 'Anthracite';
  if (imageUrl.includes('chocolate')) return 'Chocolat Noir';
  if (imageUrl.includes('cardinal')) return 'Rouge Cardinal';
  if (imageUrl.includes('rose')) return 'Rose';
  if (imageUrl.includes('grey') || imageUrl.includes('gray')) return 'Gris Foncé Chiné';
  if (imageUrl.includes('military')) return 'Vert Militaire';
  if (imageUrl.includes('orange')) return 'Orange';
  if (imageUrl.includes('mint')) return 'Vert Menthe';

  // Retour par défaut si aucune règle ne correspond
  return originalColor;
};

// Récupérer toutes les couleurs disponibles et ajuster leur nom en fonction de l'image
const colors = [...new Set(
  productNodes
    .map(node => adjustColorName(node.Image_Src, node.Option1_Value && node.Option1_Value.trim())) // Ajuster le nom de la couleur
    .filter(Boolean) // Filtrer les valeurs nulles ou vides
)];

// Log des couleurs ajustées
console.log('Couleurs ajustées selon les images :', colors);


  // Log des couleurs récupérées
  console.log('Toutes les couleurs récupérées :', colors);

  // Toutes les images du produit
  const productImages = productNodes.map(node => node.Image_Src).filter(Boolean);

  // Récupérer les images pour une couleur donnée
  const getImagesForColor = (color) => {
    return productNodes
      .filter(node => node.Option1_Value === color) // On ne filtre plus par handle
      .map(node => node.Image_Src)
      .filter(Boolean);
  };

  // Exemple d'utilisation pour chaque couleur trouvée
  colors.forEach(color => {
    const images = getImagesForColor(color);
    console.log(`Images pour la couleur ${color}:`, images);
  });

  const [selectedSize, setSelectedSize] = useState('2XS');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null); // Pas de couleur sélectionnée par défaut

  const sizes = ['2XS', 'XS', 'S', 'M', 'L', 'XL'];

  const handleSizeSelect = (size) => setSelectedSize(size);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedImage(0); // Remettre à zéro l'image sélectionnée
  };

  const handleQuantityChange = (change) => setQuantity((prevQuantity) => Math.max(1, prevQuantity + change));

  const handleCarousel = (direction) => {
    const currentImages = reorderImagesByColor();
    if (direction === 'next') {
      setSelectedImage((prevIndex) => (prevIndex + 1) % currentImages.length);
    } else {
      setSelectedImage((prevIndex) => (prevIndex - 1 + currentImages.length) % currentImages.length);
    }
  };

  // Fonction pour réorganiser les images : d'abord celles de la couleur sélectionnée, puis les autres
  const reorderImagesByColor = () => {
    if (!selectedColor) {
      return productImages; // Aucune couleur sélectionnée, retourner toutes les images
    }

    const colorImages = getImagesForColor(selectedColor);
    const otherImages = productImages.filter(image => !colorImages.includes(image));

    return [...colorImages, ...otherImages]; // Combiner les images
  };

  // Déterminer les images à afficher (réorganisées par la couleur sélectionnée)
  const displayedImages = reorderImagesByColor();

  return (
    <Layout>
      <div className="product-container">
        {/* Section Gauche : Images du produit */}
        <div className="product-images">
          {displayedImages.length > 0 && (
            <>
              <img
                src={displayedImages[selectedImage]}
                alt={`Image du produit ${selectedImage + 1}`}
                className="main-product-image"
              />

              <div className="desktop-thumbnails">
                {displayedImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Vignette ${index + 1}`}
                    className={`thumbnail-image ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>

              <div className="carousel-controls">
                <button onClick={() => handleCarousel('prev')} className="carousel-button left-arrow">❮</button>
                <button onClick={() => handleCarousel('next')} className="carousel-button right-arrow">❯</button>
              </div>
            </>
          )}
        </div>

        {/* Section Droite : Informations sur le produit */}
        <div className="product-info">
          <h1 className="product-title">{data.allProductsCsv.nodes[0].Title}</h1> {/* Afficher le titre du premier produit */}
          <p className="product-price">{data.allProductsCsv.nodes[0].Variant_Price} CHF</p>

          {/* Sélecteur de taille */}
          <div className="product-sizes">
            <p><strong>Taille</strong></p>
            <div className="size-buttons">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Sélecteur de couleur */}
          {colors.length > 0 && (
            <div className="product-colors">
              <p><strong>Couleur</strong></p>
              <div className="color-buttons">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={`color-button ${selectedColor === color ? 'selected' : ''}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sélecteur de quantité */}
          <div className="product-quantity">
            <p><strong>Quantité</strong></p>
            <div className="quantity-control">
              <button onClick={() => handleQuantityChange(-1)} className="quantity-button">-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} className="quantity-button">+</button>
            </div>
          </div>

          <div className="product-buttons">
            <button className="add-to-cart">Ajouter au panier</button>
            <button className="paypal-button">Acheter avec PayPal</button>
          </div>

          <div className="product-description" dangerouslySetInnerHTML={{ __html: data.allProductsCsv.nodes[0].Body_HTML }} />
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query($handle: String!) {
    allProductsCsv(filter: { Handle: { eq: $handle } }) {
      nodes {
        Handle
        Title
        Body_HTML
        Variant_Price
        Image_Src
        Image_Alt_Text
        Option1_Name
        Option1_Value
      }
    }
  }
`;

export default ProductTemplate;