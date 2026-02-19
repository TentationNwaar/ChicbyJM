const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;

  // 1) Pages produits Printful
  const resultPrintful = await graphql(`
    query {
      allPrintfulProduct {
        nodes {
          id
          name
          slug
          description
          thumbnail_url
        }
      }
    }
  `);

  if (resultPrintful.errors) {
    reporter.panicOnBuild(
      `GraphQL error in createPages:`,
      resultPrintful.errors,
    );
    return;
  }

  const products = resultPrintful?.data?.allPrintfulProduct?.nodes || [];
  let createdCount = 0;

  products.forEach((product) => {
    const rawSlug = (product?.slug || '').trim();
    if (!rawSlug) {
      reporter.warn(
        `⚠️  Missing slug for product id=${product?.id} name="${product?.name}" — skipping page creation.`,
      );
      return;
    }

    const safeSlug = rawSlug.replace(/^\/+|\/+$/g, ''); // pas de / en début/fin
    const productPath = `/en/product/${safeSlug}/`;

    createPage({
      path: productPath,
      component: require.resolve('./src/templates/product-template.js'),
      context: {
        id: String(product.id),
        slug: safeSlug,
        name: product?.name || "",
        description: product?.description || "",
      },
    });
    createdCount++;
  });

  reporter.info(`✅ Product pages created: ${createdCount}`);

  // Redirect any legacy /product/* to /en/product/* so DevLoader never hits a missing page
  actions.createRedirect({
    fromPath: `/product/*`,
    toPath: `/en/product/:splat/`,
    isPermanent: false,
    redirectInBrowser: true,
  });

  // Ensure trailing slash version
  actions.createRedirect({
    fromPath: `/en/product/:slug`,
    toPath: `/en/product/:slug/`,
    isPermanent: false,
    redirectInBrowser: true,
  });

  // 2) Route client-only /account/* (optionnelle, seulement si le fichier existe)
  const accountCandidatePaths = [
    path.resolve('./src/pages/account.js'),
    path.resolve('./src/pages/account/index.js'),
  ];
  const accountFile = accountCandidatePaths.find((p) => fs.existsSync(p));

  if (accountFile) {
    createPage({
      path: `/account/`,
      matchPath: `/account/*`,
      component: accountFile,
    });
    reporter.info(
      `✅ Client-only route enabled at /account/* using ${path.relative(process.cwd(), accountFile)}`,
    );
  } else {
    reporter.info(
      `ℹ️  No src/pages/account(.js|/index.js) — skipping /account/* client route.`,
    );
  }
};

//  Suppression ESLint & gestion du CSS
exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  actions.setWebpackConfig({
    plugins: [
      new (require('webpack').DefinePlugin)({
        'process.env.PRINTFUL_API_KEY': JSON.stringify(
          process.env.PRINTFUL_API_KEY,
        ),
      }),
    ],
  });

  if (stage === 'develop' || stage === 'build-javascript') {
    const config = getConfig();

    const miniCssExtractPlugin = config.plugins.find(
      (plugin) =>
        plugin.constructor &&
        plugin.constructor.name === 'MiniCssExtractPlugin',
    );
    if (miniCssExtractPlugin) miniCssExtractPlugin.options.ignoreOrder = true;

    // Retire eslint-loader s’il traîne
    config.module.rules = config.module.rules.filter((rule) => {
      if (!rule.use) return true;
      if (Array.isArray(rule.use))
        return !rule.use.some(
          (u) => u.loader && u.loader.includes('eslint-loader'),
        );
      if (
        typeof rule.use === 'object' &&
        rule.use.loader &&
        rule.use.loader.includes('eslint-loader')
      )
        return false;
      if (typeof rule.use === 'string' && rule.use.includes('eslint-loader'))
        return false;
      return true;
    });

    config.plugins = config.plugins.filter((plugin) => {
      const pluginName = plugin.constructor && plugin.constructor.name;
      return !(pluginName && pluginName.includes('ESLint'));
    });

    actions.replaceWebpackConfig(config);
  }
};

// Importation des produits Printful
exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
  reporter,
}) => {
  const { createNode } = actions;

  try {
    reporter.info('🛒 Récupération des produits depuis Printful…');
    let allProducts = [];
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(
        `https://api.printful.com/sync/products?page=${currentPage}&limit=100`,
        {
          headers: { Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}` },
        },
      );

      if (!response.ok)
        throw new Error(
          `❌ Erreur API Printful: ${response.status} ${response.statusText}`,
        );
      const data = await response.json();
      allProducts = allProducts.concat(data.result);
      hasMore = data.paging.offset + data.paging.limit < data.paging.total;
      currentPage++;
    }

    reporter.info(`✅ ${allProducts.length} produits trouvés.`);

    for (const product of allProducts) {
      const detailsResponse = await fetch(
        `https://api.printful.com/sync/products/${product.id}`,
        {
          headers: { Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}` },
        },
      );

      if (!detailsResponse.ok) {
        reporter.warn(
          `❌ Erreur récupération produit ${product.id}: ${detailsResponse.status} ${detailsResponse.statusText}`,
        );
        continue;
      }

      const detailsData = await detailsResponse.json();
      const productDetails = detailsData.result.sync_product;
      const variants = detailsData.result.sync_variants || [];
      const baseProductId =
        variants.length > 0 ? variants[0].product.variant_id : null;

      let sizeGuide = null;
      if (baseProductId) {
        try {
          const sizeResponse = await fetch(
            `https://api.printful.com/products/${baseProductId}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
              },
            },
          );
          if (sizeResponse.ok) {
            const sizeData = await sizeResponse.json();
            sizeGuide = sizeData.result.product.dimensions || null;
          }
        } catch (error) {
          reporter.warn(
            `❌ Erreur récupération guide des tailles pour ${product.id}: ${error?.message}`,
          );
        }
      }

      // Normalise le slug
      const slug = (product.name || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      createNode({
        id: createNodeId(`printful-product-${product.id}`),
        name: product.name,
        slug,
        description:
          productDetails?.description || 'Aucune description disponible.',
        thumbnail_url: product.thumbnail_url,
        sync_variants: variants,
        size_guide: sizeGuide,
        parent: null,
        children: [],
        internal: {
          type: 'PrintfulProduct',
          contentDigest: createContentDigest(productDetails || {}),
        },
      });
    }
    reporter.info('✅ Importation réussie !');
  } catch (error) {
    reporter.panicOnBuild('❌ Erreur globale Printful:', error);
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`
    type PrintfulProduct implements Node {
      id: ID!
      name: String!
      slug: String!
      description: String
      thumbnail_url: String
      sync_variants: [SyncVariant]
      size_guide: [SizeGuide]
    }

    type SyncVariant {
      id: String
      name: String
      retail_price: String
      currency: String
      files: [SyncFile]
    }

    type SyncFile {
      filename: String
      preview_url: String
    }

    type SizeGuide {
      size: String
      chest: String
      length: String
    }
  `);
};
