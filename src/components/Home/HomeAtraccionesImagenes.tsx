'use client';

import { useTranslation } from 'react-i18next';
import Sectitle from '../Title/Sectitle';
import Carrusel from '../Carrusel';
import { opcionesSlider } from '../../lib/helpers';
import { imagenesHome } from '../../lib/imagenesHome';
import OptimizedImage from '../OptimizedImage';

// Home page gallery.
// These 15 photos were hardcoded as Firebase URLs in the code; now
// they come from the backend, like the rest of the images.
export default function HomeAtraccionesImagenes() {
  const { t } = useTranslation('global');

  return (
    <section className="blog_area sec_pad">
      <div className="container">
        <div className="container">
          <Sectitle
            sClass="sec_title text-center mb_15"
            Title={t('home.some_pictures')}
            tClass="t_color3 mb_20"
          />
          <div className="row">
            <div className="col-lg-12">
              <Carrusel className="home_imagenes_slider" opciones={opcionesSlider(1, 1, 1, 1)}>
                {imagenesHome.map((imagen) => (
                  <div className="iitem" key={imagen.archivo}>
                    <div className="home_imagenes_item">
                      <OptimizedImage src={imagen.url} alt="" />
                    </div>
                  </div>
                ))}
              </Carrusel>
            </div>
            <div className="autor_fotos">
              <span>
                📸{' '}
                <a
                  href="https://www.instagram.com/danny.gamboa/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @danny.gamboa
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
