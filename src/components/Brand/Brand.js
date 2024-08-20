import React from 'react';
import { navigate } from 'gatsby';

import * as styles from './Brand.module.css';
import logo from '../../../static/Logo_JM_Transparent.png'; 

const Brand = (props) => {
  return (
    <div
      className={styles.root}
      role={'presentation'}
      onClick={() => navigate('/')}
    >
      <img
        src={logo}
        alt="Logo JM"
        width="60"
        height="60"
        onClick={() => navigate('/')} // Si vous souhaitez ajouter une action sur le clic de l'image
      />
    </div>
  );
};

export default Brand;
