import React from 'react';
import { UserProvider } from './src/context/UserContext';

export const wrapRootElement = ({ element }) => (
  <UserProvider>{element}</UserProvider>
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