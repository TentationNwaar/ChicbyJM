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
        onClick?.(); // Appelle la fonction removeFilter(...) si elle est fournie
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClick?.();
      }}
    >
      {name}
      <span className={styles.close}>×</span>
    </div>
  );
};

export default Chip;