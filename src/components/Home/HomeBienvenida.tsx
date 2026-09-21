'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

// Bienvenida con el video de YouTube.
// El sitio anterior usaba react-player sólo para esto. Se reemplaza por
// el iframe propio de YouTube: se ve igual y son 300 KB menos de
// dependencias que mantener.
export default function HomeBienvenida() {
  const { t } = useTranslation('global');

  return (
    <section className="event_about_area">
      <div className="container">
        <div className="row align-items-center flex-row-reverse">
          <div className="col-lg-6">
            <div className="event_about_img">
              <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  title={t('home.welcome')}
                  src="https://www.youtube.com/embed/YETNzIqQ6eU?autoplay=1&mute=1"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="event_about_content">
              <h2 className="wow fadeInUp">{t('home.welcome')}</h2>
              <p className="wow fadeInUp" data-wow-delay="0.2s">
                {t('home.welcome_description')}
              </p>
              <div className="row">
                <div className="col">
                  <div className="event_about_item wow fadeInUp" data-wow-delay="0.2s">
                    <Link
                      href="/buscar/atracciones/Todos/Todos/1/Todos/Todos"
                      className="hosting_btn btn_hover text-center"
                      style={{ width: '100%' }}
                    >
                      {t('home.discover_perez')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
