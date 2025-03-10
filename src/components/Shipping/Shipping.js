import React from 'react';
import * as styles from './Shipping.module.css';

const Shipping = () => {
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <h2 className={styles.title}>Informations sur la livraison</h2>
        <p>
          Nous nous efforçons de livrer vos commandes dans les meilleurs délais. 
          Voici tout ce que vous devez savoir sur notre processus de livraison.
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.subtitle}>Délais de livraison</h3>
        <p>
          Les commandes sont traitées dans un délai de 1 à 2 jours ouvrables. Les délais de livraison 
          varient en fonction de votre localisation, mais en général, vous recevrez votre commande sous 
          5 à 7 jours ouvrables.
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.subtitle}>Frais de livraison</h3>
        <p>
          Nous offrons la livraison gratuite pour toutes les commandes supérieures à 50 CHF. Pour les commandes 
          inférieures à 50 CHF, des frais de livraison de 5 CHF seront appliqués.
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.subtitle}>Suivi de la commande</h3>
        <p>
          Une fois votre commande expédiée, vous recevrez un e-mail contenant un numéro de suivi pour suivre 
          votre colis en temps réel.
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.subtitle}>Options de livraison</h3>
        <p>
          Nous proposons les options suivantes pour la livraison :
        </p>
        <ul className={styles.list}>
          <li><p>Livraison standard (5 à 7 jours ouvrables)</p></li>
          <li><p>Livraison express (2 à 3 jours ouvrables)</p></li>
        </ul>
      </div>

      <div className={styles.section}>
        <h3 className={styles.subtitle}>Adresse de livraison</h3>
        <p>
          Veuillez vous assurer que l'adresse de livraison que vous fournissez est complète et correcte. Nous 
          ne sommes pas responsables des retards ou des erreurs de livraison dues à des informations incorrectes.
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.subtitle}>Questions ?</h3>
        <p>
          Si vous avez des questions supplémentaires concernant la livraison, n'hésitez pas à nous contacter par e-mail à 
          <a className={styles.emailLink} href="mailto:chicbyjm@hotmail.com"> chicbyjm@hotmail.com</a>.
        </p>
      </div>
    </div>
  );
};

export default Shipping;