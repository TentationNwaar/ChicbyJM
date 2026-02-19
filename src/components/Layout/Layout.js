import React, { useContext } from 'react';
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

if (typeof window !== "undefined" && isLoadingUser) {
    return (
      <div className={styles.spinnerContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className={`${styles.main} ${disablePaddingBottom ? styles.disablePaddingBottom : ''}`}>
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