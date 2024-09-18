import React, { useState } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import './product-template.css';

const ProductTemplate = ({ data }) => {
  const productNodes = data.allProductsCsv.nodes;
  const product = productNodes[0];

  // Toutes les images du produit
  const productImages = productNodes.map(node => node.Image_Src).filter(Boolean);

  // Récupérer les images pour une couleur donnée
  const getImagesForColor = (color) => {
    return productNodes
      .filter(node => node.Option1_Name === 'Couleur' && node.Option1_Value === color)
      .map(node => node.Image_Src)
      .filter(Boolean);
  };

  // Récupérer toutes les couleurs disponibles pour ce produit
  const colors = productNodes
    .filter(node => node.Option1_Name === 'Couleur')
    .map(node => node.Option1_Value)
    .filter(Boolean);

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
                alt={product.Image_Alt_Text || `Image du produit ${selectedImage + 1}`}
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
          <h1 className="product-title">{product.Title}</h1>
          <p className="product-price">{product.Variant_Price} CHF</p>

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

          <div className="product-description" dangerouslySetInnerHTML={{ __html: product.Body_HTML }} />
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