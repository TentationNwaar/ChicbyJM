import React, { useEffect, useState } from 'react';
import { faTiktok } from '@fortawesome/free-brands-svg-icons';

const TikTok = () => {
  const [FontAwesomeIcon, setFontAwesomeIcon] = useState(null);

  useEffect(() => {
    import('@fortawesome/react-fontawesome')
      .then((module) => setFontAwesomeIcon(() => module.FontAwesomeIcon));
  }, []);

  if (!FontAwesomeIcon) return null; // Empêche le rendu côté serveur

  return <FontAwesomeIcon icon={faTiktok} size="2x" />;
};

export default TikTok;