import React, { useState, useEffect, createRef } from 'react';
import { Link, navigate } from 'gatsby';

import { isAuth } from '../../helpers/general';

import AddNotification from '../AddNotification';
import Brand from '../Brand';
import Container from '../Container';
import Config from '../../config.json';
import Drawer from '../Drawer';
import ExpandedMenu from '../ExpandedMenu';
import FormInputField from '../FormInputField/FormInputField';
import Icon from '../Icons/Icon';
import MiniCart from '../MiniCart';
import MobileNavigation from '../MobileNavigation';
import * as styles from './Header.module.css';

const Header = (prop) => {
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [menu, setMenu] = useState();
  const [activeMenu, setActiveMenu] = useState();
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');

  const searchRef = createRef();
  const bannerMessage = 'EXCLUSIF : PROFITEZ DE 10 % DE RÉDUCTION SUR TOUTE VOTRE PREMIÈRE COMMANDE AVEC LE CODE JM2025';
  const searchSuggestions = ['T-shirt', 'School Spirit', 'Ciel bleu'];

  const handleHover = (navObject) => {
    if (navObject.category) {
      setShowMenu(true);
      setMenu(navObject.category);
      setShowSearch(false);
    } else {
      setMenu(undefined);
    }
    setActiveMenu(navObject.menuLabel);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${search}`);
    setShowSearch(false);
  };

  // Désactive le menu actif quand `showMenu` est caché
  useEffect(() => {
    if (!showMenu) setActiveMenu(false);
  }, [showMenu]);

  // Cache le menu lors du scroll
  useEffect(() => {
    const onScroll = () => {
      setShowMenu(false);
      setShowSearch(false);
      setActiveMenu(undefined);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Focus sur la barre de recherche quand elle est activée
  useEffect(() => {
    if (showSearch) {
      setTimeout(() => searchRef.current?.focus(), 250);
    }
  }, [showSearch]);

  // Applique les styles dynamiquement au MiniCart en fonction de `showMiniCart`
  useEffect(() => {
    const miniCart = document.getElementById('miniCartContainer');
    if (miniCart) {
      if (showMiniCart && window.innerWidth <= 800) {
        miniCart.style.display = 'block';
        miniCart.style.opacity = '1';
        miniCart.style.visibility = 'visible';
      } else {
        miniCart.style.display = 'none';
        miniCart.style.opacity = '0';
        miniCart.style.visibility = 'hidden';
      }
    }
  }, [showMiniCart]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.headerMessageContainer}>
        <span>{bannerMessage}</span>
      </div>
      <Container size={'large'} spacing={'min'}>
        <div className={styles.header}>
          <Brand />

          <div className={styles.navContainer}>
            <nav
              role="presentation"
              onMouseLeave={() => setShowMenu(false)}
            >
              {Config.headerLinks.map((navObject) => (
                <Link
                  key={navObject.menuLink}
                  onMouseEnter={() => handleHover(navObject)}
                  className={`${styles.navLink} ${
                    activeMenu === navObject.menuLabel ? styles.activeLink : ''
                  }`}
                  to={navObject.menuLink}
                >
                  {navObject.menuLabel}
                </Link>
              ))}
            </nav>
          </div>

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
              className={`${styles.iconContainer} ${styles.hideOnMobile}`}
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
            <div className={styles.notificationContainer}>
            {isMobile && showMiniCart && (
            <div className={styles.miniCartContainer}>
              <MiniCart closeCart={() => setShowMiniCart(false)} />
            </div>
          )}
              <div
                id="miniCartContainer"
                className={`${styles.miniCartContainer} ${
                  showMiniCart ? styles.miniCartMobileVisible : ''
                }`}
              >
              </div>
              <AddNotification openCart={() => setShowMiniCart(true)} />
            </div>
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

          <div
            role="presentation"
            onClick={() => setMobileMenu(!mobileMenu)}
            className={styles.burgerIcon}
          >
            <Icon symbol={mobileMenu ? 'cross' : 'burger'} />
          </div>
        </div>
      </Container>

      {mobileMenu && (
        <Drawer visible={mobileMenu} close={() => setMobileMenu(false)}>
          <MobileNavigation close={() => setMobileMenu(false)} />
        </Drawer>
      )}

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