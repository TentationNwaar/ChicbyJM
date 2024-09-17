import React, { useState } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import './product-template.css';

const ProductTemplate = ({ data }) => {
  // Récupère toutes les lignes du produit
  const productNodes = data.allProductsCsv.nodes;

  // Utilise la première ligne pour les informations du produit
  const product = productNodes[0];

  // Récupère toutes les URLs d'images du produit
  const productImages = productNodes
    .map(node => node.Image_Src) // Récupère l'URL d'image de chaque ligne
    .filter(Boolean); // Supprime les lignes sans URL d'image

  const [selectedSize, setSelectedSize] = useState('2XS');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const sizes = ['2XS', 'XS', 'S', 'M', 'L', 'XL'];

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (change) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + change));
  };

  const handleCarousel = (direction) => {
    if (direction === 'next') {
      setSelectedImage((prevIndex) => (prevIndex + 1) % productImages.length);
    } else {
      setSelectedImage((prevIndex) => (prevIndex - 1 + productImages.length) % productImages.length);
    }
  };

  return (
    <Layout>
      <div className="product-container">
        {/* Section Gauche : Images du produit */}
        <div className="product-images">
          {/* Affiche l'image principale sélectionnée */}
          {productImages.length > 0 && (
            <>
              <img
                src={productImages[selectedImage]}
                alt={product.Image_Alt_Text || `Image du produit ${selectedImage + 1}`}
                className="main-product-image"
              />

              {/* Pour les ordinateurs de bureau : Grille des vignettes */}
              <div className="desktop-thumbnails">
                {productImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Vignette ${index + 1}`}
                    className={`thumbnail-image ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>

              {/* Pour les mobiles : Boutons de navigation du carousel */}
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
              {sizes.map(size => (
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

          {/* Sélecteur de quantité */}
          <div className="product-quantity">
            <p><strong>Quantité</strong></p>
            <div className="quantity-control">
              <button onClick={() => handleQuantityChange(-1)} className="quantity-button">-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} className="quantity-button">+</button>
            </div>
          </div>

          {/* Boutons Ajouter au panier et PayPal */}
          <div className="product-buttons">
            <button className="add-to-cart">Ajouter au panier</button>
            <button className="paypal-button">Acheter avec PayPal</button>
          </div>

          {/* Description du produit */}
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
      }
    }
  }
`;

export default ProductTemplate;