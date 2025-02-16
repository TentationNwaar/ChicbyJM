const path = require('path');
const fetch = require('node-fetch');

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});


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

    // 2) Supprimer tout loader ESLint
    config.module.rules = config.module.rules.filter((rule) => {
      // S’il n’y a pas de "use", on laisse la règle
      if (!rule.use) {
        return true;
      }

      // Si "use" est un tableau, on vérifie s’il contient eslint-loader
      if (Array.isArray(rule.use)) {
        return !rule.use.some((u) => u.loader && u.loader.includes('eslint-loader'));
      }

      // Sinon, si c’est un objet ou string, on vérifie également
      if (typeof rule.use === 'object' && rule.use.loader && rule.use.loader.includes('eslint-loader')) {
        return false;
      }
      if (typeof rule.use === 'string' && rule.use.includes('eslint-loader')) {
        return false;
      }

      return true;
    });

    config.plugins = config.plugins.filter(plugin => {
      // On vérifie le nom du plugin
      const pluginName = plugin.constructor && plugin.constructor.name;
      // Si c'est ESLintWebpackPlugin ou Eslintsomething, on le retire
      if (pluginName && pluginName.includes('ESLint')) {
        return false;
      }
      return true;
    });

    actions.replaceWebpackConfig(config);
  }
};


exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions;

  try {
    console.log("🔄 Récupération de TOUS les produits depuis Printful avec pagination...");

    let allProducts = [];
    let currentPage = 1;
    let hasMore = true;

    // 1️⃣ Boucle tant qu’il reste des produits à récupérer
    while (hasMore) {
      // Appel d’une page de /sync/products
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

      // On ajoute les produits de cette page
      allProducts = allProducts.concat(data.result);

      // Gestion de la pagination via data.paging
      // data.paging.offset, data.paging.limit, data.paging.total
      const { offset, limit, total } = data.paging;
      const nextOffset = offset + limit;
      if (nextOffset >= total) {
        // on a récupéré tous les produits
        hasMore = false;
      } else {
        // passer à la page suivante
        currentPage++;
      }
    }

    console.log(`✅ Total produits trouvés: ${allProducts.length}`);

    // 2️⃣ Pour chaque produit, récupérer les variantes
    for (const product of allProducts) {
      const detailsResponse = await fetch(`https://api.printful.com/sync/products/${product.id}`, {
        headers: {
          Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
        },
      });
      if (!detailsResponse.ok) {
        console.error(
          `❌ Erreur lors de la récupération du produit ${product.id}:`,
          detailsResponse.status,
          detailsResponse.statusText
        );
        continue; // on passe au suivant
      }

      const detailsData = await detailsResponse.json();
      if (!detailsData.result) {
        console.error(`❌ Données inattendues pour le produit ${product.id}: ${JSON.stringify(detailsData)}`);
        continue;
      }

      const fullProduct = {
        ...product,
        sync_product: detailsData.result.sync_product,
        sync_variants: detailsData.result.sync_variants,
      };

      // 3️⃣ Créer le node Gatsby
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