// https://stackoverflow.com/questions/63124432/how-do-i-configure-mini-css-extract-plugin-in-gatsby
exports.onCreateWebpackConfig = (helper) => {
  const { stage, actions, getConfig } = helper;
  if (stage === 'develop' || stage === 'build-javascript') {
    const config = getConfig();
    const miniCssExtractPlugin = config.plugins.find(
      (plugin) => plugin.constructor.name === 'MiniCssExtractPlugin'
    );
    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true;
    }
    actions.replaceWebpackConfig(config);
  }
};

// New code to create product pages
const path = require('path');

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // Fetch product data
  const result = await graphql(`
    {
      allProductsCsv {
        edges {
          node {
            Handle
          }
        }
      }
    }
  `);

  // Template for the product page
  const productTemplate = path.resolve('src/templates/product-template.js');

  // Loop through each product and create a page
  result.data.allProductsCsv.edges.forEach(({ node }) => {
    createPage({
      path: `/product/${node.Handle}`,
      component: productTemplate,
      context: {
        handle: node.Handle, // Pass the handle to the template query
      },
    });
  });
};