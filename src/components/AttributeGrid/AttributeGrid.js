import React from 'react';
import { Link } from 'gatsby';
import Attribute from '../Attribute';
import * as styles from './AttributeGrid.module.css';

const AttributeGrid = (props) => {
  return (
    <div className={styles.root}>
      <Attribute
        icon={'delivery'}
        title={'Livraison internationale'}
        subtitle={'Oui oui partout'}
      />
      <Attribute
        icon={'cycle'}
        title={'Retour'}
        subtitle={<Link to="/support#return">Cliquez pour en savoir plus</Link>}
      />
      <Attribute
        icon={'creditcard'}
        title={'Paiement sécurisé'}
        subtitle={'Achetez en toute sécurité'}
      />
    </div>
  );
};

export default AttributeGrid;