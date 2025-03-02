import * as React from 'react';

import AttributeGrid from '../components/AttributeGrid';
import Container from '../components/Container';
import Hero from '../components/Hero';

import Layout from '../components/Layout/Layout';
import ProductCollectionGrid from '../components/ProductCollectionGrid';
import Quote from '../components/Quote';
import Title from '../components/Title';

import * as styles from './index.module.css';

import { Link, navigate } from 'gatsby';
import { toOptimizedImage } from '../helpers/general';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import RecentImages from "../components/RecentImages"

// Création du carousel d'image
const HeroCarousel = () => {
  // Tableau d'images à tester
  const images = [
    { src: 'carousel/Shooting1.png', 
      alt: 'Image 1',
      title: 'Racontez votre histoire avec style', 
      ctaText: 'Commencer le shopping',
      ctaLink: '/shop',
      className: styles.shooting1
    },

    { src: 'carousel/Shooting2.JPG', 
      alt: 'Image 2',
      title: 'Un vent de fraîcheur dans votre dressing cet été', 
      ctaText: 'Découvrez la collection',
      ctaLink: '/shop',
    },

    { src: 'carousel/Shooting3.png', 
      alt: 'Image 3',
      title: 'Laissez-vous envoûter par la beauté des feuilles en automne', 
      ctaText: 'Découvrez la collection',
      ctaLink: '/shop',
    },

    { src: 'carousel/Shooting4.JPG', 
      alt: 'Image 4',
      title: 'Enveloppez-vous de douceur et de chaleur', 
      ctaText: 'Découvrez la collection',
      ctaLink: '/shop',
    },

    { src: 'carousel/Shooting5.png', 
      alt: 'Image 5',
      title: 'Révélez votre côté fleuri', 
      ctaText: 'Découvrez la collection',
      ctaLink: '/shop',
    },
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
    <Slider {...settings}>
      {images.map((image, index) => (
        <div key={index} className={styles.carouselSlide}>
          <img
            src={image.src}
            alt={image.alt}
            className={`${styles.carouselImage} ${image.className}`}
          />
          <div className={styles.carouselOverlay}>
            <h2 className={styles.carouselTitle}>{image.title}</h2>
            <button 
              className={styles.carouselButton} 
              onClick={() => navigate(image.ctaLink)}
            >
              {image.ctaText}
            </button>
          </div>
        </div>
      ))}
    </Slider>
  );
};


// Les nouveautés
const IndexPage = () => {
  const goToShop = () => {
    navigate('/shop');
  };

  return (
    <Layout disablePaddingBottom>
      <HeroCarousel />

      {/* Collection Container */}
      <div className={styles.collectionContainer}>
        <Container size={'large'}>
          <Title name={'Nouvelle collection'} />
          <ProductCollectionGrid />
        </Container>
      </div>

      {/* New Arrivals */}
      <div className={styles.newArrivalsContainer}>
        <Container>
          <Title name={'Les nouveautés'} link={'/shopTous'} textLink={'Tout voir'} />
          <RecentImages />
          {/* <ProductCardGrid
            spacing={true}
            showSlider
            height={480}
            columns={3}
            data={newArrivals.map(item => ({
              image: <GatsbyImage image={item.image} alt={item.name} />,
              name: item.name,
            }))}
          /> */}
        </Container>
      </div>
      {/* Promotion */}
      <div className={styles.promotionContainer}>
        <Hero image={toOptimizedImage('/Banner1_JM.png')} title={`-20% de réduction \n sur les essentiels du moment`} />
        <div className={styles.linkContainers}>
          {/* <Link to={'/shop'}>Femme</Link>
          <Link to={'/shop'}>Homme</Link> */}
        </div>
      </div>

      {/* Quote */}
      <Quote
        bgColor={'var(--standard-light-grey)'}
        title={'A propos de JM'}
        quote={
          '“Le confort et l\'élégance incarnent les piliers fondamentaux de notre approche, car nous croyons fermement que chaque expérience mérite d\'être à la fois agréable et raffinée.”'
        }
      />

      {/* Social Media */}
      <div className={styles.socialContainer}>
        <Title
          name={'Stylisé par Vous'}
          subtitle={'Identifiez @chicbyjm pour être mis en avant.'}
        />
        <div className={styles.socialContentGrid}>
          <img src={toOptimizedImage(`/social/PartFromBanner.png`)} alt={'social media 1'} />
          <img src={toOptimizedImage(`/social/PartFromBanner2.png`)} alt={'social media 2'} />
          <img src={toOptimizedImage(`/social/PartFromBanner3.png`)} alt={'social media 3'} />
          <img src={toOptimizedImage(`/social/PartFromBanner4.png`)} alt={'social media 4'} />
        </div>
      </div>
      <AttributeGrid />
    </Layout>
  );
}

export default IndexPage;
