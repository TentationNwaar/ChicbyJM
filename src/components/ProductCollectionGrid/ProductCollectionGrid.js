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
        link={'/shophomme'}
      />
      <ProductCollection
        image={'/Femme.webp'}
        title={'Femme'}
        text={'Acheter maintenant'}
        link={'/shopfemme'}
      />
      <ProductCollection
        image={'Accessoires.webp'}
        title={'Accessoires'}
        text={'Acheter maintenant'}
        link={'/shopaccessoire'}
      />
      <ProductCollection
        image={'/SchoolSpirit.webp'}
        title={'Enfants'}
        text={'Acheter maintenant'}
        link={'/shopenfant'}
      />
    </div>
  );
};

export default ProductCollectionGrid;
