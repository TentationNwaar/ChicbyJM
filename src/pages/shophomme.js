import React, { useState, useEffect, useMemo } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import * as styles from './shop.module.css';

import Banner from '../components/Banner';
import Container from '../components/Container';
import Chip from '../components/Chip';
import Icon from '../components/Icons/Icon';
import Layout from '../components/Layout';
import LayoutOption from '../components/LayoutOption';
import ProductCardGrid from '../components/ProductCardGrid';
import FiltersPanel from '../components/FiltersPanel';
import Config from '../config.json';
import { filterAndSort } from '../utils/catalogFilters';

const ShopPage = () => {
  // 1️⃣ Requête GraphQL pour récupérer les produits
  const data = useStaticQuery(graphql`
    query {
      allPrintfulProduct {
        edges {
          node {
            id
            name
            slug
            thumbnail_url
            sync_variants {
              id
              name
              retail_price
              currency
            }
          }
        }
      }
    }
  `);

  // 2️⃣ Liste complète de produits
  const products = data.allPrintfulProduct.edges;

  // ✅ Sous-ensemble "Homme" (y compris unisexe)
  const baseProducts = useMemo(
    () =>
      products.filter(({ node }) => {
        const nm = (node?.name || '').toLowerCase();
        return nm.includes('homme') || nm.includes('unisexe');
      }),
    [products]
  );

  // 3️⃣ États pour la gestion des filtres et du tri
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [sortOption, setSortOption] = useState(null);

  // ✅ Toggle a checkbox value for a given category (from Config.filters)
  const toggleFilterValue = (category, name) => {
    setActiveFilters((prev) => {
      const current = new Set(prev[category] || []);
      if (current.has(name)) current.delete(name);
      else current.add(name);

      const next = { ...prev };
      if (current.size > 0) next[category] = Array.from(current);
      else delete next[category];
      return next;
    });
  };

  const resetFilters = () => setActiveFilters({});

  // 4️⃣ Fermer le panneau de filtres via ESC
  useEffect(() => {
    const escapeHandler = (e) => {
      if (e.keyCode === 27) setShowFilter(false);
    };
    window.addEventListener('keydown', escapeHandler);
    return () => window.removeEventListener('keydown', escapeHandler);
  }, []);

  // 5️⃣ Fonction pour retirer un filtre actif (via chip)
  const removeFilter = (categoryName, value) => {
    setActiveFilters((prevFilters) => {
      const next = { ...prevFilters };
      if (!next[categoryName]) return prevFilters;
      next[categoryName] = next[categoryName].filter((v) => v !== value);
      if (next[categoryName].length === 0) delete next[categoryName];
      return next;
    });
  };

  // 6-7️⃣ Filtrer + trier via util partagé (en partant du sous-ensemble Homme)
  const sortedProducts = useMemo(
    () => filterAndSort(baseProducts, activeFilters, sortOption),
    [baseProducts, activeFilters, sortOption]
  );

  // 8️⃣ UI - Nombre d’articles
  const totalItems = baseProducts.length;
  const displayedItems = sortedProducts.length;

  return (
    <Layout>
      <div className={styles.root}>
        <Container size="large" spacing="min">
          <Banner name="Mode Homme" subtitle="Découvrez notre collection de vêtements pour homme." />
        </Container>

        <Container size="large" spacing="min">
          <div className={styles.metaContainer}>
            <span className={styles.itemCount}>{displayedItems} articles</span>
            <div className={styles.controllerContainer}>
              <div className={styles.iconContainer} role="presentation" onClick={() => setShowFilter(!showFilter)}>
                <Icon symbol="filter" />
                <span>Filtrer</span>
              </div>
              <div className={`${styles.iconContainer} ${styles.sortContainer}`}>
                <Icon symbol="caret" />
                <select onChange={(e) => setSortOption(e.target.value)} style={{ marginLeft: '8px' }}>
                  <option value="">Trier par</option>
                  <option value="priceAsc">Prix croissant</option>
                  <option value="priceDesc">Prix décroissant</option>
                  <option value="alphabet">Ordre alphabétique</option>
                </select>
              </div>
            </div>
          </div>

          {showFilter && (
            <FiltersPanel
              configFilters={Config.filters}
              activeFilters={activeFilters}
              onToggle={toggleFilterValue}
              onReset={resetFilters}
              onApply={() => setShowFilter(false)}
            />
          )}

          {/* Filtres actifs affichés */}
          <div className={styles.chipsContainer}>
            {Object.entries(activeFilters).map(([categoryName, selectedValues]) =>
              selectedValues.map((value) => (
                <Chip key={`${categoryName}-${value}`} name={value} onClick={() => removeFilter(categoryName, value)} />
              ))
            )}
          </div>

          {/* Liste de produits via ProductCardGrid (inclut le cœur au survol) */}
          <div className={styles.productContainer}>
            <ProductCardGrid data={sortedProducts} />
          </div>

          <div className={styles.loadMoreContainer}>
            <span>{displayedItems} sur {totalItems}</span>
          </div>
        </Container>
      </div>
      <LayoutOption />
    </Layout>
  );
};

/** Fonction pour obtenir le prix minimal */
function getMinPrice(variants = []) {
  if (!variants.length) return 0;
  return Math.min(...variants.map((v) => parseFloat(v.retail_price)));
}

export const Head = ({ location }) => {
  const siteUrl = 'https://chicbyjm.ch';
  const pathname = location?.pathname || '/';
  const canonical = `${siteUrl}${pathname}`;
  const pageTitle = 'Chic by JM Suisse | Collection Homme';
  const pageDescription =
    'Collection Homme Chic by JM : pièces premium. Livraison en Suisse, paiement sécurisé.';

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonical} />
    </>
  );
};

export default ShopPage;