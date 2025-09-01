import React, { useState, useContext } from 'react';

import { FaHeart, FaRegHeart } from 'react-icons/fa';

import Button from '../Button';
import CurrencyFormatter from '../CurrencyFormatter';
import SizeList from '../SizeList';
import SwatchList from '../SwatchList';

import { generateMockProductData } from '../../helpers/mock';
import AddItemNotificationContext from '../../context/AddItemNotificationProvider';

import * as styles from './QuickView.module.css';
import { toOptimizedImage } from '../../helpers/general';

const QuickView = (props) => {
  const { close, buttonTitle = 'Add to Bag' } = props;
  const sampleProduct = generateMockProductData(1, 'sample')[0];

  const ctxAddItemNotification = useContext(AddItemNotificationContext);
  const showNotification = ctxAddItemNotification.showNotification;
  const [activeSwatch, setActiveSwatch] = useState(
    sampleProduct.colorOptions[0]
  );
  const [activeSize, setActiveSize] = useState(sampleProduct.sizeOptions[0]);
  const [isFavorite, setIsFavorite] = useState(false);

  const notify = (detail) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('notify', { detail }));
    }
  };

  const handleToggleFavorite = () => {
    try {
      const rawUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (!rawUser) {
        notify({ type: 'info', message: 'Connecte-toi pour ajouter aux favoris.', timeout: 2400 });
        return;
      }
      if (isFavorite) {
        setIsFavorite(false);
        notify({ type: 'info', message: 'Retiré des favoris', timeout: 2000 });
      } else {
        setIsFavorite(true);
        notify({ type: 'success', message: 'Ajouté aux favoris ❤️', timeout: 2200 });
      }
    } catch (e) {
      console.error('toggle favorite (QuickView) failed', e);
      notify({ type: 'error', message: "Impossible de mettre à jour les favoris", timeout: 2200 });
    }
  };

  const handleAddToBag = () => {
    close();
    showNotification();
  };

  return (
    <div className={styles.root}>
      <div className={styles.titleContainer}>
        <h4>Select Options</h4>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.productContainer}>
          <span className={styles.productName}>{sampleProduct.name}</span>
          <div className={styles.price}>
            <CurrencyFormatter amount={sampleProduct.price}></CurrencyFormatter>
          </div>
          <div className={styles.productImageContainer} style={{ position: 'relative' }}>
            <img alt={sampleProduct.alt} src={toOptimizedImage(sampleProduct.image)} />
            <div
              onClick={handleToggleFavorite}
              role="button"
              aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                fontSize: 22,
                color: isFavorite ? 'red' : '#888',
                cursor: 'pointer',
                zIndex: 2,
                padding: 6,
                background: 'rgba(255,255,255,0.9)',
                borderRadius: 9999,
                lineHeight: 0
              }}
            >
              {isFavorite ? <FaHeart /> : <FaRegHeart />}
            </div>
          </div>
        </div>

        <div className={styles.sectionContainer}>
          <SwatchList
            swatchList={sampleProduct.colorOptions}
            activeSwatch={activeSwatch}
            setActiveSwatch={setActiveSwatch}
          />
        </div>

        <div className={styles.sectionContainer}>
          <SizeList
            sizeList={sampleProduct.sizeOptions}
            activeSize={activeSize}
            setActiveSize={setActiveSize}
          />
        </div>

        <Button onClick={() => handleAddToBag()} fullWidth level={'primary'}>
          {buttonTitle}
        </Button>
      </div>
    </div>
  );
};

export default QuickView;
