import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext'; // ✅ Vérifie le bon chemin

const AccountPage = () => {
  if (typeof window === 'undefined') {
    return null; // ✅ Empêche Gatsby de planter en mode build
  }

  const { cart, addToCart, removeFromCart, updateQuantity } = useContext(CartContext);

  return (
    <div>
      <h1>Mon Compte</h1>
      <p>Bienvenue sur votre page de compte.</p>
    </div>
  );
};

export default AccountPage;