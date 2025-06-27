import React, { useState } from 'react';
import { Link, navigate } from 'gatsby';
import { validateEmail, isEmpty } from '../helpers/general';
import * as styles from './login.module.css';

import AttributeGrid from '../components/AttributeGrid/AttributeGrid';
import Layout from '../components/Layout/Layout';
import FormInputField from '../components/FormInputField/FormInputField';
import Button from '../components/Button';
import { supabase } from '../lib/supabaseClient';

const LoginPage = () => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [errorForm, setErrorForm] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (id, e) => {
    setLoginForm({ ...loginForm, [id]: e });
  };

  const loginUser = async () => {
    const { email, password } = loginForm;
  
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      const errorTranslations = {
        "Invalid login credentials": "Adresse e-mail ou mot de passe incorrect.",
        "Email not confirmed": "Veuillez confirmer votre e-mail avant de vous connecter.",
      };

      const translatedMessage = errorTranslations[error.message] || "Une erreur est survenue. Veuillez réessayer.";
      setErrorMessage(translatedMessage);
      return;
    }
  
    if (data?.user) {
      localStorage.setItem('user', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
      }));
    }
  
    if (!data.user.confirmed_at) {
      setErrorMessage('Veuillez confirmer votre e-mail avant de vous connecter.');
      return;
    }
  
    localStorage.setItem('user', JSON.stringify({
      id: user.id,
      email: user.email,
      // ou tout autre champ utile
    }));


    localStorage.setItem('access_token', data.session.access_token);
  
    // 👇 This is the key line to add:
    console.log('✅ Login success, redirecting to /account');
    setTimeout(() => {
      console.log('✅ Redirection vers /account après délai');
      window.location.href = '/account';
    }, 500);
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