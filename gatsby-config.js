require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: `Chic by JM`,
    description: `Vêtements lifestyle et sport.`,
    siteUrl: `https://chicbyjm.ch`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/src/content/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `products`,
        path: `${__dirname}/src/data/`,
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    // On garde sitemap et robots
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        policy: [
          {
            userAgent: "*",
            allow: "/",
            disallow: [
              "/account",
              "/checkout",
              "/cart",
              "/login",
            ],
          },
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-transformer-remark`,
    `gatsby-transformer-csv`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        excludes: [
          `/account/*`,
          `/cart/`,
          `/checkout/`,
          `/checkout-result/`,
          `/login/`,
          `/signup/`,
          `/orderConfirm/`,
          `/forgot/`,
          `/test/`,
          `/tempCodeRunnerFile/`,
          `/account-home/`,
          `/accountSuccess/`,
        ],
      },
    },
    // IMPORTANT: On retire react-helmet si on utilise Head API, 
    // ou on s'assure qu'il n'interfère pas.
  ],
};