import React, { useState } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import './product-template.css'; // Keep the same CSS

const ProductTemplate = ({ data }) => {
  const product = data.productsCsv;
  const [selectedSize, setSelectedSize] = useState('2XS'); // Default size selection
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0); // Track the main displayed image

  const sizes = ['2XS', 'XS', 'S', 'M', 'L', 'XL'];

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (change) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + change));
  };

  // Assuming `Variant_Image` is a comma-separated list of image URLs
  const productImages = product.Variant_Image ? product.Variant_Image.split(',') : [];

  // Function to handle moving to the next or previous image in the carousel
  const handleCarousel = (direction) => {
    if (direction === 'next') {
      setSelectedImage((prevIndex) => (prevIndex + 1) % productImages.length); // Moves forward
    } else {
      setSelectedImage((prevIndex) => (prevIndex - 1 + productImages.length) % productImages.length); // Moves backward
    }
  };

  return (
    <Layout>
      <div className="product-container">
        {/* Left Section: Product Images */}
        <div className="product-images">
          {/* Display the main selected image */}
          {productImages.length > 0 && (
            <>
              <img
                src={productImages[selectedImage]} // Show the selected image
                alt={product.Image_Alt_Text || `Product Image ${selectedImage + 1}`}
                className="main-product-image"
              />

              {/* Mobile-only: Carousel buttons for image navigation */}
              <div className="carousel-controls">
                <button onClick={() => handleCarousel('prev')} className="carousel-button left-arrow">❮</button>
                <button onClick={() => handleCarousel('next')} className="carousel-button right-arrow">❯</button>
              </div>
            </>
          )}
        </div>

        {/* Right Section: Product Info */}
        <div className="product-info">
          <h1 className="product-title">{product.Title}</h1>
          <p className="product-price">{product.Variant_Price} CHF</p>

          {/* Size Selector */}
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

          {/* Quantity Selector */}
          <div className="product-quantity">
            <p><strong>Quantité</strong></p>
            <div className="quantity-control">
              <button onClick={() => handleQuantityChange(-1)} className="quantity-button">-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} className="quantity-button">+</button>
            </div>
          </div>

          {/* Add to Cart and PayPal Buttons */}
          <div className="product-buttons">
            <button className="add-to-cart">Ajouter au panier</button>
            <button className="paypal-button">Acheter avec PayPal</button>
          </div>

          {/* Product Description */}
          <div className="product-description" dangerouslySetInnerHTML={{ __html: product.Body_HTML }} />
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query($handle: String!) {
    productsCsv(Handle: { eq: $handle }) {
      Handle
      Title
      Body_HTML
      Variant_Price
      Image_Src
      Image_Alt_Text
      Image_Position
      Variant_Image
    }
  }
`;

export default ProductTemplate;