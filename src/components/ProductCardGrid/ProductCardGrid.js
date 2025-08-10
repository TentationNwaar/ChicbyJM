import React, { useState } from 'react';
import * as styles from './ProductCardGrid.module.css';

import Drawer from '../Drawer';
import ProductCard from '../ProductCard';
import QuickView from '../QuickView';
import Slider from '../Slider';

const ProductCardGrid = ({ height, columns = 4, data, spacing = 32, showSlider = false }) => {
  const [showQuickView, setShowQuickView] = useState(false);

  const renderCards = () => {
    if (!Array.isArray(data)) return null;

    return data.map(({ node }, index) => {
      if (!node) return null;

      // Detect Printful vs frontmatter shape
      const isPrintful = !!node.thumbnail_url || !!node.slug;

      // Normalized fields
      const title = isPrintful
        ? node.name
        : node.frontmatter?.title;

      const img =
        (isPrintful ? node.thumbnail_url : node.frontmatter?.image?.childImageSharp?.gatsbyImageData) || null;

      // Prefer Printful variant price
      const variant = isPrintful && Array.isArray(node.sync_variants) ? node.sync_variants[0] : null;

      const displayPrice = (isPrintful && variant?.retail_price)
        ? `${variant.retail_price} ${variant?.currency || ''}`.trim()
        : (
            typeof node?.frontmatter?.price === 'object' && node.frontmatter.price?.retail_price
              ? `${node.frontmatter.price.retail_price} ${node.frontmatter.price.currency || ''}`.trim()
              : (typeof node?.frontmatter?.price === 'string' ? node.frontmatter.price : '')
          ) || '';

      const originalPrice =
        node?.originalPrice && typeof node.originalPrice === 'object' &&
        node.originalPrice.retail_price && node.originalPrice.currency
          ? `${node.originalPrice.retail_price} ${node.originalPrice.currency}`
          : (typeof node?.originalPrice === 'string' ? node.originalPrice : null);

      // Correct product link for Printful pages created in gatsby-node.js
      const link = isPrintful
        ? `/en/product/${(node.slug || '').replace(/^\/+|\/+$/g, '')}/`
        : node.fields?.slug || null;

      // Minimal guards
      if (!title || !img) return null;

      return (
        <ProductCard
          key={node.id || index}
          height={height}
          price={displayPrice}
          imageAlt={title}
          name={title}
          image={img}
          meta={''}
          originalPrice={originalPrice}
          link={link}
          showQuickView={() => setShowQuickView(true)}
          productId={node.id}
        />
      );
    });
  };

  return (
    <div className={styles.root}>
      <div className={styles.cardGrid}>
        {renderCards()}
      </div>

      {showSlider && (
        <div className={styles.mobileSlider}>
          <Slider spacing={spacing}>{renderCards()}</Slider>
        </div>
      )}

      <Drawer visible={showQuickView} close={() => setShowQuickView(false)}>
        <QuickView close={() => setShowQuickView(false)} />
      </Drawer>
    </div>
  );
};

export default ProductCardGrid;