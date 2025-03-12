import React from 'react';
import './return-policy.css';

function ReturnPolicy() {
  return (
    <div className="return-policy-page">
      <h1>Politique de retour</h1>

      <section>
        <h2>Retours</h2>
        <hr />
        <p>
          Vous avez 30 jours à compter de la réception de votre commande pour effectuer un retour. Passé ce délai, nous ne pourrons malheureusement pas vous offrir de remboursement ou d'échange.
        </p>
        <p>
          Pour être éligible à un retour, l'article doit être inutilisé, dans son emballage d'origine et présenter une preuve d'achat. Les articles endommagés seront acceptés.
        </p>
        <p>
          Certains articles ne sont pas retournables, notamment :
            <li>Denrées périssables (aliments, fleurs, journaux, magazines)</li>
            <li>Produits d'hygiène personnelle</li>
            <li>Substances dangereuses ou inflammables</li>
        </p>
        <p>
          Notez que nous n'acceptons pas les retours pour des raisons de taille. Veuillez vérifier attentivement les dimensions avant de commander.
        </p>
        <p>
          Des remboursements partiels peuvent être accordés dans les cas suivants :
            <li>Article incomplet ou endommagé ne résultant pas d'une erreur de notre part</li>
            <li>Retour effectué plus de 30 jours après la livraison</li>
        </p>
      </section>

      <section>
        <h2>Remboursements</h2>
        <p>
          Après réception et inspection de votre retour, nous vous informerons par e-mail de l'approbation ou du refus de votre remboursement. En cas d'approbation, le remboursement sera automatiquement crédité sur votre moyen de paiement initial sous quelques jours.
        </p>
        <p>
          Si vous n'avez pas reçu votre remboursement :
            <li>Vérifiez votre compte bancaire.</li>
            <li>Contactez l'émetteur de votre carte de crédit (le délai de traitement peut varier).</li>
            <li>Contactez votre banque (un délai de traitement est souvent nécessaire).</li>
          Si le problème persiste, contactez-nous à chicbyjm@hotmail.com.
        </p>
      </section>

      <section>
        <h2>Articles soldés ou en promotion</h2>
        <p>
          Seuls les articles à prix courant sont remboursables. Les articles soldés ou en promotion ne le sont pas.
        </p>
      </section>

      <section>
        <h2>Échanges</h2>
        <p>
          Nous remplaçons uniquement les articles défectueux ou endommagés. Pour un échange, contactez-nous à chicbyjm@hotmail.com et suivez les instructions pour l'envoi à un point relais.
        </p>
      </section>

      <section>
        <h2>Cadeaux</h2>
        <p>
          Si l'article était un cadeau et vous a été envoyé directement, vous recevrez un crédit du montant du retour. Sinon, le remboursement sera effectué à la personne ayant passé la commande.
        </p>
      </section>

      <section>
        <h2>Expédition des retours</h2>
        <p>
          Les frais de retour sont à votre charge et ne sont pas remboursables. L'adresse de retour vous sera communiquée par e-mail.
        </p>
        <p>
          Pour les articles de plus de 75 CHF, nous vous recommandons un service de suivi ou une assurance. Nous ne garantissons pas la réception des retours.
        </p>
        <p>
          Le délai de réception de votre échange peut varier selon votre localisation.
        </p>
      </section>
    </div>
  );
}

export default ReturnPolicy;