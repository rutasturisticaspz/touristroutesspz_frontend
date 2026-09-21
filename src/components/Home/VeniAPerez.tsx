'use client';

import { useTranslation } from 'react-i18next';
import Reveal from '../Reveal';

export default function VeniAPerez() {
  const { t } = useTranslation('global');

  return (
    <section className="seo_features_one sec_pad">
      <div className="container">
        <div className="row flex-row-reverse">
          <div className="col-lg-6">
            <Reveal effect="fadeInUp">
              <div className="seo_features_content">
                <h2>{t('home.come_to_perez_campaign')}</h2>
                <p className="text-justify">
                  <strong>{t('home.come_to_perez')}</strong>
                  {t('home.come_to_perez_description')}
                  <strong>{t('home.come_to_perez_description_more')}</strong>
                  #VeníAPérez
                </p>
                <a
                  href="https://www.facebook.com/Ven%C3%AD-a-P%C3%A9rez-275542344247300"
                  style={{ alignItems: 'center' }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mapa_item_btn"
                >
                  <i className="ti-facebook" />
                  {t('home.visit')}
                </a>
              </div>
            </Reveal>
          </div>
          <div className="col-lg-6">
            <div className="seo_features_img">
              <img src="/img/home/veniaperez.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
