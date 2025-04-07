import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const AccountPage = () => {
  const { user } = useContext(UserContext);
  if (typeof window === 'undefined') {
    return null; // ✅ Empêche Gatsby de planter en mode build
  }

  const { cart, addToCart, removeFromCart, updateQuantity } = useContext(CartContext);

  return (
    <div>
      <h1>Mon compte</h1>
      {user ? (
        <p>Bienvenue {user.email}</p>
      ) : (
        <p>Veuillez vous connecter pour accéder à votre compte.</p>
      )}
    </div>
  );
};

export default AccountPage;