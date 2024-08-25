import React from 'react';
import Instagram from './Instagram';
import TikTok from './TikTok'; // Ajout du nouvel import

const Footer = () => (
  <footer>
    <div>
      <a href="https://instagram.com" aria-label="Instagram">
        <Instagram />
      </a>
      <a href="https://tiktok.com" aria-label="TikTok"> {/* Ajout du lien et icône TikTok */}
        <TikTok />
      </a>
      {/* Autres éléments du footer */}
    </div>
  </footer>
);

export default Footer;
