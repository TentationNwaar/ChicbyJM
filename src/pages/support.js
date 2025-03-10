import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import * as styles from './support.module.css';

import Banner from '../components/Banner';
import Contact from '../components/Contact';
import Layout from '../components/Layout/Layout';
import ThemeLink from '../components/ThemeLink';
import Policy from '../components/Policy';
import Shipping from '../components/Shipping';
import Return from '../pages/PolitiqueRetour.js';
import Faq from '../components/FAQ';  
import CGV from '../components/CGV';  
import PDC from '../components/PDC';  
import InfoPerso from '../components/InfoPerso';  
import Container from '../components/Container';

const SupportPage = (props) => {
  const subpages = [
    { title: 'Conditions Générales de Vente', key: 'CGV' },
    { title: 'FAQ - Questions fréquentes', key: 'faq' },
    { title: 'Politique de confidentialité', key: 'PDC' },
    { title: 'Information sur la livraison', key: 'shipping' },
    { title: 'Politique de retour', key: 'return' },
    { title: 'Contact', key: 'contact' },
    { title: 'Ne pas vendre ou partager mes informations personnelles', key: 'infoPerso' },
  ];

  const [current, setCurrent] = useState(subpages[4]);

  const renderElement = (key) => {
    let tempElement = <React.Fragment />;

    switch (key) {
      case 'contact':
        tempElement = <Contact />;
        break;
      case 'policy':
        tempElement = <Policy />;
        break;
      case 'shipping':
        tempElement = <Shipping />;
        break;
      case 'return':
        tempElement = <Return />;
        break;
      case 'faq':
        tempElement = <Faq />;
        break;
      case 'CGV':
        tempElement = <CGV />;
        break;
      case 'PDC':
        tempElement = <PDC />;
        break;
      case 'infoPerso':
        tempElement = <InfoPerso />;
        break;
      default:
        break;
    }
    return tempElement;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (props.location.hash !== '' && props.location.hash !== undefined) {
      const hash = props.location.hash.substring(1);
      const tempCurrent = subpages.find((detail) => detail.key === hash);
  
      if (tempCurrent && tempCurrent.key !== current.key) {
        setCurrent(tempCurrent);
        window.scrollTo(0, 475);
      }
    }
  }, [props.location]);

  return (
    <Layout disablePaddingBottom>
      <div className={styles.root}>
        <Banner
          maxWidth={'650px'}
          name={current.title}
          bgImage={'/support.png'}
          color={'#000000'}
          height={'100px'}
        />

        <div className={styles.navContainer}>
          {subpages.map((details, index) => {
            return (
              <ThemeLink
                onClick={(e) => {
                  navigate(`/support#${details.key}`);
                }}
                key={details.key}
                isActive={current.key === details.key}
                to={`/support#${details.key}`}
              >
                {details.title}
              </ThemeLink>
            );
          })}
        </div>

        <div className={styles.pageContainer}>
          <Container size={'large'} spacing={'min'}>
            {subpages.map((details) => {
              return (
                <div
                  key={details.key}
                  className={`${styles.content} ${
                    current.key === details.key ? styles.show : styles.hide
                  }`}
                >
                  {renderElement(details.key)}
                </div>
              );
            })}
          </Container>
        </div>
      </div>
    </Layout>
  );
};

export default SupportPage;