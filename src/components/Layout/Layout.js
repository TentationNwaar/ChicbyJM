import React, { useContext } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { UserContext } from '../../context/UserContext';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import Header from '../Header';
import Footer from '../Footer';
import * as styles from './Layout.module.css';
import { Link } from 'gatsby';

import './Globals.css';

const Layout = ({ children, disablePaddingBottom = false }) => {
  const { user, isLoadingUser } = useContext(UserContext);

if (isLoadingUser) {
  return (
    <div className={styles.spinnerContainer}>
      <LoadingSpinner />
    </div>
  );
}

 if (isLoadingUser) {
    return (
      <div className={styles.spinnerContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          charset="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
      </Helmet>

      <Header />

      <main
        className={`${styles.main} ${disablePaddingBottom ? styles.disablePaddingBottom : ''}`}
      >
        {children}
      </main>

      <Footer />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;