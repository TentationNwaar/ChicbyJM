import React, { useState } from 'react';
import { Link, navigate } from 'gatsby';
import { validateEmail, isEmpty } from '../helpers/general';
import * as styles from './login.module.css';

import AttributeGrid from '../components/AttributeGrid/AttributeGrid';
import Layout from '../components/Layout/Layout';
import FormInputField from '../components/FormInputField/FormInputField';
import Button from '../components/Button';

const LoginPage = () => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [errorForm, setErrorForm] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (id, e) => {
    setLoginForm({ ...loginForm, [id]: e });
  };

  const loginUser = async () => {
    try {
      const response = await fetch('https://mon-api.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginForm.email, password: loginForm.password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erreur de connexion');

      localStorage.setItem('token', data.token);
      navigate('/account'); // Redirection vers l'espace client
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validForm = true;
    let tempError = { email: '', password: '' };

    if (!validateEmail(loginForm.email)) {
      tempError.email = 'Veuillez entrer un e-mail valide.';
      validForm = false;
    }

    if (isEmpty(loginForm.password)) {
      tempError.password = 'Champ requis';
      validForm = false;
    }

    if (validForm) {
      setErrorForm({ email: '', password: '' });
      loginUser(); // Appel API pour la connexion
    } else {
      setErrorForm(tempError);
      setErrorMessage('');
    }
  };

  return (
    <Layout disablePaddingBottom>
      {errorMessage && (
        <div className={`${styles.errorContainer} ${styles.show}`}>
          <span className={styles.errorMessage}>{errorMessage}</span>
        </div>
      )}

      <div className={styles.root}>
        <div className={styles.loginFormContainer}>
          <h1 className={styles.loginTitle}>Connexion</h1>
          <span className={styles.subtitle}>
            Veuillez entrer votre e-mail et votre mot de passe
          </span>
          <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
            <FormInputField
              id="email"
              value={loginForm.email}
              handleChange={handleChange}
              type="email"
              labelName="E-mail"
              error={errorForm.email}
            />

            <FormInputField
              id="password"
              value={loginForm.password}
              handleChange={handleChange}
              type="password"
              labelName="Mot de passe"
              error={errorForm.password}
            />

            <div className={styles.forgotPasswordContainer}>
              <Link to="/forgot" className={styles.forgotLink}>
                Mot de passe oublié ?
              </Link>
            </div>

            <Button fullWidth type="submit" level="primary">
              Se connecter
            </Button>

            <span className={styles.createLink}>Nouveau client ?</span>
            <Button onClick={() => navigate('/signup')} fullWidth level="secondary">
              Créer un compte
            </Button>
          </form>
        </div>

        <div className={styles.attributeGridContainer}>
          <AttributeGrid />
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;