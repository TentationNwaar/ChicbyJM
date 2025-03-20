import React, { useEffect, useState } from 'react';
import * as styles from './orders.module.css';

import AccountLayout from '../../components/AccountLayout/AccountLayout';
import Breadcrumbs from '../../components/Breadcrumbs';
import Layout from '../../components/Layout/Layout';
import OrderItem from '../../components/OrderItem/OrderItem';
import { isAuth } from '../../helpers/general';
import { navigate } from 'gatsby';

// Simulons une fonction d'API pour récupérer les commandes
const fetchOrders = async (userId) => {
  // Remplacez cette logique par un vrai appel API
  // Exemple d'appel API pour récupérer les commandes de l'utilisateur
  // const response = await fetch(`/api/orders/${userId}`);
  // return await response.json();

  return []; // Retourner un tableau vide pour le moment, jusqu'à ce que vous ayez des données réelles
};

const OrderPage = (props) => {
  if (isAuth() === false) {
    navigate('/login');
  }

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Remplacer par la logique pour obtenir l'ID de l'utilisateur
    const userId = 'user123'; // Remplacez par un ID utilisateur réel
    const getOrders = async () => {
      const fetchedOrders = await fetchOrders(userId);
      setOrders(fetchedOrders);
    };

    getOrders();
  }, []);

  return (
    <Layout>
      <AccountLayout>
        <Breadcrumbs
          crumbs={[
            { link: '/', label: 'Accueil' },
            { link: '/account', label: 'Mon compte' },
            { link: '/account/orders/', label: 'Commandes' },
          ]}
        />
        <h1>Commandes</h1>
        <div className={`${styles.tableHeaderContainer} ${styles.gridStyle}`}>
          <span className={styles.tableHeader}>Commande #</span>
          <span className={styles.tableHeader}>Date de commande</span>
          <span className={styles.tableHeader}>Dernière mise à jour</span>
          <span className={styles.tableHeader}>Statut</span>
        </div>

        {/* Afficher dynamiquement les commandes */}
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderItem key={order.id} order={order} headerStyling={styles.gridStyle} />
          ))
        ) : (
          <p>Aucune commande trouvée.</p>
        )}
      </AccountLayout>
    </Layout>
  );
};

export default OrderPage;