import React, { useContext, useEffect } from 'react';
import { Link, navigate, graphql, useStaticQuery } from 'gatsby';
import { createPortal } from 'react-dom';
import { CartContext } from '../../context/CartContext';
import * as styles from './MiniCart.module.css';

const PRODUCT_BASE_PATH = '/en/product';
// /en/product/<slug>/
const buildProductPathFromSlug = (slug) => {
  const raw = (slug || '').trim();
  if (!raw) return null;
  return `${PRODUCT_BASE_PATH}/${raw.replace(/^\/+|\/+$/g, '')}/`;
};

// Essaie d’obtenir un slug propre depuis l’item du panier
const extractSlugFromItem = (item) => {
  if (!item) return null;
  // 1) Slug / handle direct
  if (item.slug) return String(item.slug);
  if (item.handle) return String(item.handle);

  // 2) Depuis une URL / path déjà connus
  const urlLike = item.url || item.path || item.permalink;
  if (urlLike) {
    try {
      const raw = urlLike.startsWith('http')
        ? new URL(urlLike).pathname
        : urlLike;
      const parts = raw.split('/').filter(Boolean);
      // Cherche le segment après 'product' (ou 'products') en ignorant le prefixe langue
      const idx = parts.findIndex((p) => p === 'product' || p === 'products');
      if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
      // Sinon, tente le dernier segment si ça ressemble à un slug
      return parts[parts.length - 1] || null;
    } catch {
      // ignore
    }
  }

  // 3) Variante éventuelle
  if (item.variant?.product?.slug) return String(item.variant.product.slug);

  return null;
};

// Vérifie si la page Gatsby existe (évite DevLoader 404)
const checkPageExists = async (path) => {
  try {
    const pageDataPath = `/page-data${path.replace(/\/$/, '')}/page-data.json`;
    const res = await fetch(pageDataPath, {
      method: 'GET',
      credentials: 'same-origin',
    });
    return res.ok;
  } catch {
    return false;
  }
};

// ✅ Hook minimal pour détecter le mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(max-width: 800px)').matches;
  });
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(max-width: 800px)');
    const onChange = (e) => setIsMobile(e.matches);
    try {
      mql.addEventListener('change', onChange);
    } catch {
      mql.addListener(onChange);
    }
    return () => {
      try {
        mql.removeEventListener('change', onChange);
      } catch {
        mql.removeListener(onChange);
      }
    };
  }, []);
  return isMobile;
};

// ✅ Composant Mobile : gère le fond sombre + popup centrée via PORTAL
function MobilePanel({ children, onClose }) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose && onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div
        className={styles.mobileBackdrop}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={styles.mobilePanel}
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
      >
        {children}
      </aside>
    </>,
    document.body,
  );
}

function MiniCart({ isOpen, closeCart }) {
  const context = useContext(CartContext);
  if (!context) {
    if (typeof window === 'undefined') return null;
    throw new Error('CartContext must be used within a CartProvider');
  }
  const { cart } = context;

  // Totaux
  const lineTotal = (i) => (i.price || 0) * (i.quantity || 1);
  const subtotal = cart.reduce((sum, i) => sum + lineTotal(i), 0);

  const isMobile = useIsMobile();
  const LOCALES = ['en', 'fr', 'de', 'it', 'es'];

  // Charger les slugs produits comme sur la page Favoris
  const data = useStaticQuery(graphql`
    query MiniCartProductSlugs {
      allPrintfulProduct {
        nodes { id slug }
      }
    }
  `);

  const slugById = React.useMemo(() => {
    const map = new Map();
    const nodes = data?.allPrintfulProduct?.nodes || [];
    nodes.forEach((n) => {
      if (n?.id && n?.slug) map.set(String(n.id), String(n.slug));
    });
    return map;
  }, [data]);

  // Ex: '/en/product/...'  -> '/en' ; '/product/...' -> ''
  const getLocalePrefix = () => {
    if (typeof window === 'undefined') return '';
    const seg = window.location.pathname.split('/').filter(Boolean)[0];
    return LOCALES.includes(seg) ? `/${seg}` : '';
  };

  // Essaie d'extraire un slug propre depuis l'item
  const pickSlug = (item) => {
    if (!item) return null;

    // 1) Déjà fourni (meilleur cas)
    if (item.slug) return String(item.slug);
    if (item.handle) return String(item.handle);

    // 2) Depuis une URL/path connu
    const urlLike = item.url || item.path || item.permalink;
    if (urlLike) {
      try {
        // si absolu: new URL(...), sinon traite comme path
        const raw = urlLike.startsWith('http')
          ? new URL(urlLike).pathname
          : urlLike;
        const parts = raw.split('/').filter(Boolean);
        // On prend le dernier segment non-locale et non 'product'
        const candidates = parts.filter(
          (p) => !LOCALES.includes(p) && p !== 'product',
        );
        if (candidates.length) return candidates[candidates.length - 1];
      } catch (e) {
        // ignore
      }
    }

    // 3) Si un objet variant contient un slug
    if (item.variant?.product?.slug) return String(item.variant.product.slug);

    // 4) Pas de slug fiable
    return null;
  };

  // Construit l'URL finale
  const buildProductHref = (item) => {
    // URL absolue fournie: on la respecte
    if (item?.url && /^https?:\/\//i.test(item.url)) return item.url;

    if (item?.url && item.url.startsWith('/')) return item.url;
    if (item?.path && item.path.startsWith('/')) return item.path;
    if (item?.permalink && item.permalink.startsWith('/'))
      return item.permalink;

    const prefix = getLocalePrefix(); // ex. '/en' ou ''
    const base = `${prefix}${PRODUCT_BASE_PATH}`; // centralisé depuis la constante du haut
    const slug = pickSlug(item);

    if (slug) return `${base}/${encodeURIComponent(slug)}/`;

    // Sinon: on n'a pas de destination fiable
    return null;
  };

  // Navigation SPA Gatsby (ou fallback absolu)
  const goToProduct = (item) => {
    const href = buildProductHref(item);
    if (!href) return false;

    if (/^https?:\/\//i.test(href)) {
      window.location.assign(href);
    } else {
      navigate(href);
    }
    return true;
  };

  const handleItemClick = async (item) => {
    const slugDirect = extractSlugFromItem(item);
    let slug = slugDirect;
    if (!slug) {
      // Essayer via différents identifiants connus
      const candidates = [
        item?.id,
        item?.product_id,
        item?.productId,
        item?.printfulProductId,
        item?.variant?.product_id,
        item?.variant?.product?.id,
      ].filter(Boolean).map(String);

      for (const key of candidates) {
        const found = slugById.get(key);
        if (found) { slug = found; break; }
      }
    }

    if (!slug) {
      console.warn('MiniCart: aucun slug trouvé pour l\'item', item);
      return;
    }

    const path = buildProductPathFromSlug(slug);
    if (!path) return;

    const exists = await checkPageExists(path);
    if (exists) {
      window.location.assign(path);
    } else {
      navigate(path);
    }
    if (typeof closeCart === 'function') closeCart();
  };

  const Content = (
    <div className={styles.miniCart}>
      <button
        className={styles.closeButton}
        onClick={closeCart}
        aria-label="Fermer"
      >
        ×
      </button>
      <p className={styles.cartTitle}>Mon Panier</p>

      {cart.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <ul className={styles.cartItems}>
          {cart.map((item, index) => (
            <li
              key={index}
              className={styles.itemRow}
              role="button"
              tabIndex={0}
              onClick={() => {
                void handleItemClick(item);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void handleItemClick(item);
              }}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.thumb}
                  loading="lazy"
                />
              ) : (
                <div className={styles.thumbPlaceholder} />
              )}

              <div className={styles.meta}>
                <p className={styles.name}>{item.name}</p>
                <p className={styles.attrs}>
                  {item.color || 'Non précisé'}
                  {item.size ? ` • ${item.size}` : ''}
                  {` • x${item.quantity || 1}`}
                </p>
              </div>

              <div className={styles.price}>
                CHF {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Total unique en gras, au-dessus du bouton, aligné à gauche */}
      <div className={styles.grandTotal}>
        <strong>CHF {subtotal.toFixed(2)}</strong>
      </div>

      <div className={styles.cartActions}>
        <Link to="/cart" className={styles.checkoutButton} onClick={closeCart}>
          Voir le panier
        </Link>
      </div>
    </div>
  );

  // Mobile : overlay
  if (isMobile) {
    if (!isOpen) return null;
    return <MobilePanel onClose={closeCart}>{Content}</MobilePanel>;
  }

  // Desktop : inchangé
  return Content;
}

export default MiniCart;
