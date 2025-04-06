import React from 'react';
import { CartProvider } from './src/context/CartContext';
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />

export const wrapRootElement = ({ element }) => (
  <CartProvider>{element}</CartProvider>
);