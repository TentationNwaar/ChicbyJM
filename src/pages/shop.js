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

  const products = data.allProductsCsv.edges;
  const [showFilter, setShowFilter] = useState(false);
  //const data = generateMockProductData(6, 'woman');

  const escapeHandler = (e) => {
    if (e?.keyCode === undefined) return;
    if (e.keyCode === 27) setShowFilter(false);
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
                { link: '/', label: 'Home' },
                { link: '/', label: 'Woman' },
                { label: 'Sweaters' },
              ]}
            />
          </div>
        </Container>
        <Banner
          maxWidth="650px"
          name="Vêtements pour femmes"
          subtitle="Alliez confort et style raffiné avec nos pièces uniques, pensées pour l'univers féminin moderne."
        />
        <Container size="large" spacing="min">
          <div className={styles.metaContainer}>
            <span className={styles.itemCount}>476 items</span>
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
            <span className={styles.mobileItemCount}>476 items</span>
            <ProductCardGrid data={products} />
          </div>
          <div>
            <h1>Nos Produits</h1>
            <ul className={styles.imageGrid}>
          {data.allProductsCsv.edges.map(({ node }) => (
            <li key={node.Handle}>
              <img 
                src={node.Image_Src} 
                alt={node.Image_Alt_Text}
                style={{ width: '300px', height: 'auto' }}
              />
              <h2 style={{ fontSize: '24px' }}>
                {node.Title}
              </h2>
              
              <p>{node.Variant_Price} CHF</p>
              {/* <p>Catégorie: {node.Product_Category}</p> */}
            </li>
          ))}
        </ul>
        </div>
          <div className={styles.loadMoreContainer}>
            <span>6 of 456</span>
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
