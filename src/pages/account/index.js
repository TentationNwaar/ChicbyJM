// src/pages/account/index.js
import React, { useContext, useEffect, useState } from 'react';
import PrivateRoute from '../../components/PrivateRoute';
import Layout from '../../components/Layout/Layout';
import { UserContext } from '../../context/UserContext';
import { supabase } from '../../lib/supabaseClient';
import Button from '../../components/Button';
import * as styles from './accountDashboard.module.css';

const AccountDashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    address: '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchData = async () => {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setProfile({
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            address: profileData.address || '',
            email: user.email,
          });
        }

        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        setOrders(ordersData || []);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      first_name: profile.firstName,
      last_name: profile.lastName,
      address: profile.address,
    });
    setSaving(false);
    setSaved(!error);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  if (loading) return <Layout><p>Chargement...</p></Layout>;

  return (
    <PrivateRoute>
      <Layout>
        <div className={styles.container}>
          <h1 className={styles.heading}>Tableau de bord</h1>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Informations du compte</h2>
            <div className={styles.formGrid}>
              <label className={styles.label}>Prénom
                <input type="text" name="firstName" value={profile.firstName} onChange={handleChange} className={styles.input} />
              </label>
              <label className={styles.label}>Nom
                <input type="text" name="lastName" value={profile.lastName} onChange={handleChange} className={styles.input} />
              </label>
              <label className={styles.label}>Adresse
                <input type="text" name="address" value={profile.address} onChange={handleChange} className={styles.input} />
              </label>
              <label className={styles.label}>Email (non modifiable)
                <input type="email" value={profile.email} disabled className={styles.inputDisabled} />
              </label>
            </div>
            <div className={styles.buttonRow}>
              <Button onClick={handleSave} disabled={saving} level="primary">
                {saving ? 'Sauvegarde...' : saved ? 'Modifications enregistrées ✓' : 'Sauvegarder les modifications'}
              </Button>
              <Button onClick={handleLogout} level="secondary">
                Se déconnecter
              </Button>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Dernières commandes</h2>
            {orders.length === 0 ? (
              <p className={styles.noOrders}>Aucune commande trouvée.</p>
            ) : (
              <ul className={styles.orderList}>
                {orders.map((order) => (
                  <li key={order.id} className={styles.orderItem}>
                    <strong>Commande #{order.id}</strong> – {new Date(order.created_at).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </Layout>
    </PrivateRoute>
  );
};

export default AccountDashboard;