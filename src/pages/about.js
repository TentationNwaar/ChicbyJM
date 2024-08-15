import React, { useRef } from 'react';

import Container from '../components/Container';
import Hero from '../components/Hero';
import ThemeLink from '../components/ThemeLink';
import Layout from '../components/Layout/Layout';

import * as styles from './about.module.css';
import { toOptimizedImage } from '../helpers/general';
const AboutPage = (props) => {
  let historyRef = useRef();
  let valuesRef = useRef();
  let sustainabilityRef = useRef();

  const handleScroll = (elementReference) => {
    if (elementReference) {
      window.scrollTo({
        behavior: 'smooth',
        top: elementReference.current.offsetTop - 280,
      });
    }
  };

  return (
    <Layout disablePaddingBottom>
      <div className={styles.root}>
        {/* Hero Container */}
        <Hero
          maxWidth={'900px'}
          image={'/ShippingBox_Mockup.png'}
          title={`Chic by JM \n Une entreprise Suisse depuis 2023`}
        />

        {/* <div className={styles.navContainer}>
          <ThemeLink onClick={() => handleScroll(historyRef)} to={'#history'}>
            Histoire
          </ThemeLink>
          <ThemeLink onClick={() => handleScroll(valuesRef)} to={'#values'}>
            Valeurs
          </ThemeLink>
          <ThemeLink onClick={() => handleScroll(sustainabilityRef)} to={'#Durabilité'}>
            Durabilité
          </ThemeLink>
        </div> */}

        <Container size={'large'} spacing={'min'}>
          <div className={styles.detailContainer} ref={historyRef}>
            <p>
            Créée en 2023, Chic by JM est une marque suisse dédiée à l'élégance et au style affirmé. 
            Notre mission est de permettre à chacun de se distinguer avec sophistication. 
            </p>
            <br />
            <br />
            <p>
            En seulement un an, nous avons su séduire une clientèle variée, des particuliers aux clubs de sport, comme les renommés Montreux Jazzers. 
            Nous continuons à nous engager pour offrir des produits qui allient classe et modernité.
            </p>
          </div>
        </Container>

        <div className={styles.imageContainer}>
          <img alt={'Wallpaper_MontreuxJazzers_Maillots'} src={toOptimizedImage('/Wallpaper_MontreuxJazzers_Maillots.png')}></img>
        </div>

        <Container size={'large'} spacing={'min'}>
          <div className={styles.content}>
            <h3>Nos valeurs</h3>
            <div ref={valuesRef}>
              <p>
              Nous valorisons profondément la solidarité et le travail d'équipe. 
              Nous sommes ouverts d’esprit, respectueux et engagés les uns envers les autres. 
              En tant qu’équipe, nous nous soutenons mutuellement, partageons nos compétences et idées, et collaborons pour relever les défis et atteindre nos objectifs communs. 
              Ensemble, nous transformons chaque expérience en opportunité d’apprentissage et nous n'oublions jamais de célébrer nos réussites avec enthousiasme !
              </p>
              <ol>
                <li>Soyez écologiques</li>
                <li>Pas de surproduction</li>
              </ol>
            </div>
            <h3>Développement durable</h3>
            <div id={'#sustainability'} ref={sustainabilityRef}>
              <p>
              Chaque pièce est fabriquée avec des matériaux soigneusement sélectionnés pour garantir une longévité remarquable et un style intemporel.
              Nous sommes également profondément engagés en faveur de l'environnement. 
              Notre approche éco-responsable guide chaque étape de notre processus de production, de la sélection des matières premières à la fabrication. 
              Nous utilisons des procédés durables et des matériaux écologiques pour réduire notre empreinte carbone et minimiser notre impact sur la planète.
              En choisissant Chic by JM, vous optez non seulement pour des vêtements de qualité supérieure mais aussi pour un avenir plus respectueux de l'environnement.
              </p>
            </div>
          </div>
        </Container>
      </div>
    </Layout>
  );
};

export default AboutPage;
