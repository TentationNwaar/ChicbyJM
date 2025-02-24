import React, { useContext } from 'react';
import { Link } from 'gatsby';
import { CartContext } from '../../context/CartContext';
import * as styles from './MiniCart.module.css';

const MiniCart = ({ closeCart }) => {
  const { cart } = useContext(CartContext) || { cart: [] }; // 🔹 Évite les erreurs si `cart` est undefined

  // 🔹 Sécuriser `reduce` pour éviter une erreur si `cart` est vide ou non défini
  const total = (cart || []).reduce((sum, item) => sum + (item.price || 0), 0);
  
  console.log("Contenu du panier :", cart);

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
              {item.image && ( // 🔹 Vérifie si l’image existe avant de l’afficher
                <img src={item.image} alt={item.name || "Produit"} className={styles.cartImage} />
              )}
              <div>
                <p><strong>{item.name || "Produit sans nom"}</strong></p>
                {item.color && <p>Couleur : {item.color}</p>}
                {item.size && <p>Taille : {item.size}</p>}
                <p>Prix : CHF {typeof item.price === "number" ? item.price.toFixed(2) : "N/A"}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

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