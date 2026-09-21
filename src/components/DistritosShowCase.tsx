'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Sectitle from './Title/Sectitle';
import Carrusel from './Carrusel';
import { opcionesSlider } from '../lib/helpers';

// Los doce distritos del cantón, con su ilustración.
const DISTRITOS = [
  { url: '/distritos/sanisidro', img: 'Distrito-01.png', nombre: 'San Isidro de El General' },
  { url: '/distritos/general', img: 'Distrito-04.png', nombre: 'El General' },
  { url: '/distritos/danielflores', img: 'Distrito-03.png', nombre: 'Daniel Flores' },
  { url: '/distritos/rivas', img: 'Distrito-02.png', nombre: 'Rivas' },
  { url: '/distritos/sanpedro', img: 'Distrito-08.png', nombre: 'San Pedro' },
  { url: '/distritos/platanares', img: 'Distrito-06.png', nombre: 'Platanares' },
  { url: '/distritos/pejibaye', img: 'Distrito-07.png', nombre: 'Pejibaye' },
  { url: '/distritos/cajon', img: 'Distrito-05.png', nombre: 'Cajón' },
  { url: '/distritos/baru', img: 'Distrito-11.png', nombre: 'Barú' },
  { url: '/distritos/rionuevo', img: 'Distrito-09.png', nombre: 'Río Nuevo' },
  { url: '/distritos/paramo', img: 'Distrito-10.png', nombre: 'Páramo' },
  { url: '/distritos/laamistad', img: 'Distrito-12.png', nombre: 'La Amistad' },
];

export default function DistritosShowCase() {
  const { t } = useTranslation('global');

  return (
    <section className="app_screenshot_area mt_75" id="showcase">
      <div className="container custom_container p0">
        <Sectitle
          sClass="sec_title text-center mb_70"
          Title={t('home.districts')}
          tClass="t_color3 mb_20"
          TitleP={t('home.districts_description')}
        />
        <div className="app_screen_info">
          <Carrusel className="app_screenshot_slider" opciones={opcionesSlider(5, 3, 2, 1)}>
            {DISTRITOS.map((distrito) => (
              <div className="item" key={distrito.url}>
                <div className="screenshot_img">
                  <Link href={distrito.url} className="image-link">
                    <img src={`/img/distritos/${distrito.img}`} alt={distrito.nombre} />
                  </Link>
                </div>
              </div>
            ))}
          </Carrusel>
        </div>
      </div>
    </section>
  );
}
