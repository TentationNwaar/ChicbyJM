import React from 'react';
import * as styles from './Hero.module.css';
import Button from '../Button';
import { Link } from 'gatsby';
import { toOptimizedImage } from '../../helpers/general';
import clsx from 'clsx';

const Hero = (props) => {
  const {
    title,
    subtitle,
    ctaText,
    ctaAction,
    image,
    maxWidth,
    ctaStyle,
    ctaLink,
    ctaTo,
    header,
    // new optional props
    className,
    imgClassName,
    useImg = false,            // if true, render an <img> instead of background-image
    bgSize = 'cover',          // background-size when using background mode
  } = props;
  return (
    <div
      className={clsx(styles.root, className)}
      style={
        useImg
          ? undefined
          : { backgroundImage: `url(${toOptimizedImage(image)})`, backgroundSize: bgSize }
      }
    >
      {useImg && (
        <img
          src={toOptimizedImage(image)}
          alt={title || ''}
          className={imgClassName}
        />
      )}
      <div className={styles.content} style={{ maxWidth: maxWidth }}>
        {header && <span className={styles.header}>{header}</span>}
        {title && <h2 className={styles.title}>{title}</h2>}
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        {ctaText && (
          <Button
            className={`${styles.ctaButton} ${ctaStyle}`}
            level={'primary'}
            onClick={ctaAction}
          >
            {ctaText}
          </Button>
        )}
        {ctaLink && (
          <Link className={styles.ctaLink} to={ctaTo}>
            {ctaLink}
          </Link>
        )}
      </div>
    </div>
  );
};

export default Hero;
