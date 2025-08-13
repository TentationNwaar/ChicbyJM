import React, { useEffect, useState } from 'react';
import { navigate, graphql, useStaticQuery } from 'gatsby';
import * as styles from './favorites.module.css';
import Button from '../../components/Button';
import Container from '../../components/Container';
import Layout from '../../components/Layout/Layout';
import Modal from '../../components/Modal';
import { supabase } from '../../lib/supabaseClient';

const BASE_PRODUCT_PATH = '/en/product'; // doit matcher gatsby-node.js

// /en/product/<slug>/
const buildProductPath = (product) => {
  const raw = product?.slug?.trim();
  if (!raw) return null;
  return `${BASE_PRODUCT_PATH}/${raw.replace(/^\/+|\/+$/g, '')}/`;
};

// Vérifie si le page-data existe réellement (évite DevLoader)
const checkPageExists = async (path) => {
  try {
    const pageDataPath = `/page-data${path.replace(/\/$/, '')}/page-data.json`;
    const res = await fetch(pageDataPath, { method: 'GET', credentials: 'same-origin' });
    return res.ok;
  } catch {
    return false;
  }
};

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  const data = useStaticQuery(graphql`
    query AllProductsForFavorites {
      allPrintfulProduct {
        nodes {
          id
          name
          slug
          thumbnail_url
          sync_variants { id name retail_price }
        }
      }
    }
  `);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const {
          data: { user },
          error: userError
        } = await supabase.auth.getUser();

        if (userError || !user) {
          navigate('/login');
          return;
        }

        const { data: favoriteData, error } = await supabase
          .from('favorites')
          .select('id, product_id, image_url, color, size')
          .eq('user_id', user.id);

        if (error || !favoriteData) return;

        const productMap = new Map();
        data.allPrintfulProduct.nodes.forEach((p) => productMap.set(p.id, p));

        // Enrichir + calculer le path
        const enriched = favoriteData
          .map((fav) => {
            const product = productMap.get(fav.product_id);
            if (!product) return null;
            const path = buildProductPath(product);
            return {
              id: fav.id,
              product,
              image_url: fav.image_url,
              color: fav.color,
              size: fav.size,
              path,
            };
          })
          .filter(Boolean);

        // Ne garder que les favoris dont la page existe
        const validated = [];
        for (const item of enriched) {
          if (!item.path) continue;
          const exists = await checkPageExists(item.path);
          if (exists) validated.push(item);
        }

        setFavorites(validated);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [data, navigate]);

  const validFavorites = favorites.filter(f => f?.product?.slug && f?.path);

  return (
    <Layout>
      <div className={styles.root}>
        <Container size="large">
          <h1>Favoris</h1>

          {loading ? (
            <div className={styles.noFavoriteContainer}>
              <p className={styles.noFavoriteText}>En cours de chargement...</p>
            </div>
          ) : validFavorites.length > 0 ? (
            <ul className={styles.imageGrid}>
              {validFavorites.map(({ id, product, image_url, path }) => {
                const variant = Array.isArray(product?.sync_variants)
                  ? product.sync_variants[0]
                  : null;

                const displayImage = image_url || product?.thumbnail_url || '';

                return (
                  <li
                    key={id}
                    className={styles.card}
                    onClick={() => window.location.assign(path)} // nav “hard” (pas de DevLoader)
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') window.location.assign(path); }}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={displayImage}
                      alt={product?.name || 'Produit'}
                      className={styles.productImage}
                      loading="lazy"
                    />
                    <h2 className={styles.cardTitle}>{product?.name || 'Produit'}</h2>
                    <span className={styles.productPrice}>
                      {variant?.retail_price || '—'} CHF
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className={styles.noFavoriteContainer}>
              <p className={styles.noFavoriteText}>Aucun favori pour le moment.</p>
            </div>
          )}
        </Container>
      </div>

      <Modal visible={showDelete} close={() => setShowDelete(false)}>
        <div className={styles.confirmDeleteContainer}>
          <h4>Remove from Favorites?</h4>
          <p>Are you sure you want to remove this from your favorites?</p>
          <div className={styles.actionContainer}>
            <Button onClick={() => setShowDelete(false)} level="primary">Delete</Button>
            <Button onClick={() => setShowDelete(false)} level="secondary">Cancel</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default FavoritesPage;