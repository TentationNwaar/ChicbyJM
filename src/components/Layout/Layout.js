import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../../context/UserContext';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import Header from '../Header';
import Footer from '../Footer';
import * as styles from './Layout.module.css';

import './Globals.css';

const Layout = ({ children, disablePaddingBottom = false }) => {
  const userContext = useContext(UserContext) || {};
  const { user, isLoadingUser } = userContext;

  // Always render Header/Footer to avoid SSR/client mismatch
  // Show spinner in main only while user state loads
  return (
    <>
      <Header />
      <main
        className={`${styles.main} ${
          disablePaddingBottom ? styles.disablePaddingBottom : ''
        }`}
      >
        {typeof window !== 'undefined' && isLoadingUser ? (
          <div className={styles.spinnerContainer}>
            <LoadingSpinner />
          </div>
        ) : (
          children
        )}
      </main>
      <Footer />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;