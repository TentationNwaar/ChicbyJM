import React, { useState } from 'react';
import { navigate } from 'gatsby';
import * as styles from './settings.module.css';

import AccountLayout from '../../components/AccountLayout';
import Button from '../../components/Button';
import Breadcrumbs from '../../components/Breadcrumbs';
import FormInputField from '../../components/FormInputField';
import Layout from '../../components/Layout/Layout';

import {
  validateEmail,
  validateStrongPassword,
  isAuth,
} from '../../helpers/general';

const SettingsPage = (props) => {
  if (isAuth() === false) {
    navigate('/login');
  }

  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const errorState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const [updateForm, setUpdateForm] = useState(initialState);
  const [error, setError] = useState(errorState);

  const handleChange = (id, e) => {
    const tempForm = { ...updateForm, [id]: e };
    setUpdateForm(tempForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validForm = true;
    const tempError = { ...errorState };

    if (updateForm.email !== '') {
      if (validateEmail(updateForm.email) !== true) {
        validForm = false;
        tempError.email =
          'Veuillez utiliser une adresse e-mail valide, telle que utilisateur@exemple.com.';
      }
    }

    if (updateForm.password !== '') {
      if (validateStrongPassword(updateForm.password) === false) {
        validForm = false;
        tempError.password =
          'Le mot de passe doit contenir au moins 8 caractères, 1 minuscule, 1 majuscule et 1 caractère numérique.';
      }

      if (updateForm.password !== updateForm.confirmPassword) {
        validForm = false;
        tempError.confirmPassword = 'Les mots de passe ne correspondent pas.';
      }
    }

    if (validForm === true) {
      //success
      setError(errorState);
      setUpdateForm(initialState);
    } else {
      setError(tempError);
    }
  };

  return (
    <Layout>
      <AccountLayout>
        <Breadcrumbs
          crumbs={[
            { link: '/', label: 'Accueil' },
            { link: '/account', label: 'Compte' },
            { link: '/account/settings', label: 'Paramètres' },
          ]}
        />
        <h1>Paramètres</h1>
        <div>
          <form onSubmit={(e) => handleSubmit(e)} noValidate>
            <div className={styles.nameSection}>
              <FormInputField
                id={'firstName'}
                value={updateForm.firstName}
                handleChange={(id, e) => handleChange(id, e)}
                type={'input'}
                labelName={'Prénom'}
              />
              <FormInputField
                id={'lastName'}
                value={updateForm.lastName}
                handleChange={(id, e) => handleChange(id, e)}
                type={'input'}
                labelName={'Nom'}
              />
              <FormInputField
                id={'email'}
                value={updateForm.email}
                handleChange={(id, e) => handleChange(id, e)}
                type={'email'}
                labelName={'E-mail'}
                error={error.email}
              />
            </div>
            <div className={styles.passwordContainer}>
              <h2>Changer le mot de passe</h2>
              <div className={styles.passwordSection}>
                <FormInputField
                  id={'password'}
                  value={updateForm.password}
                  handleChange={(id, e) => handleChange(id, e)}
                  type={'password'}
                  labelName={'Nouveau mot de passe'}
                  error={error.password}
                />
                <FormInputField
                  id={'confirmPassword'}
                  value={updateForm.confirmPassword}
                  handleChange={(id, e) => handleChange(id, e)}
                  type={'password'}
                  labelName={'Confirmer le mot de passe'}
                  error={error.confirmPassword}
                />
                <Button level={'primary'} type={'submit'}>
                  mettre à jour
                </Button>
              </div>
            </div>
          </form>
        </div>
      </AccountLayout>
    </Layout>
  );
};

export default SettingsPage;