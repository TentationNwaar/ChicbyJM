import React from 'react';
import * as styles from './ProductCollectionGrid.module.css';

import ProductCollection from '../ProductCollection';

const ProductCollectionGrid = (props) => {
  return (
    <div className={styles.root}>
      <ProductCollection
        image={'produitCollection/HommeJM.webp'}
        title={'Homme'}
        text={'Acheter maintenant'}
        link={'/shopHomme'}
      />
      <ProductCollection
        image={'produitCollection/FemmeJM.webp'}
        title={'Femme'}
        text={'Acheter maintenant'}
        link={'/shopFemme'}
      />
      <ProductCollection
        image={'produitCollection/Accessoires.webp'}
        title={'Accessoires'}
        text={'Acheter maintenant'}
        link={'/shopAccessoire'}
      />
      <ProductCollection
        image={'produitCollection/SchoolSpirit.webp'}
        title={'Enfants'}
        text={'Acheter maintenant'}
        link={'/shopEnfant'}
      />
    </div>
  );
};

export default ProductCollectionGrid;
