import React from 'react';
import * as styles from './CGV.module.css';

const ConditionsGenerales = () => {
  return (
    <div className={styles.root}>
      <h2>Conditions Générales de Vente</h2>

      <div className={styles.section}>
        <h4>APERÇU</h4>
        <p>Ce site web est exploité par JM. Partout sur le site, nous employons les termes « nous », « notre » et « nos » en référence à notre boutique. Ce site web, y compris l'ensemble des informations, outils et services auquel il donne accès, est offert par notre entreprise à l'utilisateur que vous êtes, à condition que vous acceptiez la totalité des modalités, conditions, politiques et avis stipulés ici.</p>
        <p>En visitant notre site et/ou en achetant quelque chose auprès de notre entreprise, vous prenez part à notre « Service » et acceptez d'être lié(e) par les modalités et conditions suivantes (« Conditions générales », « Conditions d'utilisation »), y compris par les modalités, conditions et politiques mentionnées aux présentes et/ou accessibles en hyperlien.</p>
        <p>Veuillez lire attentivement les présentes Conditions d'utilisation avant d'accéder à notre site web et de l'utiliser. En accédant à une quelconque partie du Site ou en l'utilisant, vous acceptez d'être lié(e) par les présentes Conditions d'utilisation.</p>
      </div>

      <div className={styles.section}>
        <h4>SECTION 1 – CONDITIONS D'UTILISATION DE LA BOUTIQUE EN LIGNE</h4>
        <p>En acceptant les présentes Conditions d'utilisation, vous déclarez avoir atteint ou dépassé l'âge de la majorité dans votre région, province ou État et nous avoir donné l'autorisation de permettre à toute personne mineure à votre charge d'utiliser ce site.</p>
        <p>Vous ne devez en aucune façon utiliser nos produits à des fins illégales ou non autorisées, ni violer des lois de votre juridiction lorsque vous utilisez le Service (y compris, sans toutefois s'y limiter, les lois relatives aux droits d'auteur).</p>
      </div>

      <div className={styles.section}>
        <h4>SECTION 2 – CONDITIONS GÉNÉRALES</h4>
        <p>Nous nous réservons le droit de refuser de servir quelqu'un à tout moment et pour quelque raison que ce soit.</p>
        <p>Vous comprenez que votre contenu (à l'exception des informations relatives à votre carte de crédit) peut être transféré sans chiffrement et que cela comprend (a) des transmissions sur plusieurs réseaux ; et (b) des changements effectués dans le but de se conformer et de s'adapter aux exigences techniques de la connexion de réseaux ou d'appareils.</p>
      </div>

      <div className={styles.section}>
        <h4>SECTION 3 – EXACTITUDE, EXHAUSTIVITÉ ET ACTUALITÉ DES INFORMATIONS</h4>
        <p>Nous ne saurions être tenus responsables si les informations proposées sur ce site sont inexactes, incomplètes ou caduques. Le contenu de ce site est fourni à titre d'information générale uniquement et ne doit pas être considéré ou utilisé comme seule base pour la prise de décisions sans consulter des sources d'information plus importantes, plus exactes, plus complètes ou plus actuelles.</p>
        <p>Ce site peut contenir certaines données historiques. Par définition, les données historiques ne sont pas actuelles et sont fournies uniquement à titre de référence.</p>
      </div>

      <div className={styles.section}>
        <h4>SECTION 4 – MODIFICATIONS DU SERVICE ET DES PRIX</h4>
        <p>Les prix de nos produits sont modifiables sans préavis.</p>
        <p>Nous nous réservons le droit de modifier ou de mettre fin au Service (ou à une quelconque partie de celui-ci) à tout moment et sans préavis.</p>
      </div>

      <div className={styles.section}>
        <h4>SECTION 5 – PRODUITS OU SERVICES (le cas échéant)</h4>
        <p>Il est possible que certains produits ou services ne soient disponibles qu'en ligne à travers le site web. Il se peut que les quantités de ces produits ou services soient limitées et que leur retour ou leur échange soit strictement assujetti à notre Politique de retour.</p>
        <p>Nous nous sommes efforcés de présenter aussi précisément que possible les couleurs et images des produits figurant sur la boutique.</p>
      </div>

      <div className={styles.section}>
        <h4>SECTION 6 – EXACTITUDE DE LA FACTURATION ET DES INFORMATIONS DE COMPTE</h4>
        <p>Nous nous réservons le droit de refuser toute commande que vous passez auprès de nous. Nous pouvons, à notre seule discrétion, limiter ou annuler les quantités achetées par personne, par foyer ou par commande.</p>
        <p>Vous acceptez de fournir des informations d'achat et de compte actuelles, complètes et exactes pour tous les achats effectués dans notre boutique.</p>
      </div>

      {/* Ajoutez d'autres sections pour chaque partie des Conditions Générales */}

      <div className={styles.section}>
        <h4>ARTICLE 20 – COORDONNÉES</h4>
        <p>Les questions relatives aux Conditions d’utilisation doivent nous être envoyées à <a href="mailto:chicbyjm@hotmail.com">chicbyjm@hotmail.com</a>.</p>
      </div>
    </div>
  );
};

export default ConditionsGenerales;