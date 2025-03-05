import React from 'react';
import * as styles from './Policy.module.css';

const Policy = (props) => {
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <p>
          La présente Politique de confidentialité décrit la façon dont vos informations personnelles sont recueillies, utilisées et partagées lorsque vous vous rendez sur https://chicbyjm.ch ou que vous y effectuez un achat.
        </p>
      </div>

      <div className={styles.section}>
        <h3>INFORMATIONS PERSONNELLES RECUEILLIES</h3>
        <p>
          Lorsque vous vous rendez sur le Site, nous recueillons automatiquement certaines informations concernant votre appareil, notamment des informations sur votre navigateur web, votre adresse IP, votre fuseau horaire et certains des cookies qui sont installés sur votre appareil. En outre, lorsque vous parcourez le Site, nous recueillons des informations sur les pages web ou produits individuels que vous consultez, les sites web ou les termes de recherche qui vous ont permis d'arriver sur le Site, ainsi que des informations sur la manière dont vous interagissez avec le Site. Nous désignons ces informations collectées automatiquement sous l’appellation « Informations sur l'appareil ».
        </p>
        <p>
          Nous recueillons les Informations sur l'appareil à l'aide des technologies suivantes :
        </p>
        <h4>FICHIERS TÉMOINS (COOKIES)</h4>
        <p>
          Voici une liste de fichiers témoins que nous utilisons. Nous les avons énumérés ici pour que vous ayez la possibilité de choisir si vous souhaitez les autoriser ou non.
        </p>
        <ul>
          <li><strong>_session_id</strong>, identificateur unique de session, permet de stocker les informations relatives à votre session (référent, page de renvoi, etc.).</li>
          <li><strong>_visit</strong>, aucune donnée retenue, persiste pendant 30 minutes depuis la dernière visite. Utilisé pour enregistrer le nombre de visites.</li>
          <li><strong>_uniq</strong>, aucune donnée retenue, expire à minuit (selon l’emplacement du visiteur) le jour suivant. Calcule le nombre de visites par client unique.</li>
          <li><strong>cart</strong>, identificateur unique, persiste pendant 2 semaines, stocke l’information relative à votre panier d’achat.</li>
          <li><strong>_secure_session_id</strong>, identificateur unique de session</li>
          <li><strong>storefront_digest</strong>, identificateur unique, indéfini si la boutique possède un mot de passe, il est utilisé pour savoir si le visiteur actuel a accès.</li>
        </ul>
        <p>
          Les « fichiers journaux » suivent l'activité du Site et recueillent des données telles que votre adresse IP, le type de navigateur que vous utilisez, votre fournisseur d'accès Internet, vos pages référentes et de sortie, et vos données d'horodatage (date et heure).
        </p>
        <p>
          Les « pixels invisibles », les « balises » et les « pixels » sont des fichiers électroniques qui enregistrent des informations sur la façon dont vous parcourez le Site.
        </p>
      </div>

      <div className={styles.section}>
        <h3>COMMENT UTILISONS-NOUS VOS INFORMATIONS PERSONNELLES ?</h3>
        <p>
          En règle générale, nous utilisons les Informations sur la commande que nous recueillons pour traiter toute commande passée par le biais du Site (y compris pour traiter vos informations de paiement, organiser l'expédition de votre commande et vous fournir des factures et/ou des confirmations de commande). En outre, nous utilisons ces Informations sur la commande pour :
        </p>
        <ul>
          <li> - Communiquer avec vous</li>
          <li> - Évaluer les fraudes ou risques potentiels</li>
          <li> - Lorsque cela correspond aux préférences que vous nous avez communiquées, vous fournir des informations ou des publicités concernant nos produits ou services.</li>
        </ul>
        <p>
          Nous utilisons les Informations sur l'appareil (en particulier votre adresse IP) que nous recueillons pour évaluer les fraudes ou risques potentiels et, de manière plus générale, pour améliorer et optimiser notre Site.
        </p>
      </div>

      <div className={styles.section}>
        <h3>PARTAGE DE VOS INFORMATIONS PERSONNELLES</h3>
        <p>
          Nous partageons vos Informations personnelles avec des tiers qui nous aident à les utiliser aux fins décrites précédemment. Par exemple, nous utilisons des services d'hébergement pour maintenir notre boutique en ligne.
        </p>
        <p>
          Nous utilisons également Google Analytics pour mieux comprendre comment nos clients utilisent le Site. Pour en savoir plus sur l'utilisation de vos Informations personnelles par Google, vous pouvez consulter la page suivante : <a href="https://www.google.com/intl/fr/policies/privacy/" target="_blank" rel="noopener noreferrer">Google Privacy</a>.
        </p>
      </div>

      <div className={styles.section}>
        <h3>VOS DROITS</h3>
        <p>
          Si vous êtes résident(e) européen(ne), vous disposez d'un droit d'accès aux informations personnelles que nous détenons à votre sujet et vous pouvez demander à ce qu'elles soient corrigées, mises à jour ou supprimées. Si vous souhaitez exercer ce droit, veuillez nous contacter au moyen des coordonnées précisées ci-dessous.
        </p>
      </div>

      <div className={styles.section}>
        <h3>RÉTENTION DES DONNÉES</h3>
        <p>
          Lorsque vous passez une commande par l'intermédiaire du Site, nous conservons les Informations sur votre commande dans nos dossiers, sauf si et jusqu'à ce que vous nous demandiez de les supprimer.
        </p>
      </div>

      <div className={styles.section}>
        <h3>CHANGEMENTS</h3>
        <p>
          Nous pouvons être amenés à modifier la présente politique de confidentialité de temps à autre afin d'y refléter, par exemple, les changements apportés à nos pratiques ou pour d'autres motifs opérationnels, juridiques ou réglementaires.
        </p>
      </div>

      <div className={styles.section}>
        <h3>NOUS CONTACTER</h3>
        <p>
          Pour en savoir plus sur nos pratiques de confidentialité, si vous avez des questions ou si vous souhaitez déposer une réclamation, veuillez nous contacter par e-mail à <a href="mailto:chicbyjm@hotmail.com">chicbyjm@hotmail.com</a>.
        </p>
      </div>
    </div>
  );
};

export default Policy;