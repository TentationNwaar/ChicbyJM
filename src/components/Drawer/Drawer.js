/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';

import Icon from '../Icons/Icon';
import * as styles from './Drawer.module.css';

const Drawer = ({
  children,
  visible,
  close,
  top = '0px',
  isReverse = false,
  hideCross = false,
}) => {
  useEffect(() => {
    window.addEventListener('keydown', escapeHandler);
    return () => window.removeEventListener('keydown', escapeHandler);
  }, []);

  const escapeHandler = (e) => {
    if (e?.keyCode === undefined) return;
    if (e.keyCode === 27) close();
  };

  const showStyle =
    isReverse === true ? styles.showReverse : styles.showContent;
  const hideStyle =
    isReverse === true ? styles.hideReverse : styles.hideContent;

  return (
    <div
      style={{ top: top }}
      className={`
      ${styles.root} 
      ${visible === true ? styles.show : styles.hide}
      ${isReverse === true ? styles.isReverse : ''}
    `}
    >
      <div
        className={`${styles.overlay} ${visible ? styles.showOverlay : styles.hide}`}
        role={'presentation'}
        onClick={() => {
          console.log("Drawer overlay clicked!");
          close(); // Ferme le drawer
          setTimeout(close, 300); // Double sécurité après animation
        }}
      >
        <div className={`${styles.iconContainer} ${hideCross ? styles.hide : ''}`}>
          <Icon symbol={'cross'} onClick={close} />
        </div>
      </div>

      <div
        className={`${styles.content} ${
          visible === true ? showStyle : hideStyle
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Drawer;
