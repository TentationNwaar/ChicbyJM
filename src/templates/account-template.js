import React from 'react';
import PrivateRoute from '../components/PrivateRoute';

const AccountPage = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Page compte</h1>
      <p>Bienvenue sur ton compte.</p>
    </div>
  );
};

export default () => (
  <PrivateRoute>
    <AccountPage />
  </PrivateRoute>
);