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

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <link
      key="poppins-font"
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
  ]);
};