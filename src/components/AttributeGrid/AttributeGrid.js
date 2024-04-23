import React from 'react';

import Attribute from '../Attribute';

import * as styles from './AttributeGrid.module.css';

const AttributeGrid = (props) => {
  return (
    <div className={styles.root}>
      <Attribute
        icon={'Livraison'}
        title={'Livraison internationale'}
        subtitle={'Oui oui partout'}
      />
      <Attribute
        icon={'cycle'}
        title={'Retour'}
        subtitle={<a href="/PolitiqueRetour">Cliquez pour en savoir plus</a>}
      />
      <Attribute
        icon={'Carte de crédit'}
        title={'Paiement sécurisé'}
        subtitle={'Achetez en toute sécurité'}
      />
    </div>
  );
};

export default AttributeGrid;
