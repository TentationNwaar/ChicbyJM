import React, { useState } from 'react';
import * as styles from './ProductCardGrid.module.css';

import Drawer from '../Drawer';
import ProductCard from '../ProductCard';
import QuickView from '../QuickView';
import Slider from '../Slider';

const ProductCardGrid = (image, ...props) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const { height, columns = 3, data, spacing, showSlider = false } = props;
  const columnCount = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  const renderCards = () => {
    return data.map(({ node }, index) => {
      // Assurez-vous que node et node.frontmatter existent
      if (!node || !node.frontmatter) {
        console.warn(`Node or frontmatter is undefined for node at index ${index}`);
        return null; // Ignorer ce node si frontmatter est absent
      }
  
      const { title, price, image } = node.frontmatter;
  
      return (
        <ProductCard
          key={index}
          height={height}
          price={price}
          imageAlt={title}
          name={title}
          image={image.childImageSharp?.gatsbyImageData}
          meta={node.meta}
          originalPrice={node.originalPrice}
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
