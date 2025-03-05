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
const [mobileMenu, setMobileMenu] = useState(false);
const toggleMenu = () => setMobileMenu(!mobileMenu);
const closeMenu = () => setMobileMenu(false);
const [showMenu, setShowMenu] = useState(true);
const [menu, setMenu] = useState();
const [activeMenu, setActiveMenu] = useState();
const [showSearch, setShowSearch] = useState(false);
const [search, setSearch] = useState('');

const searchRef = createRef();
const bannerMessage = 'EXCLUSIF : PROFITEZ DE 10 % DE RÉDUCTION SUR TOUTE VOTRE PREMIÈRE COMMANDE AVEC LE CODE JM2025';
const searchSuggestions = [
  'T-shirt',
  'School Spirit',
  'Ciel bleu',
];

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

  // disable active menu when show menu is hidden
  useEffect(() => {
    if (showMenu === false) setActiveMenu(false);
  }, [showMenu]);

  // hide menu onscroll
  useEffect(() => {
    const onScroll = () => {
      setShowMenu(false);
      setShowSearch(false);
      setActiveMenu(undefined);
    };
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  //listen for show search and delay trigger of focus due to CSS visiblity property
  useEffect(() => {
    if (showSearch === true) {
      setTimeout(() => {
        searchRef.current.focus();
      }, 250);
    }
  }, [showSearch]);

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
              role={'presentation'}
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
              <Icon symbol={'search'} />
            </button>
            <Link
              aria-label="Favorites"
              to="/account/favorites"
              className={`${styles.iconContainer} ${styles.hideOnMobile}`}
            >
              <Icon symbol={'heart'} />
            </Link>
            <Link
              aria-label="Orders"
              to={isAuth() ? '/login' : '/account/orders/'}
              className={`${styles.iconContainer} ${styles.hideOnMobile}`}
            >
              <Icon symbol={'user'} />
            </Link>
            <button
              aria-label="Cart"
              className={`${styles.iconButton} ${styles.iconContainer} ${styles.bagIconContainer}`}
              onClick={() => {
                setShowMiniCart(!showMiniCart); // ✅ Ouvre/Ferme la mini-fenêtre
                setMobileMenu(false);
              }}
            >
              <Icon symbol={'bag'} />
              <div className={styles.bagNotification}>
                <span>1</span>
              </div>
            </button>
            <div className={styles.notificationContainer}>
            {showMiniCart && (
              <div className={styles.miniCartContainer}>
                <MiniCart closeCart={() => setShowMiniCart(false)} />
              </div>
            )}
              <AddNotification openCart={() => setShowMiniCart(true)} />
            </div>
          </div>

          <div
            role={'presentation'}
            onClick={() => {
              setMobileMenu(!mobileMenu);
            }}
            className={styles.burgerIcon}
          >
            <Icon symbol={mobileMenu ? 'cross' : 'burger'} />
          </div>
        </div>
      </Container>

      {mobileMenu && (
        <Drawer 
          visible={mobileMenu} 
          close={() => setMobileMenu(false)}
          hideCross={false}
        >
          <MobileNavigation close={() => setMobileMenu(false)} />
        </Drawer>
      )}

      {/* Search Container */}
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