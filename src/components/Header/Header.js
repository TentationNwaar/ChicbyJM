import React, { useState, useEffect, createRef, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { Link, navigate } from 'gatsby';

import AddNotification from '../AddNotification';
import Container from '../Container';
import Config from '../../config.json';
import FormInputField from '../FormInputField/FormInputField';
import Icon from '../Icons/Icon';
import MiniCart from '../MiniCart';
import Drawer from '../Drawer';
import * as styles from './Header.module.css';
import logo from '../../../static/Logo_JM_Transparent.png'; 
import { motion } from 'framer-motion';

const Header = () => {
  const { user } = useContext(UserContext);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');
  const [crossVisible, setCrossVisible] = useState(false);

  const bannerMessage = "BIENVENUE SUR CHIC BY JM !";
  const searchRef = createRef();
  const searchSuggestions = ['T-shirt', 'School Spirit', 'Ciel bleu'];

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${search}`);
    setShowSearch(false);
  };

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
      <div className={styles.headerMessageContainer}>
        <span>{bannerMessage}</span>
      </div>

      <Container size={'large'} spacing={'min'}>
        <div className={styles.header}>
          <div className={styles.logo} role="presentation" onClick={() => navigate('/')}> 
            <img src={logo} alt="Logo JM" width="60" height="60" />
          </div>

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

          {!isMobile && (
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
                className={styles.iconContainer}
              >
                <Icon symbol="heart" />
              </Link>
              <Link
                aria-label="User"
                to={user ? '/account' : '/login'}
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
          )}

          {isMobile && (
            <div className={styles.mobileIconsContainer}>
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
              className={styles.iconContainer}
            >
              <Icon symbol="heart" />
            </Link>
            <Link
              aria-label="User"
              to={user ? '/account' : '/login'}
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
          )}

          <div
            role="presentation"
            onClick={toggleMobileMenu}
            className={styles.burgerIcon}
          >
            <Icon symbol={mobileMenu ? 'cross' : 'burger'} />
          </div>
        </div>
      </Container>

      {isMobile && showMiniCart && (
        <div className={`${styles.drawerOverlay} ${styles.drawerOverlayVisible}`} onClick={() => setShowMiniCart(false)} />
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

      {mobileMenu && (
        <>
          <div className={styles.overlay} onClick={handleCloseMobileMenu} />
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={styles.mobileMenu}
          >
            <div className={styles.mobileMenuHeader}>
              <button
                aria-label="Fermer le menu"
                className={styles.closeButton}
                onClick={handleCloseMobileMenu}
              >
                <Icon symbol="cross" />
              </button>
            </div>

            <ul className={styles.mobileMenuList}>
              {[
                { label: 'Shopping', path: '/shopTous' },
                { label: 'Homme', path: '/shopHomme' },
                { label: 'Femme', path: '/shopFemme' },
                { label: 'Enfant', path: '/shopEnfant' },
                { label: 'Accessoires', path: '/shopAccessoire' },
                { label: 'Contact', path: '/support#contact' },
              ].map((item, i) => (
                <motion.li
                  key={item.path}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={item.path} onClick={handleCloseMobileMenu}>
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        </>
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