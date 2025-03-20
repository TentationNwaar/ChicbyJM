import React from 'react';
import { navigate } from 'gatsby';
import * as styles from './viewed.module.css';

import AccountLayout from '../../components/AccountLayout';
import Breadcrumbs from '../../components/Breadcrumbs';
import Layout from '../../components/Layout/Layout';
import ProductCardGrid from '../../components/ProductCardGrid';

import { isAuth } from '../../helpers/general';
import { generateMockProductData } from '../../helpers/mock';

const RecentlyViewedPage = (props) => {
  const recentlyViewed = generateMockProductData(3, 'shirt');

  if (isAuth() === false) {
    navigate('/login');
  }

  return (
    <Layout>
      <AccountLayout>
        <Breadcrumbs
          crumbs={[
            { link: '/', label: 'Accueil' },
            { link: '/account', label: 'Mon compte' },
            { link: '/account/viewed', label: 'Produits récemment vus' },
          ]}
        />
        <div className={styles.root}>
          <h1>Produits vus récemment</h1>
          <div className={styles.gridContainer}>
            <ProductCardGrid
              spacing={true}
              height={480}
              columns={3}
              data={recentlyViewed}
            />
          </div>
        </div>
      </AccountLayout>
    </Layout>
  );
};

export default RecentlyViewedPage;