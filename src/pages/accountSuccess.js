import React from 'react';
import * as styles from './accountSuccess.module.css';

import ActionCard from '../components/ActionCard';
import Container from '../components/Container';
import Layout from '../components/Layout/Layout';

const AccountSuccessPage = (props) => {
  return (
    <Layout disablePaddingBottom>
      <Container size={'medium'}>
        <div className={styles.root}>
          <h1>Compte créé</h1>
          <p>
            Nous vous avons envoyé un lien de confirmation pour activer votre compte. Veuillez
            vérifier votre e-mail et le valider.
          </p>
          <div className={styles.actionContainer}>
            <ActionCard
              title={'Comptes'}
              icon={'user'}
              subtitle={'Vérifiez les paramètres de votre compte'}
              link={'/account/settings'}
            />

            <ActionCard
              title={'Boutique'}
              icon={'bag'}
              subtitle={'Continuer vos achats'}
              link={'/shop'}
            />
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export default AccountSuccessPage;