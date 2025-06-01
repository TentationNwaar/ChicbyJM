import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';

const PrivateRoute = ({ children }) => {
  const { user, isLoadingUser } = useContext(UserContext);

  console.log('[🔐] PrivateRoute mounted');
  console.log('user:', user);
  console.log('isLoadingUser:', isLoadingUser);

  if (isLoadingUser) {
    return <p>⏳ Chargement de la session…</p>;
  }

  if (!user) {
    return <p>🚫 Aucun utilisateur connecté</p>; // ← très utile pour déboguer
  }

  return (
    <div>
      <p>✅ Utilisateur connecté</p>
      {children}
    </div>
  );
};

export default PrivateRoute;