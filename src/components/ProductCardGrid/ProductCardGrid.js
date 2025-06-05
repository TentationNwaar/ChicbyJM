import React, { useState } from 'react';
import * as styles from './ProductCardGrid.module.css';

import Drawer from '../Drawer';
import ProductCard from '../ProductCard';
import QuickView from '../QuickView';
import Slider from '../Slider';


const ProductCardGrid = (props) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const { height, columns = 3, data, spacing, showSlider = false } = props;
  
  const columnCount = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  const renderCards = () => {
    return data.map(({ node }, index) => {
      // Vérifiez que le node et le frontmatter existent
      if (!node || !node.frontmatter) {
        console.warn(`Node or frontmatter is undefined for node at index ${index}`);
        return null; // Ignorez ce node s'il est invalide
      }

      const { title, price, image } = node.frontmatter;

      // Vérifiez que les données nécessaires existent
      if (!title || !price || !image) {
        console.warn(`Missing data in frontmatter for node at index ${index}`);
        return null; // Ignorez ce node s'il manque des données essentielles
      }

      // Formater le prix et l'originalPrice en chaînes de caractères
      const formattedPrice = price && typeof price === 'object' 
        ? `${price.retail_price} ${price.currency}` 
        : price;

      const formattedOriginalPrice = node.originalPrice && typeof node.originalPrice === 'object' 
        ? `${node.originalPrice.retail_price} ${node.originalPrice.currency}` 
        : node.originalPrice;

      // Formater 'meta' si nécessaire
      const metaContent = node.meta && Array.isArray(node.meta) 
        ? node.meta.join(', ') 
        : node.meta;

      return (
        <ProductCard
          key={index}
          height={height}
          price={formattedPrice}
          imageAlt={title}
          name={title}
          image={image.childImageSharp?.gatsbyImageData}
          meta={metaContent}
          originalPrice={formattedOriginalPrice}
          link={node.fields.slug}
          showQuickView={() => setShowQuickView(true)}
        />
      );
    });
  };

  return (
    <div className={styles.root} style={columnCount}>
      <div
        className={`${styles.cardGrid} ${
          showSlider === false ? styles.show : ''
        }`}
        style={columnCount}
      >
        {data && renderCards()}
      </div>

      {showSlider === true && (
        <div className={styles.mobileSlider}>
          <Slider spacing={spacing}>{data && renderCards()}</Slider>
        </div>
      )}

      <Drawer visible={showQuickView} close={() => setShowQuickView(false)}>
        <QuickView close={() => setShowQuickView(false)} />
      </Drawer>
    </div>
  );
};

export default ProductCardGrid;