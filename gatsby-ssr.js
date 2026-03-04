const React = require("react");

exports.onRenderBody = ({ setHeadComponents }) => {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Chic by JM",
    url: "https://www.chicbyjm.ch",
    logo: "https://www.chicbyjm.ch/logo.png",
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