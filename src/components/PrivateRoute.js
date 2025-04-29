import React, { useContext, useEffect } from 'react';
import { navigate } from 'gatsby';
import { UserContext } from '../context/UserContext';

const PrivateRoute = ({ children }) => {
  const { user, isLoadingUser } = useContext(UserContext);

  useEffect(() => {
    console.log('🛡 PrivateRoute - user:', user, '| loading:', isLoadingUser);
    if (!isLoadingUser && user === null) {
      navigate('/login');
    }
  }, [user, isLoadingUser]);

  if (isLoadingUser) {
    return <p>Chargement de la session…</p>;
  }

  if (!user) {
    return null; // en attendant la redirection
  }

  return <>{children}</>;
};

export default PrivateRoute;