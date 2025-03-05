import React, { useState } from 'react';
import Button from '../Button';
import FormInputField from '../FormInputField/FormInputField';

import * as styles from './Contact.module.css';

const Contact = (props) => {
  const initialState = {
    name: '',
    phone: '',
    email: '',
    comment: '',
  };

  const [contactForm, setContactForm] = useState(initialState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  const handleChange = (id, e) => {
    const tempForm = { ...contactForm, [id]: e };
    setContactForm(tempForm);
  };

  const validateForm = () => {
    const errors = {};
    if (!contactForm.name) errors.name = 'Le nom complet est requis';
    if (!contactForm.phone) errors.phone = 'Le numéro de téléphone est requis';
    if (!contactForm.email) {
      errors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(contactForm.email)) {
      errors.email = 'L\'email n\'est pas valide';
    }
    if (!contactForm.comment) errors.comment = 'Les commentaires/questions sont requis';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitted(true);
    setContactForm(initialState);
  };

  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <h4>Envoyez-nous un message</h4>
        <p>
          Notre équipe du service client est à votre disposition pour toutes vos demandes du lundi au vendredi,
          de 9h à 17h (heure normale de l'Est australien - AEDT).
        </p>
        <p>Nous avons hâte de vous lire.</p>
      </div>

      <div className={styles.section}>
        <h4>Téléphone</h4>
        <p>+1 424 280 4971</p>
        <p>Lundi à vendredi - de 9h à 17h AEDT</p>
      </div>

      <div className={styles.section}>
        <h4>Email</h4>
        <p>
          Vous pouvez nous contacter par email à customerservice@example.com
          ou via le formulaire ci-dessous :
        </p>
      </div>

      <div className={styles.contactContainer}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className={styles.contactForm}>
            <FormInputField
              id={'name'}
              value={contactForm.name}
              handleChange={(id, e) => handleChange(id, e)}
              type={'text'}
              labelName={'Nom complet'}
              required
              errorMessage={formErrors.name}
            />
            <FormInputField
              id={'phone'}
              value={contactForm.phone}
              handleChange={(id, e) => handleChange(id, e)}
              type={'number'}
              labelName={'Numéro de téléphone'}
              required
              errorMessage={formErrors.phone}
            />
            <FormInputField
              id={'email'}
              value={contactForm.email}
              handleChange={(id, e) => handleChange(id, e)}
              type={'email'}
              labelName={'Email'}
              required
              errorMessage={formErrors.email}
            />
            <div className={styles.commentInput}>
              <FormInputField
                id={'comment'}
                value={contactForm.comment}
                handleChange={(id, e) => handleChange(id, e)}
                type={'textarea'}
                labelName={'Commentaires / Questions'}
                required
                errorMessage={formErrors.comment}
              />
            </div>
          </div>

          <Button
            className={styles.customButton}
            level={'primary'}
            type={'submit'}
          >
            Envoyer
          </Button>
        </form>

        {isSubmitted && (
          <div className={styles.confirmationMessage}>
            <p>Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;