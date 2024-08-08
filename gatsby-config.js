module.exports = {
  siteMetadata: {
    title: `Gatsby Sydney Ecommerce Theme`,
    siteUrl: `https://jamm.matter.design`,
  },
  plugins: [
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
