import React, { useState } from 'react';
import * as styles from './AddressForm.module.css';

import Button from '../Button';
import FormInputField from '../FormInputField';

const AddressForm = (props) => {
  const { closeForm, addAddress } = props;  // Ajoutez la fonction addAddress

  const initialState = {
    name: '',
    address: '',
    state: '',
    postal: '',
    country: '',
    company: '',
  };

  const errorState = {
    name: '',
    address: '',
    state: '',
    postal: '',
    country: '',
    company: '',
  };

  const [form, setForm] = useState(initialState);
  const [errorForm, setErrorForm] = useState(errorState);

  const handleChange = (id, e) => {
    const tempForm = { ...form, [id]: e };
    setForm(tempForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorForm(errorState);
    addAddress(form);  // Ajoutez l'adresse au parent
    closeForm();
  };

  return (
    <div className={styles.root}>
      <form className={styles.inputContainer} onSubmit={(e) => handleSubmit(e)}>
        <FormInputField
          id={'name'}
          value={form.name}
          handleChange={(id, e) => handleChange(id, e)}
          type={'input'}
          labelName={'Nom'}
          error={errorForm.name}
        />
        <FormInputField
          id={'address'}
          value={form.address}
          handleChange={(id, e) => handleChange(id, e)}
          type={'input'}
          labelName={'Adresse'}
          error={errorForm.address}
        />
        <FormInputField
          id={'country'}
          value={form.country}
          handleChange={(id, e) => handleChange(id, e)}
          type={'input'}
          labelName={'Pays'}
          error={errorForm.country}
        />
        <FormInputField
          id={'state'}
          value={form.state}
          handleChange={(id, e) => handleChange(id, e)}
          type={'input'}
          labelName={'État'}
          error={errorForm.state}
        />
        <FormInputField
          id={'postal'}
          value={form.postal}
          handleChange={(id, e) => handleChange(id, e)}
          type={'number'}
          labelName={'Code postal'}
          error={errorForm.postal}
        />
        <FormInputField
          id={'address'}
          value={form.address}
          handleChange={(id, e) => handleChange(id, e)}
          type={'input'}
          labelName={'Rue'}
          error={errorForm.address}
        />
        <div className={styles.actionContainers}>
          <Button fullWidth type={'submit'} level={'primary'}>
            Sauvegarder
          </Button>
          <Button
            fullWidth
            type={'button'}
            onClick={closeForm}
            level={'secondary'}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;