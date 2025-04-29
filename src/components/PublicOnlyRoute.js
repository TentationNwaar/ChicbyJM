import React, { useContext, useEffect } from 'react';
import { navigate } from 'gatsby';
import { UserContext } from '../context/UserContext';

const PublicOnlyRoute = ({ children }) => {
  const { user, isLoadingUser } = useContext(UserContext);

  useEffect(() => {
    console.log('👤 user =', user);
    console.log('⏳ isLoadingUser =', isLoadingUser);
  
    if (!isLoadingUser && user) {
      navigate('/account');
    }
  }, [user, isLoadingUser]);

  if (isLoadingUser || (user && typeof window !== 'undefined')) {
    return <p>Chargement…</p>;
  }

  return <>{children}</>;
};

export default PublicOnlyRoute;