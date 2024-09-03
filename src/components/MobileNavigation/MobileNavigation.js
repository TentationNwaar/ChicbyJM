import React, { useState } from 'react';
import { Link } from 'gatsby';
import Config from '../../config.json';
import Icon from '../Icons/Icon';
import * as styles from './MobileNavigation.module.css';

const MobileNavigation = ({ close }) => {
  const [subMenu, setSubMenu] = useState(null);
  const [depth, setDepth] = useState(0);

  return (
    <div className={styles.root}>
      <nav>
        {/* Back button or header based on depth */}
        {depth > 0 && (
          <div
            className={styles.backButton}
            onClick={() => {
              if (depth === 1) setSubMenu(null);
              setDepth(depth - 1);
            }}
          >
            <Icon symbol="back" />
            <span> Retour </span>
          </div>
        )}

        <div className={styles.mobileNavContainer}>
          {/* Render top-level navigation */}
          {depth === 0 && Config.headerLinks.map((navObject) => (
            <div key={navObject.menuLabel} className={styles.navItem}>
              <Link
                to={navObject.menuLink}
                className={styles.mobileLink}
                onClick={close} // Close menu on link click
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

          {/* Render sub-menu */}
          {depth === 1 && subMenu && subMenu.map((category) => (
            <div key={category.categoryLabel}>
              <span className={styles.subMenuTitle}>{category.categoryLabel}</span>
              {category.submenu.map((item) => (
                <Link
                  key={item.menuLabel}
                  to={item.menuLink}
                  className={styles.subMenuLink}
                  onClick={close} // Close menu on link click
                >
                  {item.menuLabel}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MobileNavigation;