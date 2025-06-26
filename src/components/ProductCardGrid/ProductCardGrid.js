import React, { useState } from 'react';
import * as styles from './ProductCardGrid.module.css';

import Drawer from '../Drawer';
import ProductCard from '../ProductCard';
import QuickView from '../QuickView';
import Slider from '../Slider';

const ProductCardGrid = ({ height, columns = 4, data, spacing = 32, showSlider = false }) => {
  const [showQuickView, setShowQuickView] = useState(false);

  const gridStyle = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${spacing}px`,
  };

  const renderCards = () => {
    return data.map(({ node }, index) => {
      if (!node || !node.frontmatter) return null;

      const { title, price, image } = node.frontmatter;
      if (!title || !price || !image) return null;

      return (
        <ProductCard
          key={index}
          height={height}
          price={price && typeof price === 'object' && price.retail_price && price.currency 
          ? `${price.retail_price} ${price.currency}` 
          : typeof price === 'string' 
            ? price 
            : 'Prix indisponible'}
          imageAlt={title}
          name={title}
          image={image.childImageSharp?.gatsbyImageData}
          meta={node.meta}
          originalPrice={
            node.originalPrice && typeof node.originalPrice === 'object' &&
            node.originalPrice.retail_price && node.originalPrice.currency
              ? `${node.originalPrice.retail_price} ${node.originalPrice.currency}`
              : typeof node.originalPrice === 'string'
                ? node.originalPrice
                : null
          }
          link={node.fields.slug}
          showQuickView={() => setShowQuickView(true)}
        />
      );
    });
  };

  return (
    <div className={styles.root}>
      <div className={styles.cardGrid} style={{ 
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${spacing}px`
      }}>
        {data && renderCards()}
      </div>

      {showSlider && (
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