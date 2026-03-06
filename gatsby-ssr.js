const React = require("react");
const { UserProvider } = require("./src/context/UserContext");
const { CartProvider } = require("./src/context/CartContext");

exports.wrapRootElement = ({ element }) => (
  <UserProvider>
    <CartProvider>{element}</CartProvider>
  </UserProvider>
);

exports.onRenderBody = ({ setHeadComponents }) => {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Chic by JM",
    url: "https://chicbyjm.ch",
    logo: "https://chicbyjm.ch/logo.png",
    sameAs: ["https://www.instagram.com/chicbyjm"],
    areaServed: "Switzerland",
  };

  setHeadComponents([
    React.createElement("script", {
      key: "jsonld-organization",
      type: "application/ld+json",
      dangerouslySetInnerHTML: { __html: JSON.stringify(orgJsonLd) },
    }),
  ]);
};