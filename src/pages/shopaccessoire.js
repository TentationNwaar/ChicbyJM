import React, { useState, useEffect } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import * as styles from './shop.module.css';

import Banner from '../components/Banner';
import Container from '../components/Container';
import Chip from '../components/Chip';
import Icon from '../components/Icons/Icon';
import Layout from '../components/Layout';
import LayoutOption from '../components/LayoutOption';
import ProductCardGrid from '../components/ProductCardGrid';
import Config from '../config.json';
import FiltersPanel from '../components/FiltersPanel';
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

  // 3️⃣ États pour la gestion des filtres et du tri
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [sortOption, setSortOption] = useState(null);

  // ✅ Toggle d’une valeur de filtre (même logique que shopTous)
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

  // 5️⃣ Retirer un chip actif
  const removeFilter = (categoryName, value) => {
    setActiveFilters((prev) => {
      const next = { ...prev };
      if (!next[categoryName]) return prev;
      next[categoryName] = next[categoryName].filter((v) => v !== value);
      if (next[categoryName].length === 0) delete next[categoryName];
      return next;
    });
  };

  // 6️⃣ Base accessoires uniquement (nom de variante)
  const accessoryKeywords = [
    'sac','chapeau','ceinture','bijou','porte-clé','montre','casquette',
    'bracelet','écharpe','gants','bob','bonnet','beanie','hat'
  ];

  const baseProducts = React.useMemo(() => {
    return products.filter(({ node }) =>
      Array.isArray(node.sync_variants) &&
      node.sync_variants.some(variant => {
        const v = (variant?.name || '').toLowerCase();
        return accessoryKeywords.some(k => v.includes(k));
      })
    );
  }, [products]);

  // 7️⃣ Filtrer + trier via util partagé (identique à shopTous)
  const sortedProducts = React.useMemo(
    () => filterAndSort(baseProducts, activeFilters, sortOption),
    [baseProducts, activeFilters, sortOption]
  );

  // 8️⃣ Compteurs
  const totalItems = baseProducts.length;
  const displayedItems = sortedProducts.length;

  return (
    <Layout>
      <div className={styles.root}>
        <Container size="large" spacing="min">
          <Banner name="Accessoires" subtitle="Découvrez notre collection d’accessoires tendance." />
        </Container>

        <Container size="large" spacing="min">
          <div className={styles.metaContainer}>
            <span className={styles.itemCount}>{displayedItems} articles</span>
            <div className={styles.controllerContainer}>
              <div
                className={styles.iconContainer}
                role="presentation"
                onClick={() => setShowFilter(!showFilter)}
              >
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

          {/* Chips des filtres actifs */}
          <div className={styles.chipsContainer}>
            {Object.entries(activeFilters).map(([categoryName, selectedValues]) =>
              selectedValues.map((value) => (
                <Chip
                  key={`${categoryName}-${value}`}
                  name={value}
                  onClick={() => removeFilter(categoryName, value)}
                />
              ))
            )}
          </div>

          {/* Grille produits (avec favoris) */}
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

export const Head = ({ location }) => {
  const siteUrl = 'https://chicbyjm.ch';
  const pathname = location?.pathname || '/';
  const canonical = `${siteUrl}${pathname}`;
  const pageTitle = 'Chic by JM Suisse | Collection Accessoires';
  const pageDescription =
    'Collection Accessoires Chic by JM : pièces premium. Livraison en Suisse, paiement sécurisé.';

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