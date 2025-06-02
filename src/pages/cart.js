import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import Layout from "../components/Layout";
import * as styles from "./cart.module.css";

const CartPage = () => {
  const context = useContext(CartContext);

  if (!context) {
    if (typeof window === 'undefined') {
      // 🛡 Protection pendant le build statique Gatsby
      return null;
    } else {
      throw new Error('CartContext must be used within a CartProvider');
    }
  }

  const { cart, addToCart, removeFromCart, updateQuantity } = context;

  // ✅ Calcul du total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Layout>
      <div className={styles.cartContainer}>
        <h1 className={styles.cartTitle}>PANIER</h1>

        {cart.length === 0 ? (
          <p className={styles.emptyCart}>Votre panier est vide.</p>
        ) : (
          <div className={styles.cartContent}>
            {/* ✅ Liste des articles */}
            <div className={styles.cartItems}>
              {cart.map((item, index) => (
                <div key={index} className={styles.cartItem}>
                  <img src={item.image} alt={item.name} className={styles.cartImage} />
                  <div className={styles.itemDetails}>
                    <h2 className={styles.productName}>{item.name}</h2>
                    <p className={styles.productInfo}>Couleur : {item.color}</p>
                    <p className={styles.productInfo}>Taille : {item.size}</p>
                    <p className={styles.productPrice}>CHF {item.price.toFixed(2)}</p>

                    {/* ✅ Sélection de quantité */}
                    <div className={styles.quantitySelector}>
                      <button
                        className={styles.quantityButton}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        className={styles.quantityButton}
                        onClick={() => addToCart(item)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* ✅ Bouton suppression */}
                  <button
                    className={styles.removeButton}
                    onClick={() => removeFromCart(item.id)}
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>

            {/* ✅ Section résumé de la commande */}
            <div className={styles.cartSummary}>
              <h2>RÉCAPITULATIF</h2>
              <div className={styles.summaryRow}>
                <span>Montant de la commande</span>
                <span>CHF {total.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Frais de livraison</span>
                <span>GRATUIT</span>
              </div>
              <hr />
              <div className={styles.summaryTotal}>
                <span><strong>TOTAL</strong></span>
                <span><strong>CHF {(total).toFixed(2)}</strong></span>
              </div>

              <button className={styles.checkoutButton}>VERS LA FINALISATION DE LA COMMANDE</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;