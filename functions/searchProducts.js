exports.handler = async (event) => {
  const query = event.queryStringParameters.q?.toLowerCase() || '';

  try {
    const response = await fetch('https://api.printful.com/sync/products', {
      headers: {
        Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`
      }
    });

    const { result } = await response.json();

    const filtered = result.filter(p =>
      p.name.toLowerCase().includes(query)
    );

    // 🧠 Ensuite : récupérer les détails complets pour chaque produit filtré
    const detailedProducts = await Promise.all(
      filtered.map(async (product) => {
        try {
          const res = await fetch(`https://api.printful.com/sync/products/${product.id}`, {
            headers: {
              Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`
            }
          });
          const { result } = await res.json();
          return {
            id: product.id,
            name: product.name,
            slug: product.name.toLowerCase().replace(/\s+/g, '-'),
            image: product.thumbnail_url,
            sync_variants: result.sync_variants
          };
        } catch (err) {
          console.error('Erreur lors du fetch détaillé du produit', product.id, err);
          return product; // fallback sans variantes
        }
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ products: detailedProducts })
    };

  } catch (error) {
    console.error('Erreur dans la Netlify Function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur serveur' })
    };
  }
};