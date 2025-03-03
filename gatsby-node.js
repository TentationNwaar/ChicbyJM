const path = require("path");
const fetch = require("node-fetch");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;
  console.log("🔑 Clé API dans Gatsby (backend) :", process.env.PRINTFUL_API_KEY);

  //  Génération des pages produits Printful
  const resultPrintful = await graphql(`
    query {
      allPrintfulProduct {
        nodes {
          id
          name
          slug
          thumbnail_url
        }
      }
    }
  `);

  if (resultPrintful.errors) throw resultPrintful.errors;

  resultPrintful.data.allPrintfulProduct.nodes.forEach((product) => {
    if (!product.slug) {
      console.error("⚠️ SLUG UNDEFINED:", product);
      return;
    }

    createPage({
      path: `/en/product/${product.slug}/`, // Chemin de la page produit
      component: require.resolve("./src/templates/product-template.js"), // Template de la page produit
      context: { id: product.id }, // Passez l'ID du produit comme contexte
    });
  });

  //  Page account
  createPage({
    path: "/en/account/",
    component: require.resolve("./src/pages/account.js"),
    context: {
      id: product.id,
      thumbnail_url: product.thumbnail_url,
    },
  });
};

//  Suppression ESLint & gestion du CSS
exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  actions.setWebpackConfig({
    plugins: [
      new (require("webpack")).DefinePlugin({
        "process.env.PRINTFUL_API_KEY": JSON.stringify(process.env.PRINTFUL_API_KEY),
      }),
    ],
  });
  if (stage === "develop" || stage === "build-javascript") {
    const config = getConfig();

    const miniCssExtractPlugin = config.plugins.find(
      (plugin) => plugin.constructor.name === "MiniCssExtractPlugin"
    );
    if (miniCssExtractPlugin) miniCssExtractPlugin.options.ignoreOrder = true;

    config.module.rules = config.module.rules.filter((rule) => {
      if (!rule.use) return true;
      if (Array.isArray(rule.use)) return !rule.use.some((u) => u.loader && u.loader.includes("eslint-loader"));
      if (typeof rule.use === "object" && rule.use.loader && rule.use.loader.includes("eslint-loader")) return false;
      if (typeof rule.use === "string" && rule.use.includes("eslint-loader")) return false;
      return true;
    });

    config.plugins = config.plugins.filter(plugin => {
      const pluginName = plugin.constructor && plugin.constructor.name;
      return !(pluginName && pluginName.includes("ESLint"));
    });

    actions.replaceWebpackConfig(config);
  }
};

//  Importation des produits Printful
exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions;

  try {
    console.log(" Récupération des produits depuis Printful...");
    let allProducts = [];
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(`https://api.printful.com/sync/products?page=${currentPage}&limit=100`, {
        headers: { Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}` },
      });

      if (!response.ok) throw new Error(`❌ Erreur API Printful: ${response.statusText}`);
      const data = await response.json();
      allProducts = allProducts.concat(data.result);
      hasMore = data.paging.offset + data.paging.limit < data.paging.total;
      currentPage++;
    }

    console.log(`✅ ${allProducts.length} produits trouvés.`);

    for (const product of allProducts) {
      const detailsResponse = await fetch(`https://api.printful.com/sync/products/${product.id}`, {
        headers: { Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}` },
      });

      if (!detailsResponse.ok) {
        console.error(`❌ Erreur récupération produit ${product.id}: ${detailsResponse.statusText}`);
        continue;
      }

      const detailsData = await detailsResponse.json();
      const productDetails = detailsData.result.sync_product;
      const baseProductId = detailsData.result.sync_variants.length > 0 ? detailsData.result.sync_variants[0].product.variant_id : null;
      let sizeGuide = null;

      if (baseProductId) {
        try {
          const sizeResponse = await fetch(`https://api.printful.com/products/${baseProductId}`, {
            headers: { Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}` },
          });

          if (sizeResponse.ok) {
            const sizeData = await sizeResponse.json();
            sizeGuide = sizeData.result.product.dimensions || null;
          }
        } catch (error) {
          console.error(`❌ Erreur récupération guide des tailles pour ${product.id}:`, error);
        }
      }

      createNode({
        id: createNodeId(`printful-product-${product.id}`),
        name: product.name,
        slug: product.name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        description: productDetails?.description || "Aucune description disponible.",
        thumbnail_url: product.thumbnail_url,
        sync_variants: detailsData.result.sync_variants,
        size_guide: sizeGuide,
        parent: null,
        children: [],
        internal: { type: "PrintfulProduct", contentDigest: createContentDigest(productDetails) },
      });
    }
    console.log("✅ Importation réussie !");
  } catch (error) {
    console.error("❌ Erreur globale Printful:", error);
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type PrintfulProduct implements Node {
      size_guide: [SizeGuide]
    }
    type SizeGuide {
      size: String
      chest: String
      length: String
    }
  `);
};