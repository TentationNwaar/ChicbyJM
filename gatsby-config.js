require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: `Chic by JM`,
    siteUrl: `https://www.chicbyjm.ch`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images/nouveaute`,
      },
    },
    {
      resolve: `gatsby-plugin-env-variables`,
      options: {
        allowList: ["GATSBY_PRINTFUL_API_KEY"],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/src/content/`, // <- Le répertoire où vos fichiers Markdown seront stockés
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `products`,
        path: `${__dirname}/src/data/`, // Répertoire contenant votre fichier CSV
      },
    },
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { 
        prefixes: [`/product/*`] 
      },
    },
    
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-transformer-remark`,
    `gatsby-transformer-csv`, // Transforme les fichiers CSV en noeuds GraphQL
  ],
};
