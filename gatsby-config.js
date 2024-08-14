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
        path: `${__dirname}/src/images/products`,
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: 'gatsby-plugin-react-i18next',
      options: {
        localeJsonSourceName: 'intl', // Name of the data source
        languages: ['en', 'fr'], // Supported languages
        defaultLanguage: 'fr', // Default language
        siteUrl: 'https://chicbyjm.netlify.app/',
        i18nextOptions: {
          interpolation: {
            escapeValue: false, // Not necessary for React
          },
          keySeparator: false,
          nsSeparator: false,
        },
        pages: [
          {
            matchPath: '/:lang?/about',
            getLanguageFromPath: true,
          },
          // Additional page configurations if necessary
        ],
      },
    },
  ],
};
