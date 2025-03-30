import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import Config from '../../config.json';
import Icon from '../Icons/Icon';
import * as styles from './MobileNavigation.module.css';

const MobileNavigation = ({ close }) => {
  const [subMenu, setSubMenu] = useState(null);
  const [depth, setDepth] = useState(0);
  const [menuClass, setMenuClass] = useState(styles.menuClose); // Initialement fermé

  useEffect(() => {
    // Déclenche l'animation d'ouverture après le rendu
    setTimeout(() => setMenuClass(styles.menuOpen), 10);
  }, []);

  const handleClose = () => {
    setMenuClass(styles.menuClose);
    setTimeout(close, 300); // Attends la fin de l'animation avant de fermer
  };

  return (
    <div className={`${styles.root} ${menuClass}`}>
      <button className={styles.closeButton} onClick={handleClose}>
        ✖
      </button>

      <nav className={styles.mobileNavContainer}>
        {depth > 0 && (
          <div
            className={styles.backButton}
            onClick={() => {
              if (depth === 1) setSubMenu(null);
              setDepth(depth - 1);
            }}
          >
            <Icon symbol="back" />
            <span>Retour</span>
          </div>
        )}

        {depth === 0 && Config.headerLinks.map((navObject) => (
          <div key={navObject.menuLabel} className={styles.navItem}>
            <Link
              to={navObject.menuLink}
              className={styles.mobileLink}
              onClick={() => setTimeout(handleClose, 200)}
            >
              {navObject.menuLabel}
            </Link>
            {navObject.category && (
              <button
                className={styles.subMenuButton}
                onClick={() => {
                  setSubMenu(navObject.category);
                  setDepth(1);
                }}
              >
                <Icon symbol="caret" />
              </button>
            )}
          </div>
        ))}

        {depth === 1 && subMenu && subMenu.map((category) => (
          <div key={category.categoryLabel}>
            <span className={styles.subMenuTitle}>{category.categoryLabel}</span>
            {category.submenu.map((item) => (
              <Link
                key={item.menuLabel}
                to={item.menuLink}
                className={styles.subMenuLink}
                onClick={handleClose} // Ferme le menu au clic
              >
                {item.menuLabel}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default MobileNavigation;