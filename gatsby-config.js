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
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-transformer-remark`,
    `gatsby-transformer-csv`, // Transforme les fichiers CSV en noeuds GraphQL
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
