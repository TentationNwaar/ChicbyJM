import React, { useEffect, useState } from 'react';
import { navigate } from 'gatsby';
import * as styles from './favorites.module.css';

import Button from '../../components/Button';
import Breadcrumbs from '../../components/Breadcrumbs';
import Container from '../../components/Container';
import FavoriteCard from '../../components/FavoriteCard/FavoriteCard';
import Layout from '../../components/Layout/Layout';
import Modal from '../../components/Modal';

import { supabase } from '../../lib/supabaseClient';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('favorites')
        .select('id, product:product_id (id, name, slug, thumbnail_url, sync_variants)')
        .eq('user_id', user.id);

      if (!error) {
        setFavorites(data);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <Layout>
      <div className={styles.root}>
        <Container size="large">
          <h1>Favorites</h1>

          {favorites.length > 0 ? (
            <div className={styles.favoriteListContainer}>
              {favorites.map(({ id, product }) => {
                const variant = product?.sync_variants?.[0];
                return (
                  <FavoriteCard
                    key={id}
                    color={variant?.name || '—'}
                    size={'—'}
                    img={product?.thumbnail_url}
                    alt={product?.name}
                    productName={product?.name}
                    productSlug={product?.slug}
                    showConfirmDialog={() => setShowDelete(true)}
                  />
                );
              })}
            </div>
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