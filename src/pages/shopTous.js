import React, { useState, useEffect } from 'react';
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
import { graphql, useStaticQuery } from 'gatsby';

const ShopPage = () => {
  const data = useStaticQuery(graphql`
    query {
      allPrintfulProduct {
        edges {
          node {
            id
            name
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

  // Liste complète de produits
  const products = data.allPrintfulProduct.edges;

  // État local pour l’affichage du panneau de filtre
  const [showFilter, setShowFilter] = useState(false);

  // État local pour les filtres activés
  const [activeFilters, setActiveFilters] = useState({});

  // État local pour l’option de tri (ex. 'priceAsc', 'priceDesc', 'alpha', etc.)
  const [sortOption, setSortOption] = useState(null);

  // Fermer le panneau de filtres via ESC
  const escapeHandler = (e) => {
    if (e.keyCode === 27) setShowFilter(false);
  };
  useEffect(() => {
    window.addEventListener('keydown', escapeHandler);
    return () => window.removeEventListener('keydown', escapeHandler);
  }, []);

  /**
   * Fonction pour retirer UNE valeur de filtre (ex. "Rouge" dans la catégorie "couleurs")
   */
  const removeFilter = (categoryName, value) => {
    console.log("removeFilter déclenché :", categoryName, value);
  
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      if (!newFilters[categoryName]) {
        console.log("La catégorie n’existe pas dans le state:", categoryName);
        return prev;
      }
  
      // On retire la valeur
      newFilters[categoryName] = newFilters[categoryName].filter(
        (val) => val !== value
      );
  
      // Si plus aucune valeur dans la catégorie, on supprime la clé
      if (newFilters[categoryName].length === 0) {
        delete newFilters[categoryName];
      }
      console.log("Nouveau state filters:", newFilters);
      return newFilters;
    });
  };

  /**
   * Filtrer les produits en fonction des filtres actifs
   */
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
        const hasType = node.name.toLowerCase().includes(
          selectedValues[0].toLowerCase()
        );
        if (!hasType) return false;
      } else if (categoryName.toLowerCase() === 'prix') {
        const passPrice = node.sync_variants?.some((variant) => {
          const price = parseFloat(variant.retail_price);
          return selectedValues.some((range) => {
            if (range === 'Moins de 50 CHF') {
              return price < 50;
            } else if (range === '50 - 100 CHF') {
              return price >= 50 && price < 100;
            } else if (range === '100 - 200 CHF') {
              return price >= 100 && price < 200;
            } else if (range === 'Plus de 200 CHF') {
              return price >= 200;
            }
            return false;
          });
        });
        if (!passPrice) return false;
      }
    }
    return true; // si tous les filtres passent, on garde le produit
  });

  /**
   * Trier la liste filtrée selon sortOption
   */
  const sortedProducts = [...filteredProducts];
  if (sortOption === 'priceAsc') {
    sortedProducts.sort((a, b) => {
      const priceA = getMinPrice(a.node.sync_variants);
      const priceB = getMinPrice(b.node.sync_variants);
      return priceA - priceB;
    });
  } else if (sortOption === 'priceDesc') {
    sortedProducts.sort((a, b) => {
      const priceA = getMinPrice(a.node.sync_variants);
      const priceB = getMinPrice(b.node.sync_variants);
      return priceB - priceA;
    });
  } else if (sortOption === 'alphabet') {
    sortedProducts.sort((a, b) =>
      a.node.name.localeCompare(b.node.name, 'fr', { sensitivity: 'base' })
    );
  }

  const totalItems = products.length;
  const displayedItems = sortedProducts.length;

  return (
    <Layout>
      <div className={styles.root}>
        <Container size="large" spacing="min">
          <div className={styles.breadcrumbContainer}>
            {/* <Breadcrumbs ... /> */}
          </div>
        </Container>

        <Banner
          name="Tous les vêtements"
          subtitle="Que vous cherchiez à affiner votre style ou à ajouter une touche unique à votre tenue, chaque pièce allie sophistication, confort et qualité pour toute la famille."
        />

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
                <select
                  onChange={(e) => setSortOption(e.target.value)}
                  style={{ marginLeft: '8px' }}
                >
                  <option value="">Trier par</option>
                  <option value="priceAsc">Prix croissant</option>
                  <option value="priceDesc">Prix décroissant</option>
                  <option value="alphabet">Ordre alphabétique</option>
                </select>
              </div>
            </div>
          </div>

          <CardController
            closeFilter={() => setShowFilter(false)}
            visible={showFilter}
            filters={Config.filters}
            onFilterChange={(newFilterState) => {
              const parsedFilters = parseFilterState(newFilterState);
              setActiveFilters(parsedFilters);
            }}
          />

          {/* Affichage dynamique des filtres actifs via des "chips" cliquables */}
          <div className={styles.chipsContainer}>
            {Object.entries(activeFilters).map(([categoryName, selectedValues]) =>
              selectedValues.map((value) => (
                <Chip
                  key={`${categoryName}-${value}`}
                  name={value}
                  // Retire ce filtre au clic
                  onClick={() => removeFilter(categoryName, value)}
                />
              ))
            )}
          </div>

          <div className={styles.productContainer}>
            <span className={styles.mobileItemCount}>
              {displayedItems} produits
            </span>

            <ProductCardGrid data={sortedProducts} />
          </div>

          <div>
            <ul className={styles.imageGrid}>
              {sortedProducts.map(({ node }) => {
                const firstVariant = node.sync_variants?.[0];
                return (
                  <li key={node.id}>
                    <img
                      src={node.thumbnail_url}
                      alt={node.name}
                      style={{ width: '300px', height: 'auto' }}
                    />
                    <h2 style={{ fontSize: '22px' }}>{node.name}</h2>
                    {firstVariant ? (
                      <p>
                        {firstVariant.retail_price} {firstVariant.currency}
                      </p>
                    ) : (
                      <p>Prix non disponible</p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.loadMoreContainer}>
            <span>
              {displayedItems} sur {totalItems}
            </span>
            <Button fullWidth level="secondary">
              Charger plus
            </Button>
          </div>
        </Container>
      </div>
      <LayoutOption />
    </Layout>
  );
};

/** parseFilterState : transforme le tableau de CardController => { catégorie: [valeursCochées], ... } */
function parseFilterState(filterStateArray) {
  const result = {};
  filterStateArray.forEach((cat) => {
    const selectedItems = cat.items
      .filter((item) => item.value === true)
      .map((item) => item.name);
    if (selectedItems.length > 0) {
      result[cat.category] = selectedItems;
    }
  });
  return result;
}

/** getMinPrice : renvoie le prix minimal d’un tableau de variants */
function getMinPrice(variants = []) {
  if (!variants.length) return 0;
  const prices = variants.map((v) => parseFloat(v.retail_price));
  return Math.min(...prices);
}

export default ShopPage;