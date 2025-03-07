import React from 'react';
import * as styles from './InfoPerso.module.css';

const NePasVendre = () => {
  return (
    <div className={styles.root}>
      <h2>Ne pas vendre ou partager mes informations personnelles</h2>

      <div className={styles.section}>
        <p>Comme décrit dans notre <a href="/politique-de-confidentialite">Politique de confidentialité</a>, nous collectons des informations sur nos sites Web et, le cas échéant, nos applications mobiles, et partageons ces informations avec des tiers, y compris des partenaires publicitaires, afin de vous montrer des publicités sur d'autres sites Web qui sont plus pertinentes par rapport à vos intérêts, y compris des publicités qui font la promotion de nos produits et services et de ceux d'autres marchands Shopify. Nous pouvons le faire en partageant les informations personnelles que nous recueillons lorsque vous visitez nos sites Web et, le cas échéant, nos applications mobiles, ainsi que par le biais de cookies et de technologies similaires.</p>

        <p>Ces activités peuvent être considérées comme une "vente" ou un "partage" de vos informations personnelles en vertu de certaines lois sur la protection de la vie privée des États américains. Selon l'endroit où vous vous trouvez, vous pouvez avoir le droit de refuser ces activités. Si vous souhaitez exercer ce droit de retrait, veuillez suivre les instructions ci-dessous.</p>

        <p>Pour refuser la "vente" ou le "partage" de vos informations personnelles collectées à l'aide de cookies et d'autres identifiants basés sur des appareils, comme décrit ci-dessus, veuillez <a href="#">cliquer ici</a>. Vous devrez renouveler ce choix si vous effacez les cookies de votre navigateur ou si vous utilisez un autre navigateur ou appareil.</p>

        <p>Si vous visitez notre site web alors que le signal de préférence de désactivation du Contrôle mondial de la protection de la vie privée est activé, en fonction de l'endroit où vous vous trouvez, nous considérerons qu'il s'agit d'une demande de désactivation de la "vente" ou du "partage" d'informations pour l'appareil et le navigateur que vous avez utilisés pour visiter notre site web.</p>
      </div>
    </div>
  );
};

export default NePasVendre;