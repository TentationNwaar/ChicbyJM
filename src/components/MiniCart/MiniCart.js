import React, { useContext, useEffect } from 'react';
import { Link } from 'gatsby';
import { createPortal } from 'react-dom';
import { CartContext } from '../../context/CartContext';
import * as styles from './MiniCart.module.css';

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
    try { mql.addEventListener('change', onChange); } catch { mql.addListener(onChange); }
    return () => {
      try { mql.removeEventListener('change', onChange); } catch { mql.removeListener(onChange); }
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
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={styles.mobileBackdrop} onClick={onClose} aria-hidden="true" />
      <aside className={styles.mobilePanel} role="dialog" aria-modal="true" aria-label="Panier">
        {children}
      </aside>
    </>,
    document.body
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

  const Content = (
    <div className={styles.miniCart}>
      <button className={styles.closeButton} onClick={closeCart} aria-label="Fermer">×</button>
      <p className={styles.cartTitle}>Mon Panier</p>

      {cart.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <ul className={styles.cartItems}>
          {cart.map((item, index) => (
            <li key={index} className={styles.itemRow}>
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.thumb}   // ⚠️ taille gérée en CSS
                  loading="lazy"
                />
              ) : (
                <div className={styles.thumbPlaceholder} />
              )}

              <div className={styles.meta}>
                <p className={styles.name}>{item.name}</p>
                <p className={styles.attrs}>
                  {(item.color || 'Non précisé')}
                  {item.size ? ` • ${item.size}` : ''}
                  {` • x${item.quantity || 1}`}
                </p>
              </div>

              <div className={styles.price}>
                CHF {lineTotal(item).toFixed(2)}
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
