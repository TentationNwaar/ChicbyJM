import * as React from 'react';
import { motion } from 'framer-motion';
import { navigate } from 'gatsby';
import LazyLoad from 'react-lazyload';

import Layout from '../components/Layout/Layout';
import Hero from '../components/Hero';
import Title from '../components/Title';
import Quote from '../components/Quote';
import Container from '../components/Container';
import ProductCollectionGrid from '../components/ProductCollectionGrid';
import AttributeGrid from '../components/AttributeGrid';
import RecentImages from '../components/RecentImages';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import * as styles from './index.module.css';
import { toOptimizedImage } from '../helpers/general';

// Animation d'apparition
const fadeInAnimation = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// Hero Carousel
const HeroCarousel = () => {
  const images = [
    { src: 'carousel/Shooting.webp', alt: 'Image 1', title: 'Racontez votre histoire avec style', ctaText: 'Commencer le shopping', ctaLink: '/shopTous' },
    { src: 'carousel/Shooting2.webp', alt: 'Image 2', title: 'Un dressing frais et tendance', ctaText: 'Découvrez la collection homme', ctaLink: '/shopHomme' },
    { src: 'carousel/Shooting3.webp', alt: 'Image 3', title: 'Une mode pour tous', ctaText: 'Découvrez la collection enfant', ctaLink: '/shopEnfant' },
    { src: 'carousel/Shooting4.webp', alt: 'Image 4', title: 'Douceur et chaleur', ctaText: 'Découvrez la section femme', ctaLink: '/shopFemme' },
    { src: 'carousel/Shooting5.webp', alt: 'Image 5', title: 'Complétez votre style', ctaText: 'Découvrez les accessoires', ctaLink: '/shopAccessoire' },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Slider {...settings} className={styles.heroCarousel}>
      {images.map((image, index) => (
        <div key={index} className={styles.carouselSlide}>
          <img src={image.src} alt={image.alt} className={styles.carouselImage} />
          <div className={styles.carouselOverlay}>
            <h2 className={styles.carouselTitle}>{image.title}</h2>
            <button className={styles.carouselButton} onClick={() => navigate(image.ctaLink)}>
              {image.ctaText}
            </button>
          </div>
        </div>
      ))}
    </Slider>
  );
};

// **Page Index**
const IndexPage = () => {
  return (
    <Layout disablePaddingBottom>
      <HeroCarousel />

      {/* Nouvelle collection */}
      <motion.div 
        className={`${styles.newCollectionTitle} `} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true }} 
        variants={fadeInAnimation}
      >
        <Container size="large">
          <Title name="Nouvelle collection" />
          <ProductCollectionGrid />
        </Container>
      </motion.div>

      {/* Les nouveautés */}
      <motion.div 
        className={`${styles.newArrivalsTitle}`} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true }} 
        variants={fadeInAnimation}
      >
        <Container>
          <Title name="Les nouveautés" link="/shopTous" textLink="Tout voir" />
          <RecentImages />
        </Container>
      </motion.div>

      {/* Promotion */}
      <motion.div className={styles.promotionContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInAnimation}>
        <Hero image={toOptimizedImage('/Banner1_JM.webp')} title="-20% de réduction\n sur les essentiels du moment" />
      </motion.div>

      {/* Citation */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInAnimation}>
        <Quote bgColor="var(--standard-light-grey)" title="A propos de JM" quote="“Le confort et l'élégance incarnent les piliers fondamentaux de notre approche, car nous croyons fermement que chaque expérience mérite d'être à la fois agréable et raffinée.”" />
      </motion.div>

      {/* Réseaux sociaux */}
      <motion.div className={styles.socialContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInAnimation}>
        <Title name="Stylisé par Vous" subtitle="Identifiez @chicbyjm pour être mis en avant." />
        <div className={styles.socialContentGrid}>
          {['SocialMedia1.webp', 'SocialMedia2.webp', 'SocialMedia3.webp', 'SocialMedia4.webp'].map((img, index) => (
            <LazyLoad key={index} height={300} offset={100} once>
              <img src={toOptimizedImage(`/socialMedia/${img}`)} alt={`social media ${index + 1}`} />
            </LazyLoad>
          ))}
        </div>
      </motion.div>

      <AttributeGrid />
    </Layout>
  );
};

export default IndexPage;