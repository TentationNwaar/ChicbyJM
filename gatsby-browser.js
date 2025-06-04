import * as React from "react";
import { UserProvider } from './src/context/UserContext';
import { CartProvider } from './src/context/CartContext';

export const wrapRootElement = ({ element }) => (
  <UserProvider>
    <CartProvider>
      {element}
    </CartProvider>
  </UserProvider>
);