import React, { useState } from 'react';
import { navigate } from 'gatsby';
import * as styles from './address.module.css';

import AccountLayout from '../../components/AccountLayout';
import AddressCard from '../../components/AddressCard';
import AddressForm from '../../components/AddressForm';
import Breadcrumbs from '../../components/Breadcrumbs';
import Icon from '../../components/Icons/Icon';
import Layout from '../../components/Layout/Layout';
import Modal from '../../components/Modal';

import { isAuth } from '../../helpers/general';
import Button from '../../components/Button';

const AddressPage = (props) => {
  const [addressList, setAddressList] = useState([]);  // Liste vide au départ
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);  // L'adresse à supprimer

  if (isAuth() === false) {
    navigate('/login');
  }

  const addAddress = (newAddress) => {
    setAddressList([...addressList, newAddress]);  // Ajoute la nouvelle adresse à la liste
  };

  const removeAddress = (address) => {
    setAddressList(addressList.filter(item => item !== address));  // Supprime l'adresse de la liste
  };

  return (
    <Layout>
      <AccountLayout>
        <Breadcrumbs
          crumbs={[
            { link: '/', label: 'Accueil' },
            { link: '/account', label: 'Mon compte' },
            { link: '/account/address', label: 'Adresses' },
          ]}
        />
        <h1>Adresses</h1>

        {showForm === false && (
          <div className={styles.addressListContainer}>
            {addressList.map((address, index) => {
              return (
                <AddressCard
                  key={index}  // Ajoutez une clé unique pour chaque adresse
                  showForm={() => setShowForm(true)}
                  showDeleteForm={() => {
                    setShowDelete(true);
                    setAddressToDelete(address);  // Définit l'adresse à supprimer
                  }}
                  removeAddress={removeAddress}  // Passe la fonction removeAddress à AddressCard
                  {...address}
                />
              );
            })}
            <div
              className={styles.addCard}
              role={'presentation'}
              onClick={() => setShowForm(true)}
            >
              <Icon symbol={'plus'}></Icon>
              <span>Nouvelle adresse</span>
            </div>
          </div>
        )}

        {showForm === true && (
          <AddressForm closeForm={() => setShowForm(false)} addAddress={addAddress} />
        )}
      </AccountLayout>

      {/* Modal de confirmation de suppression */}
      <Modal visible={showDelete} close={() => setShowDelete(false)}>
        <div className={styles.confirmDeleteContainer}>
          <h4>Supprimer l'adresse ?</h4>
          <p>
            Êtes-vous sûr de vouloir supprimer cette adresse ? Cette action ne
            peut pas être annulée une fois que vous avez appuyé sur <strong>'Supprimer'</strong>
          </p>
          <div className={styles.actionContainer}>
            <Button onClick={() => { removeAddress(addressToDelete); setShowDelete(false); }} level={'primary'}>
              Supprimer
            </Button>
            <Button onClick={() => setShowDelete(false)} level={'secondary'}>
              Annuler
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default AddressPage;