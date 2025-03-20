import React, { useState } from 'react';
import { validateEmail } from '../helpers/general';
import * as styles from './forgot.module.css';

import Layout from '../components/Layout/Layout';
import FormInputField from '../components/FormInputField/FormInputField';
import Button from '../components/Button';
import AttributeGrid from '../components/AttributeGrid';

const ForgotPage = (props) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(email) !== true) {
      setError('Ce n\'est pas une adresse e-mail valide');
      return;
    }
    setEmail('');
    setError('');
  };

  return (
    <Layout disablePaddingBottom>
      <div className={styles.root}>
        <h1 className={styles.title}>Réinitialiser le mot de passe</h1>
        <p className={styles.message}>
          Remplissez votre e-mail ci-dessous pour demander un nouveau mot de
          passe. Un e-mail sera envoyé à l'adresse ci-dessous contenant un
          lien pour vérifier votre adresse e-mail.
        </p>
        <form
          className={styles.formContainer}
          noValidate
          onSubmit={(e) => handleSubmit(e)}
        >
          <FormInputField
            id={'email'}
            value={email}
            handleChange={(_, e) => setEmail(e)}
            type={'email'}
            labelName={'E-mail'}
            error={error}
          />
          <div className={styles.buttonContainer}>
            <Button fullWidth level={'primary'} type={'submit'}>
              réinitialiser le mot de passe
            </Button>
          </div>
        </form>
      </div>
      <div className={styles.gridContainer}>
        <AttributeGrid />
      </div>
    </Layout>
  );
};

export default ForgotPage;