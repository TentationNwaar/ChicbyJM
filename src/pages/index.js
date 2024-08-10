import * as React from 'react';

import AttributeGrid from '../components/AttributeGrid';
import Container from '../components/Container';
import Hero from '../components/Hero';
import BlogPreviewGrid from '../components/BlogPreviewGrid';
import Highlight from '../components/Highlight';
import Layout from '../components/Layout/Layout';
import ProductCollectionGrid from '../components/ProductCollectionGrid';
import ProductCardGrid from '../components/ProductCardGrid';
import Quote from '../components/Quote';
import Title from '../components/Title';

import { generateMockBlogData, generateMockProductData } from '../helpers/mock';

import * as styles from './index.module.css';
import { Link, navigate } from 'gatsby';
import { toOptimizedImage } from '../helpers/general';

const IndexPage = () => {
  const newArrivals = generateMockProductData(3, 'shirt');
  const blogData = generateMockBlogData(3);

  const goToShop = () => {
    navigate('/shop');
  };

  return (
    <Layout disablePaddingBottom>
      {/* Hero Container */}
      <Hero
        image={'/Couverture_JM_petit_logo.jpg'}
        title={'Racontez votre histoire avec style'}
        ctaText={'Commencer le shopping'}
        ctaAction={goToShop}
      />

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
          <Title name={'Les nouveautés'} link={'/shop'} textLink={'Tout voir'} />
          <ProductCardGrid
            spacing={true}
            showSlider
            height={480}
            columns={3}
            data={newArrivals}
          />
        </Container>
      </div>

      {/* Promotion */}
      <div className={styles.promotionContainer}>
        <Hero image={toOptimizedImage('/Banner1_JM.png')} title={`-20% de réduction \n sur les essentiels du moment`} />
        <div className={styles.linkContainers}>
          <Link to={'/shop'}>Femme</Link>
          <Link to={'/shop'}>Homme</Link>
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

      {/* Blog Grid */}
      {/* <div className={styles.blogsContainer}>
        <Container size={'large'}>
          <Title name={'Journal'} subtitle={'Notes on life and style'} />
          <BlogPreviewGrid data={blogData} />
        </Container>
      </div> */}

      {/* Promotion */}
      {/* <div className={styles.sustainableContainer}>
        <Hero
          image={toOptimizedImage('/banner3.png')}
          title={'We are Sustainable'}
          subtitle={
            'From caring for our land to supporting our people, discover the steps we’re taking to do more for the world around us.'
          }
          ctaText={'read more'}
          maxWidth={'660px'}
          ctaStyle={styles.ctaCustomButton}
        />
      </div> */}

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
};

export default IndexPage;
