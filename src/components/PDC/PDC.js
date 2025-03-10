import React from 'react';
import * as styles from './PDC.module.css';

const PolitiqueConfidentialite = () => {
  return (
    <div className={styles.root}>
      <h2 className={styles.title}>Politique de confidentialité de JM</h2>

      <div className={styles.section}>
        <h4 className={styles.subtitle}>Introduction</h4>
        <p>La présente Politique de confidentialité décrit la façon dont vos informations personnelles sont recueillies, utilisées et partagées lorsque vous vous rendez sur notre site ou que vous y effectuez un achat.</p>
      </div>

      <div className={styles.section}>
        <h4 className={styles.subtitle}>Informations personnelles recueillies</h4>
        <p>Lorsque vous vous rendez sur le Site, nous recueillons automatiquement certaines informations concernant votre appareil, notamment des informations sur votre navigateur web, votre adresse IP, votre fuseau horaire et certains des cookies qui sont installés sur votre appareil. En outre, lorsque vous parcourez le Site, nous recueillons des informations sur les pages web ou produits individuels que vous consultez, les sites web ou les termes de recherche qui vous ont permis d'arriver sur le Site, ainsi que des informations sur la manière dont vous interagissez avec le Site. Nous désignons ces informations collectées automatiquement sous l'appellation « Informations sur l'appareil ».</p>

        <h5 className={styles.subheading}>Nous recueillons les Informations sur l'appareil à l'aide des technologies suivantes :</h5>
        <ul className={styles.list}>
          <li>FICHIERS TÉMOINS (COOKIES)</li>
          <li>Les « fichiers journaux » suivent l'activité du Site...</li>
          <li>Les « pixels invisibles »...</li>
        </ul>

        <p>Par ailleurs, lorsque vous effectuez ou tentez d'effectuer un achat par le biais du Site, nous recueillons certaines informations vous concernant, notamment votre nom, votre adresse de facturation, votre adresse d'expédition, vos informations de paiement (y compris vos numéros de cartes de crédit, votre adresse e-mail et votre numéro de téléphone). Ces informations collectées automatiquement sont désignées par l’appellation « Informations sur la commande ».</p>

        <p>Lorsque nous utilisons l'expression « Informations personnelles », nous faisons référence aux Informations sur l'appareil et aux Informations sur la commande.</p>
      </div>

      <div className={styles.section}>
        <h4 className={styles.subtitle}>Comment utilisons-nous vos informations personnelles ?</h4>
        <p>Nous utilisons les Informations sur la commande pour traiter toute commande passée par le biais du Site, ainsi que pour :</p>
        <ul className={styles.list}>
          <li>communiquer avec vous ;</li>
          <li>évaluer les fraudes ou risques potentiels ;</li>
          <li>fournir des informations ou publicités concernant nos produits ou services.</li>
        </ul>

        <p>Nous utilisons les Informations sur l'appareil pour évaluer les fraudes ou risques potentiels et améliorer le Site (analyse de l'interaction des clients, publicités et marketing).</p>
      </div>

      <div className={styles.section}>
        <h4 className={styles.subtitle}>Partage avec des tiers</h4>
        <p>Nous partageons vos Informations personnelles avec des tiers pour les fins décrites ci-dessus, comme avec Google Analytics pour mieux comprendre l'utilisation du Site.</p>
      </div>

      <div className={styles.section}>
        <h4 className={styles.subtitle}>Ne pas suivre</h4>
        <p>Nous ne modifions pas nos pratiques de collecte de données lorsque nous détectons un signal « Ne pas suivre » sur votre navigateur.</p>
      </div>

      <div className={styles.section}>
        <h4 className={styles.subtitle}>Vos droits</h4>
        <p>Si vous êtes résident européen, vous avez un droit d'accès et de modification de vos informations personnelles. Pour l'exercer, contactez-nous via les coordonnées ci-dessous.</p>
      </div>

      <div className={styles.section}>
        <h4 className={styles.subtitle}>Rétention des données</h4>
        <p>Nous conservons vos informations de commande dans nos dossiers, sauf si vous demandez leur suppression.</p>
      </div>

      <div className={styles.section}>
        <h4 className={styles.subtitle}>Changements</h4>
        <p>Nous pouvons modifier cette politique pour refléter des changements dans nos pratiques ou pour des raisons juridiques.</p>
      </div>

      <div className={styles.section}>
        <h4 className={styles.subtitle}>Nous contacter</h4>
        <p>Pour toute question sur nos pratiques de confidentialité, contactez-nous par e-mail à 
          <a className={styles.emailLink} href="mailto:chicbyjm@hotmail.com"> chicbyjm@hotmail.com</a>.
        </p>
      </div>
    </div>
  );
};

export default PolitiqueConfidentialite;