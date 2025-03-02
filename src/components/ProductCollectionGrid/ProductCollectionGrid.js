import React from 'react';
import * as styles from './ProductCollectionGrid.module.css';

import ProductCollection from '../ProductCollection';

const ProductCollectionGrid = (props) => {
  return (
    <div className={styles.root}>
      <ProductCollection
        image={'produitCollection/HommeJM.jpg'}
        title={'Homme'}
        text={'Acheter maintenant'}
        link={'/shopHomme'}
      />
      <ProductCollection
        image={'produitCollection/FemmeJM.jpg'}
        title={'Femme'}
        text={'Acheter maintenant'}
        link={'/shop'}
      />
      <ProductCollection
        image={'produitCollection/Accessoires.png'}
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
