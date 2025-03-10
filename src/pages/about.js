import React from 'react';
import Container from '../components/Container';
import Hero from '../components/Hero';
import Layout from '../components/Layout/Layout';

import * as styles from './about.module.css';
import { toOptimizedImage } from '../helpers/general';

const AboutPage = () => {
  return (
    <Layout disablePaddingBottom>
      <div className={styles.root}>
        {/* Section d'Introduction */}
        <section className={styles.introSection}>
          <div className={styles.introContent}>
            <div className={styles.introTextContent}>
              <Hero
                maxWidth={'1000px'}
                title={`Chic by JM \n Une entreprise Suisse depuis 2023`}
                className={styles.hero}
              />
              <Container size={'large'} spacing={'min'}>
                <p className={styles.introText}>
                  Bienvenue chez Chic by JM, où l'élégance suisse rencontre l'innovation.
                  Découvrez notre histoire, nos valeurs et notre engagement envers un avenir durable.
                </p>
              </Container>
            </div>
            <div className={styles.introImageContent}>
              <img
                src={'/aboutUs/BoxJM.png'}
                alt="Chic by JM"
                className={styles.introImage}
              />
            </div>
          </div>
        </section>

        {/* Section Notre Histoire */}
        <section className={styles.historySection}>
          <Container size={'large'} spacing={'min'}>
            <h2 className={styles.sectionTitle}>Notre Histoire</h2>
            <p>
              Fondée en 2023, Chic by JM est une marque suisse dédiée à l'élégance et au style affirmé.
              Nous avons pour mission d'offrir à chacun des pièces uniques, modernes et sophistiquées.
            </p>
            <p>
              En seulement un an, nous avons attiré une clientèle fidèle et variée, des particuliers aux clubs prestigieux,
              comme les Montreux Jazzers. Notre engagement est de continuer à offrir des produits qui allient qualité, style et innovation.
            </p>
          </Container>
        </section>

        {/* Section Nos Valeurs */}
        <section className={styles.valuesSection}>
          <Container size={'large'} spacing={'min'}>
            <h2 className={styles.sectionTitle}>Nos Valeurs</h2>
            <p>
              Nous croyons profondément en la solidarité, le respect mutuel et l'engagement. Ensemble, nous créons une équipe forte, solidaire et innovante.
            </p>
            <ul className={styles.valuesList}>
              <li>Soutien à l'environnement</li>
              <li>Excellence dans la production</li>
            </ul>
          </Container>
        </section>

        {/* Section Développement Durable */}
        <section className={styles.sustainabilitySection}>
          <Container size={'large'} spacing={'min'}>
            <h2 className={styles.sectionTitle}>Développement Durable</h2>
            <p>
              Chaque produit est conçu avec des matériaux de qualité supérieure, sélectionnés pour garantir une durabilité exceptionnelle et un style intemporel.
              Nous sommes profondément engagés dans la protection de l'environnement et utilisons des procédés écoresponsables dans toutes les étapes de notre production.
            </p>
          </Container>
        </section>

        {/* Section Image Parallaxe */}
        <section className={styles.parallaxSection}>
          <img
            alt="Montreux Jazzers"
            src={toOptimizedImage('/aboutUs/Wallpaper_Montreux_Jazzers_Maillots.png')}
            className={styles.parallaxImage}
          />
        </section>

        {/* Ajoutez d'autres sections ici si nécessaire */}
      </div>
    </Layout>
  );
};

export default AboutPage;