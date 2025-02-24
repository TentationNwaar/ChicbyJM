import React, { useContext } from "react";
import Layout from "../components/Layout";
import { CartContext } from "../context/CartContext";
import { Link } from "gatsby";
import "./cart.css";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

  return (
    <Layout>
      <div className="cart-container">
        <h1>🛒 Mon Panier</h1>

        {cart.length === 0 ? (
          <p>Votre panier est vide. <Link to="/">Retour à la boutique</Link></p>
        ) : (
          <table className="cart-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Couleur</th>
                <th>Taille</th>
                <th>Prix</th>
                <th>Quantité</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index}>
                  <td>
                    <img src={item.image} alt={item.name} className="cart-image" />
                    <p>{item.name}</p>
                  </td>
                  <td>{item.color}</td>
                  <td>{item.size}</td>
                  <td>CHF {item.price}</td>
                  <td>
                    <button onClick={() => updateQuantity(index, item.quantity - 1)}>-</button>
                    {item.quantity}
                    <button onClick={() => updateQuantity(index, item.quantity + 1)}>+</button>
                  </td>
                  <td>CHF {(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                  <td>
                    <button className="remove-button" onClick={() => removeFromCart(index)}>❌</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {cart.length > 0 && (
          <div className="cart-summary">
            <h2>Total : CHF {cart.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0).toFixed(2)}</h2>
            <button className="checkout-button">Passer à la caisse</button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;