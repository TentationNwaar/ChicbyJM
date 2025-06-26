import React, { useState, useEffect } from 'react';
import { parse } from 'query-string';
import { Link } from 'gatsby';

import Layout from '../components/Layout/Layout';
import Container from '../components/Container/Container';
import Breadcrumbs from '../components/Breadcrumbs';
import * as styles from './shop.module.css'; // Réutilise le CSS de shop pour même style

const SearchPage = (props) => {
  const searchString = props.location?.search || '';
  const params = parse(searchString);
  const searchQuery = (params.q || '').toLowerCase();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/.netlify/functions/searchProducts?q=${searchQuery}`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery]);

  return (
    <Layout>
      <div className={styles.root}>
        <Container size="large" spacing="min">
          <Breadcrumbs
            crumbs={[
              { link: '/', label: 'Accueil' },
              { label: `Résultats de recherche pour « ${searchQuery} »` },
            ]}
          />

          <div className={styles.searchLabels}>
            <h4>Résultats de recherche pour « {searchQuery} »</h4>
            {!loading && <span>{products.length} article(s) trouvé(s)</span>}
          </div>

          {loading ? (
            <p>Chargement en cours...</p>
          ) : (
            <ul className={styles.imageGrid}>
              {products.map((product) => {
                const slug = product.slug || product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
                const price = product.price || (product.sync_variants?.[0]?.retail_price + ' CHF') || 'Prix non disponible';

                return (
                  <li key={product.id}>
                    <Link to={`/en/product/${slug}/`}>
                      <img
                        src={product.thumbnail_url || product.image}
                        alt={product.name}
                        style={{ width: '300px', height: 'auto' }}
                      />
                      <h2 style={{ 
                        fontSize: '22px', 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis' 
                      }}>
                        {product.name}
                      </h2>
                      <p className={styles.productPrice}>{price}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Container>
      </div>
    </Layout>
  );
};

export default SearchPage;