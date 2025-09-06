import { Link } from 'gatsby';
import React, { useState } from 'react';

import Accordion from '../Accordion';
import Container from '../Container';
import Dropdown from '../Dropdown/Dropdown';
import FormInputField from '../FormInputField/FormInputField';
import Icon from '../Icons/Icon';
import Button from '../Button';
import Config from '../../config.json';
import TikTok from '../Icons/TikTok'; 
import * as styles from './Footer.module.css';

const Footer = (prop) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const isValidEmail = (value) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(String(value).trim());

  const subscribeHandler = async (e) => {
    e.preventDefault();

    // bot protection (honeypot)
    if (honeypot) {
      return; // silently drop
    }

    const trimmed = String(email).trim();
    if (!isValidEmail(trimmed)) {
      window?.dispatchEvent?.(
        new CustomEvent('notify', {
          detail: { type: 'error', message: "Adresse e-mail invalide. Vérifie et réessaie." },
        })
      );
      return;
    }

    try {
      setLoading(true);

      // Netlify Forms programmatic submission
      const formName = 'newsletter';
      const body = new URLSearchParams({
        'form-name': formName,
        email: trimmed,
      });

      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      window?.dispatchEvent?.(
        new CustomEvent('notify', {
          detail: { type: 'success', message: "Inscription réussie à la newsletter ✨" },
        })
      );

      setEmail('');
    } catch (err) {
      console.error('Newsletter subscribe error:', err);
      window?.dispatchEvent?.(
        new CustomEvent('notify', {
          detail: { type: 'error', message: "Impossible d'envoyer ta demande. Réessaie dans un instant." },
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = (platform) => {
    window.open(Config.social[platform]);
  };

  const renderLinks = (linkCollection) => {
    return (
      <ul className={styles.linkList}>
        {linkCollection.links.map((link, index) => {
          return (
            <li key={index}>
              <Link className={`${styles.link} fancy`} to={link.link}>
                {link.text}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className={styles.root}>
      <Container size={'large'} spacing={'min'}>
        <div className={styles.content}>
          <div className={styles.contentTop}>
            {Config.footerLinks.map((linkCollection, indexLink) => {
              return (
                <div className={styles.footerLinkContainer} key={indexLink}>
                  {/* for web version */}
                  <div className={styles.footerLinks}>
                    <span className={styles.linkTitle}>
                      {linkCollection.subTitle}
                    </span>
                    {renderLinks(linkCollection)}
                  </div>
                  {/* for mobile version */}
                  <div className={styles.mobileFooterLinks}>
                    <Accordion
                      customStyle={styles}
                      type={'add'}
                      title={linkCollection.subTitle}
                    >
                      {renderLinks(linkCollection)}
                    </Accordion>
                  </div>
                </div>
              );
            })}
            <div className={styles.newsLetter}>
              <div className={styles.newsLetterContent}>
                <span className={styles.linkTitle}>Newsletter</span>
                <p className={styles.promoMessage}>
                Soyez le premier à être informé des ventes, 
                des lancements de nouveaux produits et des offres exclusives ! 
                </p>
                <form
                  className={styles.newsLetterForm}
                  name="newsletter"
                  method="POST"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                  onSubmit={subscribeHandler}
                >
                  {/* Netlify needs this hidden input to detect the form at build time */}
                  <input type="hidden" name="form-name" value="newsletter" />
                  {/* Honeypot field (hidden from users) */}
                  <p style={{ display: 'none' }}>
                    <label>
                      Ne pas remplir si tu es humain: <input name="bot-field" onChange={(e) => setHoneypot(e.target.value)} />
                    </label>
                  </p>
                  <FormInputField
                    icon={'arrow'}
                    id={'newsLetterInput'}
                    value={email}
                    placeholder={'Email'}
                    handleChange={(_, e) => setEmail(e)}
                    disabled={loading}
                  />
                  <button type="submit" disabled={loading} style={{ display: 'none' }} aria-hidden="true" tabIndex={-1}>
                    Submit
                  </button>
                </form>
                <div className={styles.socialContainer}>

                  {Config.social.instagram && (
                    <div
                      onClick={() => handleSocialClick('instagram')}
                      role={'presentation'}
                      className={styles.socialIconContainer}
                    >
                      <Icon symbol={'instagram'}></Icon>
                    </div>
                  )}

                  {Config.social.tiktok && (
                    <div
                      onClick={() => handleSocialClick('tiktok')}
                      role={'presentation'}
                      className={styles.socialIconContainer}
                    >
                      <TikTok />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <div className={styles.contentBottomContainer}>
        <Container size={'large'} spacing={'min'}>
          <div className={styles.contentBottom}>
            <div className={styles.settings}>
            </div>
            <div className={styles.copyrightContainer}>
              <div className={styles.creditCardContainer}>
              </div>
              <span className={styles.copyRight}>
                © 2023 Chic by JM. All rights reserved.
              </span>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Footer;
