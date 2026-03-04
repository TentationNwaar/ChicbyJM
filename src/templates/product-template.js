import React, { useState, useEffect, useContext } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import { CartContext } from '../context/CartContext';
import './product-template.css';
import { supabase } from '../lib/supabaseClient';
import ProductReviews from '../components/ProductReviews';

function parseVariantName(fullName) {
  const result = { color: '', size: '' };
  if (!fullName) return result;

  const parts = fullName.split('/').map((part) => part.trim());

  if (parts.length === 2) {
    result.size = parts[1];
  } else if (parts.length >= 3) {
    result.color = parts[1];
    result.size = parts[2];
  }

  return result;
}

function getProductImage(product, variant) {
  if (!variant || !variant.files || variant.files.length === 0) {
    return product.thumbnail_url;
  }

  const validImage = variant.files.find((file) => {
    const filename = file.filename?.toLowerCase() || '';
    return (
      file.preview_url &&
      filename.includes('front') &&
      !filename.includes('logo') &&
      !filename.includes('preview-file')
    );
  });

  return validImage?.preview_url || product.thumbnail_url;
}

const ProductTemplate = ({ data }) => {
  if (!data || !data.printfulProduct) {
    return <div>Produit non trouvé</div>;
  }

  const product = data.printfulProduct;
  const variants = product.sync_variants || [];

  const isBrowser = typeof window !== 'undefined';
  const cartContext = isBrowser ? useContext(CartContext) : null;
  const addToCart = cartContext ? cartContext.addToCart : null;

  const extractedVariants = variants.map((variant) =>
    parseVariantName(variant.name),
  );
  const availableColors = Array.from(
    new Set(extractedVariants.map((variant) => variant.color).filter(Boolean)),
  );
  const availableSizes = Array.from(
    new Set(extractedVariants.map((variant) => variant.size).filter(Boolean)),
  );

  const [selectedColor, setSelectedColor] = useState(
    () => availableColors[0] || null,
  );
  const [selectedSize, setSelectedSize] = useState(
    () => availableSizes[0] || null,
  );
  const [selectedImage, setSelectedImage] = useState(product.thumbnail_url);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [toast, setToast] = useState(null);
  const [lightboxSrc, setLightboxSrc] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!selectedColor || !selectedSize) {
      setSelectedImage(product.thumbnail_url);
      return;
    }

    const matchingVariant = variants.find((variant) => {
      const parsed = parseVariantName(variant.name);
      return (
        parsed.color?.toLowerCase() === selectedColor.toLowerCase() &&
        parsed.size?.toLowerCase() === selectedSize.toLowerCase()
      );
    });

    let image = product.thumbnail_url;

    if (matchingVariant?.files?.length) {
      const validImage = matchingVariant.files.find((file) => {
        const filename = file.filename?.toLowerCase() || '';
        return (
          file.preview_url &&
          filename.includes('front') &&
          !filename.includes('logo') &&
          !filename.includes('preview-file')
        );
      });

      if (
        validImage?.preview_url &&
        validImage.preview_url !== product.thumbnail_url
      ) {
        image = validImage.preview_url;
      }
    }

    setSelectedImage(image);
  }, [selectedColor, selectedSize, variants, product]);

  const handleAddToCart = () => {
    if (!addToCart) {
      console.warn('addToCart indisponible (SSR/hydration)');
      return;
    }
    const selectedVariant = variants.find((variant) => {
      const variantName = parseVariantName(variant.name);
      return (
        (!selectedColor || variantName.color === selectedColor) &&
        (!selectedSize || variantName.size === selectedSize)
      );
    });

    const variant = selectedVariant || variants[0];

    addToCart({
      product_id: product.id,
      sync_variant_id: Number(variant.id),
      id: String(variant.id),
      name: product.name,
      color: selectedColor || 'Non précisé',
      size: selectedSize || 'Non précisé',
      price: parseFloat(variant.retail_price) || 0,
      currency: variant.currency || 'CHF',
      image: getProductImage(product, variant),
      quantity: 1,
    });

    alert('Produit ajouté au panier !');
  };

  const handleAddToFavorites = async () => {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) {
      setToast({
        type: 'error',
        text: 'Connecte-toi pour ajouter aux favoris.',
      });
      return;
    }
    const user = JSON.parse(rawUser);

    const selectedVariant =
      variants.find((v) => {
        const parsed = parseVariantName(v.name);
        return (
          (!selectedColor ||
            parsed.color?.toLowerCase() === selectedColor?.toLowerCase()) &&
          (!selectedSize ||
            parsed.size?.toLowerCase() === selectedSize?.toLowerCase())
        );
      }) || variants[0];

    const payload = {
      user_id: user.id,
      product_id: product.id,
      variant_id: selectedVariant?.id?.toString() || null,
      color: selectedColor || null,
      size: selectedSize || null,
      image_url: selectedImage || product.thumbnail_url,
    };

    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .maybeSingle();

    if (existing?.id) {
      const { error: delErr } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);
      if (delErr) {
        console.error(delErr);
        setToast({
          type: 'error',
          text: 'Erreur lors du retrait des favoris.',
        });
        return;
      }
      setIsFavorite(false);
      setToast({ type: 'ok', text: 'Retiré des favoris.' });
      return;
    }

    const { error } = await supabase.from('favorites').insert(payload);
    if (error) {
      console.error(error);
      setToast({ type: 'error', text: 'Erreur lors de l’ajout aux favoris.' });
      return;
    }
    setIsFavorite(true);
    setToast({ type: 'ok', text: 'Ajouté aux favoris !' });
  };

  useEffect(() => {
    const checkIfFavorite = async () => {
      const rawUser = localStorage.getItem('user');
      if (!rawUser) return;

      const user = JSON.parse(rawUser);

      const { data } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .maybeSingle();

      if (data) {
        setIsFavorite(true);
      }
    };

    checkIfFavorite();
  }, [product.id]);

  return (
    <Layout>
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#b59f66',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 25,
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            fontWeight: 'bold',
            zIndex: 9999,
          }}
        >
          {toast.text}
        </div>
      )}
      <div className="product-container">
        <div className="product-images-container no-save">
          <img
            src={selectedImage}
            alt="Image principale du produit"
            className="main-product-image"
            style={{ width: '500px', height: '500px', objectFit: 'cover' }}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onClick={() => setLightboxSrc(selectedImage)}
          />
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name.split('/')[0]}</h1>
          <p className="product-price">
            {variants[0]?.retail_price || 'N/A'} CHF
          </p>
          <p className="tax-info">Taxes incluses.</p>

          {availableColors.length > 0 && (
            <div className="color-selection">
              <p>
                <strong>Couleur</strong>
              </p>
              <div className="color-buttons">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`color-button ${color === selectedColor ? 'selected' : ''}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {availableSizes.length > 0 && (
            <div className="size-selection">
              <p>
                <strong>Taille</strong>
              </p>
              <div className="size-buttons">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`size-button ${size === selectedSize ? 'selected' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="product-actions">
            <button className="add-to-cart" onClick={handleAddToCart}>
              Ajouter au panier
            </button>
            <button
              className="description-button"
              onClick={() => setIsDescriptionOpen(true)}
            >
              Description
            </button>
            <button
              className="description-button"
              onClick={handleAddToFavorites}
            >
              {isFavorite ? 'Ajouté aux favoris ❤️' : 'Ajouter aux favoris'}
            </button>
          </div>

          {/* BLOC RÉASSURANCE SUISSE */}
          <div
            className="swiss-assurance"
            style={{
              marginTop: '25px',
              padding: '15px',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              backgroundColor: '#fcfcfc',
              maxWidth: '100%',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '0.95rem',
                color: '#b59f66',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ marginRight: '8px' }}>🇨🇭</span> Prix final garanti
              sans surprise
            </p>
            <p
              style={{
                margin: '8px 0 0',
                fontSize: '0.82rem',
                color: '#666',
                lineHeight: '1.4',
              }}
            >
              Nous prenons en charge les éventuels frais de douane. Le montant
              affiché est le seul que vous paierez. Expédié depuis l'Europe.
            </p>
          </div>
        </div>
      </div>

      <section className="reviews-section">
        <ProductReviews productId={String(product.id)} />
      </section>

      {isDescriptionOpen && (
        <div
          className={`description-overlay ${isDescriptionOpen ? 'open' : ''}`}
        >
          <div className="description-panel">
            <button
              className="close-description"
              onClick={() => setIsDescriptionOpen(false)}
            >
              ×
            </button>
            <h2>Description</h2>
            <p>{product.description}</p>

            {product.size_guide && product.size_guide.length > 0 && (
              <div className="size-guide">
                <h3>Guide des tailles</h3>
                <table>
                  <thead>
                    <tr>
                      {Object.keys(product.size_guide[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {product.size_guide.map((size, index) => (
                      <tr key={index}>
                        {Object.values(size).map((value, i) => (
                          <td key={i}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      {lightboxSrc && (
        <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}>
          <button
            className="lightbox-close"
            aria-label="Fermer l'image"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxSrc(null);
            }}
          >
            ✕
          </button>
          <img
            className="lightbox-img"
            src={lightboxSrc}
            alt=""
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      )}
    </Layout>
  );
};

export const Head = ({ data, location }) => {
  const product = data.printfulProduct;
  const siteUrl = data?.site?.siteMetadata?.siteUrl || 'https://www.chicbyjm.ch';
  const pathname = location?.pathname || '';
  const canonical = `${siteUrl}${pathname}`;

  const description = (product.description || '')
    .toString()
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 155);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [product.thumbnail_url].filter(Boolean),
    description,
    brand: {
      '@type': 'Brand',
      name: 'Chic by JM',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CHF',
      price: product.sync_variants?.[0]?.retail_price || '0',
      availability: 'https://schema.org/InStock',
      url: canonical,
    },
  };

  return (
    <>
      <title>{product.name} | Chic by JM</title>

      <link rel="canonical" href={canonical} />

      <meta name="description" content={description} />

      <meta property="og:title" content={product.name} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={product.thumbnail_url} />
      <meta property="og:url" content={canonical} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
};

export const query = graphql`
  query ($id: String!) {
    site {
      siteMetadata {
        siteUrl
      }
    }
    printfulProduct(id: { eq: $id }) {
      id
      name
      description
      thumbnail_url
      sync_variants {
        id
        name
        retail_price
        currency
        files {
          filename
          preview_url
        }
      }
      size_guide {
        size
        chest
        length
      }
    }
  }
`;

export default ProductTemplate;
