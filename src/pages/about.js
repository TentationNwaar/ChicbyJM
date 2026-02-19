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
                  Bienvenue chez Chic by JM, où l'élégance suisse rencontre
                  l'innovation. Découvrez notre histoire, nos valeurs et notre
                  engagement envers un avenir durable.
                </p>
              </Container>
            </div>
            <div className={styles.introImageContent}>
              <img
                src={'/BoxJM.webp'}
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
              Fondée en 2023, Chic by JM est une marque suisse dédiée à
              l'élégance et au style affirmé. L'intégralité de nos designs et de
              notre conception est réalisée en Suisse, au cœur de notre atelier
              créatif.
            </p>
            <p>
              Pour donner vie à nos créations, nous collaborons avec des
              artisans partenaires européens spécialisés, reconnus pour leur
              excellence technique. Ce modèle nous permet de garantir une
              qualité de fabrication optimale tout en maintenant une production
              agile et moderne.
            </p>
            <p>
              En seulement un an, nous avons attiré une clientèle fidèle, des
              particuliers aux clubs prestigieux comme les Montreux Jazzers, qui
              nous font confiance pour notre sens du détail et notre exigence.
            </p>
          </Container>
        </section>

        {/* Section Nos Valeurs */}
        <section className={styles.valuesSection}>
          <Container size={'large'} spacing={'min'}>
            <h2 className={styles.sectionTitle}>Nos Valeurs</h2>
            <p>
              Nous croyons profondément en la solidarité, le respect mutuel et
              l'engagement. Ensemble, nous créons une équipe forte, solidaire et
              innovante.
            </p>
            <ul className={styles.valuesList}>
              <li>Conception helvétique & Créativité</li>
              <li>Production à la demande (zéro gaspillage)</li>
              <li>
                Soutien à l'environnement via des circuits courts européens
              </li>
            </ul>
          </Container>
        </section>

        {/* Section Développement Durable */}
        <section className={styles.sustainabilitySection}>
          <Container size={'large'} spacing={'min'}>
            <h2 className={styles.sectionTitle}>Développement Durable</h2>
            <p>
              Nous avons choisi un modèle de production à la demande : chaque
              pièce est fabriquée uniquement lorsqu'elle est commandée. Ce
              procédé nous permet d'éliminer totalement le gaspillage lié au
              surstockage et de réduire notre empreinte carbone. En utilisant
              des encres certifiées et des matériaux sélectionnés pour leur
              longévité, nous privilégions la qualité à la quantité.
            </p>
          </Container>
        </section>

        {/* Section Image Parallaxe */}
        <section className={styles.parallaxSection}>
          <img
            alt="Montreux Jazzers"
            src={toOptimizedImage('/JMxJazzers.webp')}
            className={styles.parallaxImage}
          />
        </section>

        {/* Ajoutez d'autres sections ici si nécessaire */}
      </div>
    </Layout>
  );
};

export default AboutPage;
