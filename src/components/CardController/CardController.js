import React, { useState } from 'react';

import Container from '../Container';
import Checkbox from '../Checkbox';
import * as styles from './CardController.module.css';
import Button from '../Button';
import Drawer from '../Drawer';
import Icon from '../Icons/Icon';

/**
 * CardController :
 * - Affiche la liste des filtres (ex: Couleurs, Tailles, Prix...)
 * - stocke tout dans un array "filterState"
 * - Quand on clique "Voir les produits", appelle onFilterChange(filterState)
 */
const CardController = (props) => {
  const { filters, visible, closeFilter, onFilterChange } = props;
  const [category, setCategory] = useState();
  const [filterState, setFilterState] = useState(filters);

  // Coche/décoche un item
  const filterTick = (e, categoryIndex, labelIndex) => {
    const filterStateCopy = [...filterState];
    filterStateCopy[categoryIndex].items[labelIndex].value = e.target.checked;
    setFilterState(filterStateCopy);
  };

  // Réinitialiser tous les filtres
  const resetFilter = () => {
    const filterStateCopy = [...filterState];
    for (let x = 0; x < filterStateCopy.length; x++) {
      for (let y = 0; y < filterStateCopy[x].items.length; y++) {
        filterStateCopy[x].items[y].value = false;
      }
    }
    setFilterState(filterStateCopy);
  };

  // Au clic sur "Voir les produits", on transmet filterState au parent
  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange(filterState);
    }
    closeFilter();
  };

  return (
    <div>
      {/* --- Mode desktop --- */}
      <div className={`${styles.webRoot} ${visible ? styles.show : styles.hide}`}>
        <Container>
          <div className={styles.filterContainer}>
            {filterState?.map((filter, categoryIndex) => {
              const colNum = filter.items.length >= 4 ? 2 : 1;
              return (
                <div key={`category-${categoryIndex}`}>
                  <span className={styles.category}>{filter.category}</span>
                  <div
                    className={styles.nameContainers}
                    style={{ gridTemplateColumns: `repeat(${colNum}, 1fr)` }}
                  >
                    {filter.items?.map((item, itemIndex) => (
                      <Checkbox
                        key={itemIndex}
                        action={(e) => filterTick(e, categoryIndex, itemIndex)}
                        label={item.name}
                        value={item.value}
                        id={item.name}
                        name={item.name}
                        isChecked={item.value}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
        <div className={styles.actionContainer}>
          <Button onClick={applyFilters} className={styles.customButtonStyling} level="primary">
            Voir les produits
          </Button>
          <Button onClick={closeFilter} className={styles.customButtonStyling} level="secondary">
            Fermer
          </Button>
        </div>
      </div>

      {/* --- Mode mobile (drawer) --- */}
      <div className={styles.mobileRoot}>
        <Drawer visible={visible} close={closeFilter}>
          <div className={styles.mobileFilterContainer}>
            <h2 className={styles.mobileFilterTitle}>Filters</h2>

            {category === undefined && (
              <div className={styles.mobileFilters}>
                {filterState?.map((filterItem, categoryIndex) => (
                  <div
                    key={categoryIndex}
                    className={styles.filterItemContainer}
                    role="presentation"
                    onClick={() =>
                      setCategory({
                        ...filterItem,
                        categoryIndex,
                      })
                    }
                  >
                    <span className={styles.filterName}>{filterItem.category}</span>
                    <Icon symbol="arrow" />
                  </div>
                ))}
              </div>
            )}

            {category !== undefined && (
              <div className={styles.mobileCategoryContainer}>
                <div
                  className={styles.mobileHeader}
                  role="presentation"
                  onClick={() => setCategory(undefined)}
                >
                  <Icon symbol="arrow" />
                  <span className={styles.mobileCategory}>{category.category}</span>
                </div>
                {category.items.map((item, itemIndex) => (
                  <Checkbox
                    key={itemIndex}
                    action={(e) => filterTick(e, category.categoryIndex, itemIndex)}
                    label={item.name}
                    value={item.value}
                    id={item.name}
                    name={item.name}
                    isChecked={item.value}
                  />
                ))}
              </div>
            )}

            <div className={styles.mobileButtonContainer}>
              {category === undefined && (
                <Button onClick={applyFilters} fullWidth level="primary">
                  Afficher les résultats
                </Button>
              )}
              {category !== undefined && (
                <div>
                  <Button onClick={closeFilter} fullWidth level="primary">
                    Apply
                  </Button>
                  <div
                    className={styles.clearFilterContainer}
                    role="presentation"
                    onClick={() => resetFilter()}
                  >
                    <span className={styles.clearFilter}>clear filters</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default CardController;