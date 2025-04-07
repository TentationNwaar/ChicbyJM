import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import Header from '../Header';
import Footer from '../Footer';
import * as styles from './Layout.module.css';

import { Link } from "gatsby";

<Link to="/cart" className="cart-link">🛒 Voir le Panier</Link>

// CSS not modular here to provide global styles
import './Globals.css';


const Layout = ({ props, children, disablePaddingBottom = false }) => {
  const { user } = useContext(UserContext);
  return (
    <>
      <Helmet>
        {/* Add any sitewide scripts here */}
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
      {/* Barre utilisateur (ajout) */}
      <div className={styles.userBar}>
        {user ? (
          <p>Connecté en tant que {user.email} | <Link to="/account">Mon compte</Link></p>
        ) : (
          <p><Link to="/login">Se connecter</Link></p>
        )}
      </div>
      <main
        className={`${styles.main} ${
          disablePaddingBottom === true ? styles.disablePaddingBottom : ''
        }`}
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
