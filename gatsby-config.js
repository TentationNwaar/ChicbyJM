module.exports = {
  siteMetadata: {
    title: `Gatsby Sydney Ecommerce Theme`,
    siteUrl: `https://jamm.matter.design`,
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-react-i18next',
      options: {
        localeJsonSourceName: 'locales', // nom de la source de données
        languages: ['en', 'fr'], // langues supportées
        defaultLanguage: 'en', // langue par défaut
        siteUrl: 'https://chicbyjm.netlify.app/',
        i18nextOptions: {
          interpolation: {
            escapeValue: false, // pas nécessaire pour React
          },
          keySeparator: false,
          nsSeparator: false,
        },
        pages: [
          {
            matchPath: '/:lang?/about',
            getLanguageFromPath: true,
          },
          // plus de configurations de pages si nécessaire
        ],
      },
    },
  ],
};
