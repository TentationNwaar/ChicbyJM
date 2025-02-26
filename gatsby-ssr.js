import React from 'react';
import { CartProvider } from './src/context/CartContext'; // ✅ Vérifie le bon chemin

export const wrapRootElement = ({ element }) => (
  <CartProvider>{element}</CartProvider>
);