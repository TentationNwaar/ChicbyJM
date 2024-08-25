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
//import { generateMockProductData } from '../helpers/mock';
import Button from '../components/Button';
import Config from '../config.json';
import { graphql, useStaticQuery } from 'gatsby';

const ShopPage = (props) => {
  const data = useStaticQuery(graphql`
    query {
      allProductsCsv {
        edges {
          node {
            Handle
            Title
            Body_HTML
            Vendor
            Product_Category
            Type
            Tags
            Published
            Variant_Price
            Variant_Compare_At_Price
            Image_Src
            Image_Position
            Image_Alt_Text
            SEO_Title
            SEO_Description
            Google_Shopping_Gender
            Google_Shopping_Age_Group
            Google_Shopping_Condition
            Price_Switzerland
            Status
          }
        }
      }
    }
  `);

  console.log(data.allProductsCsv.edges.length)

  const products = data.allProductsCsv.edges;
  const [showFilter, setShowFilter] = useState(false);

  //Vérifie que l'utilisateur quitte le mode filtre
  const escapeHandler = (e) => {
    if (e?.keyCode === undefined) return;
    if (e.keyCode === 27) setShowFilter(false);
  };

  useEffect(() => {
    window.addEventListener('keydown', escapeHandler);
    return () => window.removeEventListener('keydown', escapeHandler);
  }, []);

  const filteredProducts = products.filter(({ node }) => node.Image_Position === "1");
  const totalItems = products.length;
  const displayedItems = filteredProducts.length;

  return (
    <Layout>
      <div className={styles.root}>
        <Container size="large" spacing="min">
          <div className={styles.breadcrumbContainer}>
            <Breadcrumbs
              crumbs={[
                { link: '/', label: 'Home' },
                { link: '/', label: 'Woman' },
                { label: 'Sweaters' },
              ]}
            />
          </div>
        </Container>
        <Banner
          name="Tous les vêtements"
          subtitle="Que vous cherchiez à affiner votre style ou à ajouter une touche unique à votre tenue, chaque pièce allie sophistication, confort et qualité pour toute la famille."
        />
        <Container size="large" spacing="min">
          <div className={styles.metaContainer}>
            <span className={styles.itemCount}>{filteredProducts.length} items</span>
            <div className={styles.controllerContainer}>
              <div
                className={styles.iconContainer}
                role="presentation"
                onClick={() => setShowFilter(!showFilter)}
              >
                <Icon symbol="filter" />
                <span>Filtrer</span>
              </div>
              <div
                className={`${styles.iconContainer} ${styles.sortContainer}`}
              >
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
          </div>
          <div className={styles.productContainer}>
            <span className={styles.mobileItemCount}>{filteredProducts.length} produits</span>
            <ProductCardGrid data={products} />
          </div>
          <div>
            <ul className={styles.imageGrid}>
              {data.allProductsCsv.edges.map(({ node }) => {
                // Vérifier si l'image a la position 1
                if (node.Image_Position === "1") {
                  return (
                    <li key={node.Handle}>
                      <img 
                        src={node.Image_Src} 
                        alt={node.Image_Alt_Text}
                        style={{ width: '300px', height: 'auto' }}
                      />
                      <h2 
                      style={{ fontSize: '22px' }}>
                      {node.Title}
                      </h2>
                    
                      <p>{node.Variant_Price} CHF</p>
                    </li>
                  );
                }
              })}
            </ul>
        </div>
          <div className={styles.loadMoreContainer}>
            <span>{displayedItems} sur {totalItems}</span>
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

export default ShopPage;
