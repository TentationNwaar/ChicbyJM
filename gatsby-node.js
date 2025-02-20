const path = require('path');
const fetch = require('node-fetch');

// Charge la clé Printful
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

// 1) Créer les pages dynamiques via slug
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // On récupère la liste "PrintfulProduct" depuis la DB Gatsby
  const result = await graphql(`
    {
      allPrintfulProduct {
        nodes {
          id
          name
        }
      }
    }
  `);

  if (result.errors) {
    console.error("Erreur GraphQL:", result.errors);
    return;
  }

  // Chemin vers le template de page produit
  const productTemplate = require.resolve('./src/templates/product-template.js');

  // Pour chaque produit, construire un slug lisible
  result.data.allPrintfulProduct.nodes.forEach((product) => {
    const slug = product.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');

    // Création de la page
    createPage({
      path: `/product/${slug}`,
      component: productTemplate,
      context: {
        id: product.id, // On passe l'id pour la requête dans product-template.js
      },
    });
  });
};

// 2) Supprimer ESLint & ignorer l’ordre CSS
exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  if (stage === 'develop' || stage === 'build-javascript') {
    const config = getConfig();

    // 1) Ignorer l’ordre des CSS
    const miniCssExtractPlugin = config.plugins.find(
      (plugin) => plugin.constructor.name === 'MiniCssExtractPlugin'
    );
    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true;
    }

    // 2) Supprimer ESLint loader
    config.module.rules = config.module.rules.filter((rule) => {
      if (!rule.use) {
        return true;
      }

      if (Array.isArray(rule.use)) {
        return !rule.use.some((u) => u.loader && u.loader.includes('eslint-loader'));
      }

      if (typeof rule.use === 'object' && rule.use.loader && rule.use.loader.includes('eslint-loader')) {
        return false;
      }
      if (typeof rule.use === 'string' && rule.use.includes('eslint-loader')) {
        return false;
      }

      return true;
    });

    config.plugins = config.plugins.filter(plugin => {
      const pluginName = plugin.constructor && plugin.constructor.name;
      if (pluginName && pluginName.includes('ESLint')) {
        return false;
      }
      return true;
    });

    actions.replaceWebpackConfig(config);
  }
};

// 3) Récupérer & créer nodes Printful
exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions;

  try {
    console.log("🔄 Récupération de TOUS les produits depuis Printful (pagination)...");

    let allProducts = [];
    let currentPage = 1;
    let hasMore = true;

    // 1️⃣ Boucle tant qu’il reste des produits
    while (hasMore) {
      // Appel /sync/products?page=...
      const response = await fetch(`https://api.printful.com/sync/products?page=${currentPage}&limit=100`, {
        headers: {
          Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`❌ Erreur API Printful (page ${currentPage}): ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.result || !Array.isArray(data.result)) {
        throw new Error(`❌ Réponse inattendue: ${JSON.stringify(data)}`);
      }

      // On ajoute ces produits
      allProducts = allProducts.concat(data.result);

      // Pagination
      const { offset, limit, total } = data.paging;
      const nextOffset = offset + limit;
      if (nextOffset >= total) {
        hasMore = false;
      } else {
        currentPage++;
      }
    }

    console.log(`✅ Total produits trouvés: ${allProducts.length}`);

    // 2️⃣ Pour chaque produit => /sync/products/{id} => variantes
    for (const product of allProducts) {
      const detailsResponse = await fetch(`https://api.printful.com/sync/products/${product.id}`, {
        headers: {
          Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
        },
      });
      if (!detailsResponse.ok) {
        console.error(`❌ Erreur lors de la récupération du produit ${product.id}:`,
          detailsResponse.status, detailsResponse.statusText);
        continue;
      }
      const detailsData = await detailsResponse.json();
      if (!detailsData.result) {
        console.error(`❌ Données inattendues pour produit ${product.id}: ${JSON.stringify(detailsData)}`);
        continue;
      }

      const fullProduct = {
        ...product,
        sync_product: detailsData.result.sync_product,
        sync_variants: detailsData.result.sync_variants,
      };

      // 3️⃣ Créer un node Gatsby
      createNode({
        ...fullProduct,
        id: createNodeId(`printful-product-${product.id}`),
        parent: null,
        children: [],
        internal: {
          type: "PrintfulProduct",
          contentDigest: createContentDigest(fullProduct),
        },
      });
    }

    console.log(`✅ ${allProducts.length} produits importés avec succès (avec variantes) !`);
  } catch (error) {
    console.error("❌ Erreur globale Printful:", error);
  }
};