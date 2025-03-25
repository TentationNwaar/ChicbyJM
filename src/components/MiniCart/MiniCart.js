import React, { useContext } from 'react';
import { Link } from 'gatsby';
import { CartContext } from '../../context/CartContext';
import * as styles from './MiniCart.module.css';
import { useEffect } from 'react';

const MiniCart = ({ closeCart }) => {
  const { cart } = useContext(CartContext);

  // ✅ Calcul du total (évite NaN)
  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  useEffect(() => {
    console.log('MiniCart monté');
  
    return () => console.log('MiniCart démonté');
  }, []);

  return (
    <div className={styles.miniCart}>
      <button className={styles.closeButton} onClick={closeCart}>×</button>
      <h2>Mon Panier</h2>

      {cart.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <ul className={styles.cartItems}>
          {cart.map((item, index) => (
            <li key={index} className={styles.cartItem}>
              {/* ✅ Ajout de l’image */}
              {item.image ? (
                <img src={item.image} alt={item.name} className={styles.cartImage} />
              ) : (
                <p>Pas d'image</p>
              )}
              
              <div className={styles.itemDetails}>
                <p><strong>{item.name}</strong></p>
                {item.color && <p>Couleur : {item.color}</p>}
                {item.size && <p>Taille : {item.size}</p>}
                {/* ✅ Correction de l'affichage du prix */}
                <p>Prix : CHF {item.price ? item.price.toFixed(2) : "Non disponible"}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ✅ Affichage du total */}
      <div className={styles.cartTotal}>
        <strong>Total : CHF {total.toFixed(2)}</strong>
      </div>

      <div className={styles.cartActions}>
        <Link to="/cart" className={styles.checkoutButton} onClick={closeCart}>
          Voir le panier
        </Link>
      </div>
    </div>
  );
};

export default MiniCart;