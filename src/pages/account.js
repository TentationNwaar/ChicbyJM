import React from 'react';
import PrivateRoute from '../components/PrivateRoute';

const AccountPage = () => {
  return (
    <PrivateRoute>
      <h1>Bienvenue sur ton compte !</h1>
    </PrivateRoute>
  );
};

export default AccountPage;