'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/banner-inicio.css';

// Banner de la portada: cuatro fotos que se van alternando.
// Mismas imágenes y mismos tiempos que el sitio actual.
const IMAGENES = [
  '/img/home/Chirripo1.jpg',
  '/img/home/Paisaje.jpg',
  '/img/home/Monte.jpg',
  '/img/home/Paramo.jpg',
];

export default function BannerInicio() {
  const { t } = useTranslation('global');
  const [indice, setIndice] = useState(0);
  const [animando, setAnimando] = useState(false);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setAnimando(true);
      setTimeout(() => {
        setIndice((previo) => (previo + 1) % IMAGENES.length);
        setAnimando(false);
      }, 1000);
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <section className="rutas_turisticas_banner_area">
      <div className="parallax-effect">
        <img
          src={IMAGENES[indice]}
          alt=""
          className={`banner-image ${animando ? 'fade-out' : 'fade-in'}`}
        />
      </div>
      <div className="container">
        <div className="rutas_turisticas_banner_content">
          <h2 className="wow fadeInUp" data-wow-delay="0.8s">
            {t('rutas.banner_text', { strong: 'Pérez' })}
          </h2>
        </div>
      </div>
    </section>
  );
}
