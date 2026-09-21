'use client';

import { useTranslation } from 'react-i18next';
import Reveal from '../Reveal';

// Banner de la página de eventos.
export default function BannerEventos() {
  const { t } = useTranslation('global');

  return (
    <section className="seo_home_area">
      <div className="home_bubble">
        <div className="bubble b_one" />
        <div className="bubble b_two" />
        <div className="bubble b_three" />
        <div className="bubble b_four" />
        <div className="bubble b_five" />
        <div className="bubble b_six" />
        <div className="triangle b_seven" data-parallax='{"x": 20, "y": 150}'>
          <img src="/img/seo/triangle_one.png" alt="" />
        </div>
        <div className="triangle b_nine">
          <img src="/img/seo/triangle_three.png" alt="" />
        </div>
      </div>
      <div className="banner_top">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center seo_banner_content">
              <Reveal effect="fadeInUp" duration={500}>
                <h2>
                  {t('events.events')}
                  <br />
                </h2>
              </Reveal>
              <Reveal effect="fadeInUp" duration={1000}>
                <p className="wow fadeInUp" data-wow-delay="0.5s">
                  {t('events.description')}
                </p>
              </Reveal>
            </div>
          </div>
          <div className="saas_home_img">
            <Reveal effect="fadeInUp" duration={1400}>
              <img src="/img/eventos/banner.png" alt="" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
