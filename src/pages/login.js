import React, { useState } from 'react';
import { Link, navigate } from 'gatsby';
import { validateEmail, isEmpty } from '../helpers/general';
import * as styles from './login.module.css';

import AttributeGrid from '../components/AttributeGrid/AttributeGrid';
import Layout from '../components/Layout/Layout';
import FormInputField from '../components/FormInputField/FormInputField';
import Button from '../components/Button';

const LoginPage = (props) => {
  const initialState = {
    email: '',
    password: '',
  };

  const errorState = {
    email: '',
    password: '',
  };

  const [loginForm, setLoginForm] = useState(initialState);
  const [errorForm, setErrorForm] = useState(errorState);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (id, e) => {
    const tempForm = { ...loginForm, [id]: e };
    setLoginForm(tempForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validForm = true;
    const tempError = { ...errorForm };

    if (validateEmail(loginForm.email) !== true) {
      tempError.email =
        'Veuillez utiliser une adresse e-mail valide, comme user@example.com.';
      validForm = false;
    } else {
      tempError.email = '';
    }

    if (isEmpty(loginForm.password) === true) {
      tempError.password = 'Champ requis';
      validForm = false;
    } else {
      tempError.password = '';
    }

    if (validForm === true) {
      setErrorForm(errorState);

      // Connexion simulée
      if (loginForm.email !== 'error@example.com') {
        navigate('/account');
        window.localStorage.setItem('key', 'sampleToken');
      } else {
        window.scrollTo(0, 0);
        setErrorMessage(
          'Aucun compte n\'est associé à cette adresse e-mail'
        );
      }
    } else {
      setErrorMessage('');
      setErrorForm(tempError);
    }
  };

  return (
    <Layout disablePaddingBottom={true}>
      <div
        className={`${styles.errorContainer} ${
          errorMessage !== '' ? styles.show : ''
        }`}
      >
        <span className={styles.errorMessage}>{errorMessage}</span>
      </div>

      <div className={styles.root}>
        <div className={styles.loginFormContainer}>
          <h1 className={styles.loginTitle}>Connexion</h1>
          <span className={styles.subtitle}>
            Veuillez entrer votre e-mail et votre mot de passe
          </span>
          <form
            noValidate
            className={styles.loginForm}
            onSubmit={(e) => handleSubmit(e)}
          >
            <FormInputField
              id={'email'}
              value={loginForm.email}
              handleChange={(id, e) => handleChange(id, e)}
              type={'email'}
              labelName={'E-mail'}
              error={errorForm.email}
            />

            <FormInputField
              id={'password'}
              value={loginForm.password}
              handleChange={(id, e) => handleChange(id, e)}
              type={'password'}
              labelName={'Mot de passe'}
              error={errorForm.password}
            />
            <div className={styles.forgotPasswordContainer}>
              <Link to={'/forgot'} className={styles.forgotLink}>
                Mot de passe oublié
              </Link>
            </div>

            <Button fullWidth type={'submit'} level={'primary'}>
              SE CONNECTER
            </Button>
            <span className={styles.createLink}>Nouveau client ? </span>
            <Button
              type={'button'}
              onClick={() => navigate('/signup')}
              fullWidth
              level={'secondary'}
            >
              créer un compte
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