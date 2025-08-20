import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import * as styles from './ProductCard.module.css';

import CurrencyFormatter from '../CurrencyFormatter';
import { toOptimizedImage } from '../../helpers/general';
import { supabase } from '../../lib/supabaseClient';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const ProductCard = (props) => {
  const [isWishlist, setIsWishlist] = useState(false);

  const {
    image,
    imageAlt,
    name,
    price,
    originalPrice,
    meta,
    showQuickView,
    height = 280,
    productId,
    link, // IMPORTANT: ce lien doit être correct (/en/product/${slug}/)
  } = props;

  const handleFavorite = async (e) => {
    e.stopPropagation();

    try {
      const rawUser = localStorage.getItem('user');
      if (!rawUser || !productId) return;

      const user = JSON.parse(rawUser);

      // 1) Check if already in favorites (return id only, safer + faster)
      const { data: existing, error: selectError } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (selectError) {
        console.error('Erreur vérification favori :', selectError);
        return;
      }

      if (existing) {
        // 2) Remove by primary key id
        const { error: deleteError } = await supabase
          .from('favorites')
          .delete()
          .eq('id', existing.id);

        if (deleteError) {
          console.error('Erreur suppression favori :', deleteError);
          return;
        }

        setIsWishlist(false);
        return;
      }

      // 3) Insert new favorite if none exists
      const { error: insertError } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          product_id: productId,
        });

      if (insertError) {
        console.error("Erreur ajout favori :", insertError);
        return;
      }

      setIsWishlist(true);
    } catch (err) {
      console.error('handleFavorite exception :', err);
    }
  };

  const handleRouteToProduct = () => {
    if (!link) {
      console.warn('❌ ProductCard: link manquant, navigation annulée');
      return;
    }
    navigate(link);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    if (showQuickView) {
      showQuickView();
    }
  };

  useEffect(() => {
    const checkFavorite = async () => {
      const rawUser = localStorage.getItem('user');
      if (!rawUser || !productId) return;

      const user = JSON.parse(rawUser);

      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (error) {
        console.warn('checkFavorite warning:', error);
      }

      if (data) {
        setIsWishlist(true);
      }
    };

    checkFavorite();
  }, [productId]);

  return (
    <div className={styles.productGrid}>
      <div className={styles.root}>
        <div
          className={styles.imageContainer}
          onClick={handleRouteToProduct}
          role="presentation"
        >
          {!link && (
            <div
              style={{
                position: 'absolute',
                top: 8,
                left: 8,
                background: '#000',
                color: '#fff',
                padding: '2px 6px',
                fontSize: 12,
                zIndex: 9999,
              }}
            >
              no link
            </div>
          )}

          <img
            className={styles.imageMax}
            width={300}
            height={300}
            src={toOptimizedImage(image)}
            alt={imageAlt}
          />


          {/* ❤️ Icône cœur */}
          <div
            onClick={handleFavorite}
            className={styles.favoriteIcon}
          >
            {isWishlist ? <FaHeart /> : <FaRegHeart />}
          </div>
        </div>

        <div className={styles.detailsContainer}>
          <div>
            <span className={styles.productName} data-el="title">{name}</span>
          </div>

          <div>
            {price && (
              <span className={styles.prices} data-el="price">
                <CurrencyFormatter amount={price} />
              </span>
            )}
          </div>

          {originalPrice && (
            <span className={styles.originalPrice}>
              <CurrencyFormatter amount={originalPrice} />
            </span>
          )}

          {meta ? <span className={styles.meta}>{meta}</span> : null}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;