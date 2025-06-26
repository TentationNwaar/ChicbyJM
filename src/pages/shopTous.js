import React, { useState, useEffect } from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import * as styles from './shop.module.css';

import Banner from '../components/Banner';
import Breadcrumbs from '../components/Breadcrumbs';
import CardController from '../components/CardController';
import Container from '../components/Container';
import Chip from '../components/Chip';
import Icon from '../components/Icons/Icon';
import Layout from '../components/Layout';
import LayoutOption from '../components/LayoutOption';
import ProductCardGrid from '../components/ProductCardGrid';
import Button from '../components/Button';
import Config from '../config.json';

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

  // 4️⃣ Fermer le panneau de filtres via ESC
  useEffect(() => {
    const escapeHandler = (e) => {
      if (e.keyCode === 27) setShowFilter(false);
    };
    window.addEventListener('keydown', escapeHandler);
    return () => window.removeEventListener('keydown', escapeHandler);
  }, []);

  // 5️⃣ Fonction pour retirer un filtre actif
  const removeFilter = (categoryName, value) => {
    setActiveFilters((prevFilters) => {
      const newFilters = { ...prevFilters };

      // Vérifier si la catégorie est bien définie
      if (!newFilters[categoryName]) return prevFilters;

      // Retirer l'élément sélectionné
      newFilters[categoryName] = newFilters[categoryName].filter((val) => val !== value);

      // Supprimer la catégorie si elle devient vide
      if (newFilters[categoryName].length === 0) {
        delete newFilters[categoryName];
      }

      return newFilters;
    });
  };

  // 6️⃣ Filtrer les produits selon les filtres actifs
  const filteredProducts = products.filter(({ node }) => {
    for (const [categoryName, selectedValues] of Object.entries(activeFilters)) {
      if (categoryName.toLowerCase() === 'couleurs') {
        const hasColor = node.sync_variants?.some((variant) =>
          selectedValues.some((color) =>
            variant.name.toLowerCase().includes(color.toLowerCase())
          )
        );
        if (!hasColor) return false;
      } else if (categoryName.toLowerCase() === 'taille') {
        const hasSize = node.sync_variants?.some((variant) =>
          selectedValues.some((size) =>
            variant.name.toLowerCase().includes(size.toLowerCase())
          )
        );
        if (!hasSize) return false;
      } else if (categoryName.toLowerCase() === 'type de produits') {
        const hasType = node.name.toLowerCase().includes(selectedValues[0].toLowerCase());
        if (!hasType) return false;
      } else if (categoryName.toLowerCase() === 'prix') {
        const passPrice = node.sync_variants?.some((variant) => {
          const price = parseFloat(variant.retail_price);
          return selectedValues.some((range) => {
            if (range === 'Moins de 50 CHF') return price < 50;
            if (range === '50 - 100 CHF') return price >= 50 && price < 100;
            if (range === '100 - 200 CHF') return price >= 100 && price < 200;
            if (range === 'Plus de 200 CHF') return price >= 200;
            return false;
          });
        });
        if (!passPrice) return false;
      }
    }
    return true;
  });

  // 7️⃣ Trier les produits filtrés selon `sortOption`
  const sortedProducts = [...filteredProducts];
  if (sortOption === 'priceAsc') {
    sortedProducts.sort((a, b) => getMinPrice(a.node.sync_variants) - getMinPrice(b.node.sync_variants));
  } else if (sortOption === 'priceDesc') {
    sortedProducts.sort((a, b) => getMinPrice(b.node.sync_variants) - getMinPrice(a.node.sync_variants));
  } else if (sortOption === 'alphabet') {
    sortedProducts.sort((a, b) => a.node.name.localeCompare(b.node.name, 'fr', { sensitivity: 'base' }));
  }

  // 8️⃣ UI - Nombre d’articles
  const totalItems = products.length;
  const displayedItems = sortedProducts.length;

  return (
    <Layout>
      <div className={styles.root}>
        <Container size="large" spacing="min">
          <Banner name="Tous les vêtements" subtitle="Découvrez notre collection complète de vêtements." />
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

          {/* Filtres actifs affichés */}
          <div className={styles.chipsContainer}>
            {Object.entries(activeFilters).map(([categoryName, selectedValues]) =>
              selectedValues.map((value) => (
                <Chip key={`${categoryName}-${value}`} name={value} onClick={() => removeFilter(categoryName, value)} />
              ))
            )}
          </div>

          {/* Liste d’images cliquables */}
          <div className={styles.cardGrid}>
            {sortedProducts.map(({ node }) => {
              const firstVariant = node.sync_variants?.[0];

              return (
                <div key={node.id} className={styles.card}>
                  <Link to={`/en/product/${node.slug}/`}>
                    <img src={node.thumbnail_url} alt={node.name} className={styles.cardImage} />
                    <h2 className={styles.cardTitle}>{node.name}</h2>
                    <p className={styles.productPrice}>
                      {firstVariant ? `${firstVariant.retail_price} ${firstVariant.currency}` : 'Prix non disponible'}
                    </p>
                  </Link>
                </div>
              );
            })}
          </div>

          <div className={styles.loadMoreContainer}>
            <span>{displayedItems} sur {totalItems}</span>
            <Button fullWidth level="secondary">Charger plus</Button>
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

export default ShopPage;