const React = require("react");
const { UserProvider } = require("./src/context/UserContext");
const { CartProvider } = require("./src/context/CartContext");

exports.wrapRootElement = ({ element }) => (
  <UserProvider>
    <CartProvider>{element}</CartProvider>
  </UserProvider>
);

exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <link
      key="poppins-font"
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
      rel="stylesheet"
    />,
    <link
      key="slick-theme"
      rel="stylesheet"
      type="text/css"
      href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
    />,
    <link
      key="slick-main"
      rel="stylesheet"
      type="text/css"
      href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
    />,
  ]);
};