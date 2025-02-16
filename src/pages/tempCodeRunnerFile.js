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

const MenShopPage = () => {
  const [showFilter, setShowFilter] = useState(false);

  // 1️⃣ On filtre en GraphQL : on ne récupère QUE les produits Printful
  //    dont le nom match "homme" OU "men" (insensible à la casse).
  const data = useStaticQuery(graphql`
    query {
      allPrintfulProduct(
        filter: { name: { regex: "/(homme|men)/i" } }
      ) {
        nodes {
          id
          name
          thumbnail_url
          # Ajoute d'autres champs si besoin (variants, external_id, etc.)
        }
      }
    }
  `);

  // 2️⃣ Les produits “hommes” sont déjà filtrés par la requête
  const menProducts = data.allPrintfulProduct.nodes;
  const totalItems = menProducts.length;

  // Gestion de la fermeture du filtre (ESC)
  const escapeHandler = (e) => {
    if (e?.keyCode === 27) setShowFilter(false);
  };
  useEffect(() => {
    window.addEventListener('keydown', escapeHandler);
    return () => window.removeEventListener('keydown', escapeHandler);
  }, []);

  return (
    <Layout>
      <div className={styles.root}>
        <Container size="large" spacing="min">
          <div className={styles.breadcrumbContainer}>
            <Breadcrumbs
              crumbs={[
                { link: '/', label: 'Accueil' },
                { label: 'Hommes' },
              ]}
            />
          </div>
        </Container>

        <Banner
          maxWidth="650px"
          name="Vêtements pour hommes"
          subtitle="Des vêtements modernes et raffinés pour un style impeccable au quotidien.
          Des pièces uniques pensées pour l’homme contemporain, alliant confort et sophistication."
        />

        <Container size="large" spacing="min">
          <div className={styles.metaContainer}>
            <span className={styles.itemCount}>{totalItems} articles</span>
            <div className={styles.controllerContainer}>
              <div
                className={styles.iconContainer}
                role="presentation"
                onClick={() => setShowFilter(!showFilter)}
              >
                <Icon symbol="filter" />
                <span>Filtres</span>
              </div>
              <div className={`${styles.iconContainer} ${styles.sortContainer}`}>
                <span>Trier par</span>
                <Icon symbol="caret" />
              </div>
            </div>
          </div>

          <CardController
            closeFilter={() => setShowFilter(false)}
            visible={showFilter}
            filters={Config.filters}
          />

          <div className={styles.chipsContainer}>
            <Chip name="XS" />
            <Chip name="S" />
            {/* Ajoute d'autres tailles si besoin */}
          </div>

          <div className={styles.productContainer}>
            <span className={styles.mobileItemCount}>
              {totalItems} articles
            </span>
            {/* 3️⃣ On réutilise ProductCardGrid pour l’affichage */}
            <ProductCardGrid data={menProducts} />
          </div>

          <div className={styles.loadMoreContainer}>
            <span>{totalItems} sur {totalItems}</span>
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

export default MenShopPage;