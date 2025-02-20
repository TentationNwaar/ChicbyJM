import React from 'react';
import * as styles from './Chip.module.css';

const Chip = ({ name, onClick }) => {
  return (
    <div
      className={styles.chip}
      role="button"
      tabIndex={0}
      onClick={() => {
        console.log("Clique sur la Chip:", name);
        onClick?.(); // Si onClick est défini, on l'appelle
      }}
    >
      {name} <span className={styles.close}>×</span>
    </div>
  );
};

export default Chip;