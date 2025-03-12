import React from 'react';
import * as styles from './Faq.module.css';

const FAQ = () => {
  return (
    <div id="faq" className={styles.root}>
      <h2>FAQ - Questions fréquentes</h2>
      
      <div className={styles.section}>
        <h4>Quels sont les temps d’expédition pour vos produits?</h4>
        <p>Nous prenons 2-4 jours pour traiter votre commande puis 2-3 semaines pour vous la livrer.</p>
      </div>

      <div className={styles.section}>
        <h4>Expédiez-vous partout dans le monde?</h4>
        <p>Oui, absolument. Nous livrons dans le monde entier.</p>
      </div>

      <div className={styles.section}>
        <h4>D’où expédions-nous votre produit?</h4>
        <p>Nos bureaux sont situés à Montreux, en Suisse.</p>
      </div>

      <div className={styles.section}>
        <h4>Fournissez-vous des informations de suivi/pistage du produit?</h4>
        <p>Oui, attendez 3 jours après votre commande et demandez-nous via email à <a href="mailto:chicbyjm@hotmail.com">chicbyjm@hotmail.com</a>.</p>
      </div>

      <div className={styles.section}>
        <h4>Il manque certains articles de ma commande, que se passe-t-il?</h4>
        <p>Nos produits sont expédiés séparément selon votre commande. Si celle-ci contient par exemple des articles de deux entrepôts différents, il y aura par conséquent deux livraisons. Le reste de la commande arrivera très certainement sous peu.</p>
      </div>

      <div className={styles.section}>
        <h4>J’ai reçu un article endommagé. Que puis-je faire?</h4>
        <p>Nous sommes navrés d’entendre cela. Envoyez-nous simplement une image de l’article endommagé à <a href="mailto:chicbyjm@hotmail.com">chicbyjm@hotmail.com</a> et procédez au renvoi de l'article.</p>
      </div>

      <div className={styles.section}>
        <h4>Où êtes-vous situés?</h4>
        <p>Nous sommes situés à Montreux en Suisse.</p>
      </div>

      <div className={styles.section}>
        <h4>Je n’ai toujours pas reçu ma commande. Qu’est-ce qui prend autant de temps?</h4>
        <p>Nous vous prions de nous excuser pour le retard. Parfois, l’expédition internationale peut prendre plus de temps que prévu en raison du dédouanement. Vous pouvez tracer votre commande et voir où elle se trouve à tout moment. Si vous avez besoin d’aide, veuillez nous contacter à <a href="mailto:chicbyjm@hotmail.com">chicbyjm@hotmail.com</a>.</p>
      </div>

      <div className={styles.section}>
        <h4>Avez-vous une politique de remboursement?</h4>
        <p>Nous faisons de notre mieux pour résoudre tous les problèmes rencontrés avec nos articles en ligne. Si vous désirez un remboursement, nous pouvons l’effectuer dans un délai de 30 jours après la commande, à condition que les produits ne soient pas soldés. Pour plus d’informations, consultez notre <a href="#">politique de remboursement</a>.</p>
      </div>
    </div>
  );
};

export default FAQ;
