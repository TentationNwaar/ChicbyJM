import React from 'react';
import * as styles from './ProductCollectionGrid.module.css';

import ProductCollection from '../ProductCollection';

const ProductCollectionGrid = (props) => {
  return (
    <div className={styles.root}>
      <ProductCollection
        image={'/Homme.webp'}
        title={'Homme'}
        text={'Acheter maintenant'}
        link={'/shopHomme'}
      />
      <ProductCollection
        image={'/Femme.webp'}
        title={'Femme'}
        text={'Acheter maintenant'}
        link={'/shopFemme'}
      />
      <ProductCollection
        image={'Accessoires.webp'}
        title={'Accessoires'}
        text={'Acheter maintenant'}
        link={'/shopAccessoire'}
      />
      <ProductCollection
        image={'/SchoolSpirit.webp'}
        title={'Enfants'}
        text={'Acheter maintenant'}
        link={'/shopEnfant'}
      />
    </div>
  );
};

export default ProductCollectionGrid;
