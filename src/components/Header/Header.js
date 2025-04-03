import React, { useState, useEffect, createRef } from 'react';
import { Link, navigate } from 'gatsby';

import { isAuth } from '../../helpers/general';

import AddNotification from '../AddNotification';
import Container from '../Container';
import Config from '../../config.json';
import Drawer from '../Drawer';
import FormInputField from '../FormInputField/FormInputField';
import Icon from '../Icons/Icon';
import MiniCart from '../MiniCart';
import MobileNavigation from '../MobileNavigation';
import * as styles from './Header.module.css';
import logo from '../../../static/Logo_JM_Transparent.png'; 

const Header = (prop) => {
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');
  const [crossVisible, setCrossVisible] = useState(false);

  // Définir le message de la bannière
  const bannerMessage = "Bienvenue sur notre site ! Profitez de nos promotions.";

  const searchRef = createRef();
  const searchSuggestions = ['T-shirt', 'School Spirit', 'Ciel bleu'];

  const handleHover = (navObject) => {
    if (navObject.category) {
      setShowSearch(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${search}`);
    setShowSearch(false);
  };

  // Gérer le menu mobile
  const handleCloseMobileMenu = () => {
    setMobileMenu(false);
    setCrossVisible(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenu(!mobileMenu);
    setCrossVisible(true);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth <= 800);
    
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 800);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <div className={styles.root}>
      {/* Affichage du message de bannière */}
      <div className={styles.headerMessageContainer}>
        <span>{bannerMessage}</span>
      </div>
      
      <Container size={'large'} spacing={'min'}>
        <div className={styles.header}>
          <div className={styles.logo} role="presentation" onClick={() => navigate('/')}>
            <img src={logo} alt="Logo JM" width="60" height="60" />
          </div>

          {/* Menu de navigation principal */}
          <div className={styles.navContainer}>
            <nav role="presentation">
              {Config.headerLinks.map((navObject) => (
                <Link
                  key={navObject.menuLink}
                  className={styles.navLink}
                  to={navObject.menuLink}
                >
                  {navObject.menuLabel}
                </Link>
              ))}
            </nav>
          </div>

          {/* Actions : recherche, favoris, commandes, panier */}
          <div className={styles.actionContainers}>
            <button
              aria-label="Search"
              className={`${styles.iconButton} ${styles.iconContainer}`}
              onClick={() => setShowSearch(!showSearch)}
            >
              <Icon symbol="search" />
            </button>
            <Link
              aria-label="Favorites"
              to="/account/favorites"
              className={`${styles.iconContainer} ${styles.hideOnMobile}`}
            >
              <Icon symbol="heart" />
            </Link>
            <Link
              aria-label="Orders"
              to={isAuth() ? '/login' : '/account/orders/'}
              className={`${styles.iconContainer} ${styles.hideOnMobile} ${styles.userIcon}`}
            >
              <Icon symbol="user" />
            </Link>
            <button
              aria-label="Cart"
              className={`${styles.iconButton} ${styles.iconContainer}`}
              onClick={() => setShowMiniCart(!showMiniCart)}
            >
              <Icon symbol="bag" />
            </button>
          </div>

          {/* Affichage du MiniCart en fonction du type d'appareil */}
          {isMobile && showMiniCart && (
            <div className={`${styles.drawerOverlay} ${showMiniCart ? styles.drawerOverlayVisible : ''}`} onClick={() => setShowMiniCart(false)} />
          )}
          {isMobile ? (
            <Drawer visible={showMiniCart} close={() => setShowMiniCart(false)} customClass={styles.miniCartDrawer}>
              <MiniCart closeCart={() => setShowMiniCart(false)} />
            </Drawer>
          ) : (
            showMiniCart && (
              <div className={styles.miniCartContainer}>
                <MiniCart closeCart={() => setShowMiniCart(false)} />
              </div>
            )
          )}

          {/* Icônes mobiles */}
          <div className={styles.mobileIconsContainer}>
            <Link
              aria-label="User"
              to={isAuth() ? '/account/orders/' : '/login'}
              className={styles.iconContainer}
            >
              <Icon symbol="user" />
            </Link>
            <button
              aria-label="Cart"
              className={`${styles.iconButton} ${styles.iconContainer}`}
              onClick={() => setShowMiniCart(!showMiniCart)}
            >
              <Icon symbol="bag" />
            </button>
          </div>

          {/* Menu burger mobile */}
          <div
            role="presentation"
            onClick={toggleMobileMenu}
            className={styles.burgerIcon}
          >
            <Icon symbol={mobileMenu ? 'cross' : 'burger'} />
          </div>
        </div>
      </Container>

      {/* Affichage du Drawer avec la navigation mobile */}
      {mobileMenu && (
        <Drawer visible={mobileMenu} close={handleCloseMobileMenu} hideCross={!crossVisible}>
          <MobileNavigation close={handleCloseMobileMenu} />
        </Drawer>
      )}

      {/* Affichage de la recherche */}
      {showSearch && (
        <div className={styles.searchContainer}>
          <form onSubmit={handleSearch}>
            <FormInputField
              placeholder="Rechercher"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              ref={searchRef}
            />
            <button type="submit">Search</button>
          </form>
          <div className={styles.searchSuggestions}>
            {searchSuggestions.map((suggestion) => (
              <div key={suggestion} className={styles.suggestionItem}>
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;