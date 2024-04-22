import React from 'react';
import * as styles from './ProductCollectionGrid.module.css';

import ProductCollection from '../ProductCollection';

const ProductCollectionGrid = (props) => {
  return (
    <div className={styles.root}>
      <ProductCollection
        image={'HommeJM.jpg'}
        title={'Homme'}
        text={'Acheter maintenant'}
        link={'/shop'}
      />
      <ProductCollection
        image={'FemmeJM.jpg'}
        title={'Femme'}
        text={'Acheter maintenant'}
        link={'/shop'}
      />
      <ProductCollection
        image={'AccessoireJM.jpg'}
        title={'Accessoires'}
        text={'Acheter maintenant'}
        link={'/shop'}
      />
      <ProductCollection
        image={'EnfantJM.jpg'}
        title={'Enfants'}
        text={'Acheter maintenant'}
        link={'/shop'}
      />
    </div>
  );
};

export default ProductCollectionGrid;
