import React, { useEffect, useState } from 'react';
import * as styles from './ProductCardGrid.module.css';

import Drawer from '../Drawer';
import ProductCard from '../ProductCard';
import QuickView from '../QuickView';
// import Slider from '../Slider'; // 🔕 Désactivé pour éviter tout conflit d'affichage mobile

/**
 * Product grid with mobile-safe rendering.
 * - Always renders the grid (no slider fallback that could be empty)
 * - Exposes CSS variables for columns & spacing so CSS can adapt by breakpoints
 */
const ProductCardGrid = ({ height, columns = 4, data, spacing = 32, showSlider = false }) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const [isTinyMobile, setIsTinyMobile] = useState(false); // < 430px
  const [isMobile, setIsMobile] = useState(false); // <= 802px

  // Detect ultra-small screens to adjust columns to 1
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(max-width: 430px)');
    const handler = () => setIsTinyMobile(mql.matches);
    handler();
    mql.addEventListener ? mql.addEventListener('change', handler) : mql.addListener(handler);
    return () => {
      mql.removeEventListener ? mql.removeEventListener('change', handler) : mql.removeListener(handler);
    };
  }, []);

  // Detect mobile screens (<= 802px) to force 1 column and enable compact cards
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(max-width: 802px)');
    const handler = () => setIsMobile(mql.matches);
    handler();
    mql.addEventListener ? mql.addEventListener('change', handler) : mql.addListener(handler);
    return () => {
      mql.removeEventListener ? mql.removeEventListener('change', handler) : mql.removeListener(handler);
    };
  }, []);

  const renderCards = () => {
    if (!Array.isArray(data) || data.length === 0) return null;

    return data.map(({ node }, index) => {
      if (!node) return null;

      // Detect Printful vs frontmatter shape
      const isPrintful = !!node.thumbnail_url || !!node.slug;

      // Normalized fields
      const title = isPrintful ? node.name : node.frontmatter?.title;

      const img =
        (isPrintful ? node.thumbnail_url : node.frontmatter?.image?.childImageSharp?.gatsbyImageData) || null;

      // Prefer Printful variant price
      const variant = isPrintful && Array.isArray(node.sync_variants) ? node.sync_variants[0] : null;

      const displayPrice =
        (isPrintful && variant?.retail_price)
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
        <div
          className={styles.cardItem}
          data-compact={isMobile ? 'true' : 'false'}
          data-tiny={isTinyMobile ? 'true' : 'false'}
          key={node.id || index}
        >
          <ProductCard
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
        </div>
      );
    });
  };

  const cards = renderCards();

  return (
    <div className={styles.root}>
      {/* Always render the grid. Control layout via CSS variables. */}
      <div
        className={styles.cardGrid}
        data-mobile={isMobile ? 'true' : 'false'}
        style={{
          '--grid-columns': isMobile ? 1 : columns,
          '--grid-gap': `${Math.max(0, spacing)}px`,
        }}
      >
        {cards}
      </div>

      {/* 🔕 Slider désactivé pour éviter le "grid hidden / slider vide" sur mobile */}
      {/* {showSlider && (
        <div className={styles.mobileSlider}>
          <Slider spacing={spacing}>{cards}</Slider>
        </div>
      )} */}

      {/* Quick view */}
      <Drawer visible={showQuickView} close={() => setShowQuickView(false)}>
        <QuickView close={() => setShowQuickView(false)} />
      </Drawer>

      {/* Fallback si aucune carte */}
      {!cards && (
        <div className={styles.empty}>
          Aucun produit à afficher.
        </div>
      )}
    </div>
  );
};

export default ProductCardGrid;