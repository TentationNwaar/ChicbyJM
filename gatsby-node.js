const path = require("path");
const fetch = require("node-fetch");

// Charge la clé Printful
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

// 📌 1) Créer les pages dynamiques via slug
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

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
    console.error("❌ Erreur GraphQL:", result.errors);
    return;
  }

  const productTemplate = require.resolve("./src/templates/product-template.js");

  result.data.allPrintfulProduct.nodes.forEach((product) => {
    const slug = product.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    createPage({
      path: `/product/${slug}`,
      component: productTemplate,
      context: { id: product.id },
    });
  });
};

// 📌 2) Supprimer ESLint & ignorer l’ordre CSS
exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  if (stage === "develop" || stage === "build-javascript") {
    const config = getConfig();

    const miniCssExtractPlugin = config.plugins.find(
      (plugin) => plugin.constructor.name === "MiniCssExtractPlugin"
    );
    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true;
    }

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

// 📌 3) Récupérer & créer les nodes Printful
exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions;

  try {
    console.log("🔄 Récupération des produits depuis Printful...");

    let allProducts = [];
    let currentPage = 1;
    let hasMore = true;

    // 📌 Récupérer tous les produits
    while (hasMore) {
      const response = await fetch(`https://api.printful.com/sync/products?page=${currentPage}&limit=100`, {
        headers: { Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}` },
      });

      if (!response.ok) throw new Error(`❌ Erreur API Printful (page ${currentPage}): ${response.statusText}`);

      const data = await response.json();
      if (!data.result || !Array.isArray(data.result)) throw new Error(`❌ Réponse inattendue: ${JSON.stringify(data)}`);

      allProducts = allProducts.concat(data.result);

      const { offset, limit, total } = data.paging;
      hasMore = (offset + limit) < total;
      currentPage++;
    }

    console.log(`✅ ${allProducts.length} produits trouvés.`);

    // 🔄 Récupération des détails de chaque produit
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
      const variants = detailsData.result.sync_variants || [];

      // ✅ Vérification si une variante est disponible pour récupérer `size_guide`
      let sizeGuide = null;
      if (variants.length > 0) {
        const firstVariantId = variants[0].variant_id; // ID du premier variant
        try {
          const sizeResponse = await fetch(`https://api.printful.com/products/${firstVariantId}`, {
            headers: { Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}` },
          });

          if (sizeResponse.ok) {
            const sizeData = await sizeResponse.json();
            sizeGuide = sizeData.result.product.dimensions || null; // ⚡ Vérifie si les tailles existent
          }
        } catch (error) {
          console.error(`❌ Erreur récupération tailles pour produit ${product.id}:`, error);
        }
      }

      // ✅ Création du node Gatsby
      createNode({
        id: createNodeId(`printful-product-${product.id}`),
        name: product.name,
        description: productDetails?.description || "Aucune description disponible.",
        thumbnail_url: product.thumbnail_url || "",
        sync_variants: variants,
        size_guide: sizeGuide || [],  // ✅ S'assure que le champ existe toujours
        parent: null,
        children: [],
        internal: {
          type: "PrintfulProduct",
          contentDigest: createContentDigest(productDetails),
        },
      });
    }
    console.log(`✅ Importation réussie !`);
  } catch (error) {
    console.error("❌ Erreur globale Printful:", error);
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type PrintfulProduct implements Node {
      id: ID!
      name: String!
      description: String
      thumbnail_url: String
      sync_variants: [SyncVariant]
      size_guide: [SizeGuide]
    }

    type SyncVariant {
      id: ID!
      name: String!
      retail_price: String
      currency: String
    }

    type SizeGuide {
      size: String
      chest: String
      length: String
    }
  `);
};