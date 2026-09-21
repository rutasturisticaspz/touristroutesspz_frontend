'use client';

import { useTranslation } from 'react-i18next';
import Sectitle from '../Title/Sectitle';

// Mapa general del cantón.
// Es el iframe público de Google Maps, que no necesita llave. Los mapas
// que sí la necesitan —los de cada sitio— son otra cosa y van con la
// llave institucional.
const MAPA_PEREZ =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d503954.7706460622!2d-83.98571650160025!3d9.320271705449734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa14e24f4b4979b%3A0x579ba03c05e588ff!2zU2FuIEpvc8OpLCBQw6lyZXogWmVsZWTDs24!5e0!3m2!1ses-419!2scr!4v1648492440979!5m2!1ses-419!2scr';

export default function HomeMapa() {
  const { t } = useTranslation('global');

  return (
    <section className="app_screenshot_area sec_pad mb_70">
      <div className="container custom_container p0">
        <Sectitle
          sClass="sec_title text-center mb_70"
          Title={t('home.location')}
          tClass="t_color3 mb_20"
        />
        <div className="event_promotion_inner">
          <div className="event_img">
            <div style={{ height: '100vh', width: '100%' }}>
              <iframe
                title="Mapa de Pérez Zeledón"
                src={MAPA_PEREZ}
                width="100%"
                height="100%"
                loading="lazy"
                style={{ border: 0 }}
              />
            </div>
          </div>
          <div className="row event_promotion_info align-items-center">
            <div className="col-md-5">
              <div className="e_promo_text wow fadeInDown">
                <p className="text-justify">{t('home.location_description')}</p>
              </div>
            </div>
            <div className="col-md-6" />
          </div>
        </div>
      </div>
    </section>
  );
}
