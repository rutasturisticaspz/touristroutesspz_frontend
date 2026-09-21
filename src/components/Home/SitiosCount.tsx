'use client';

import { useTranslation } from 'react-i18next';
import Cantidades from './Cantidades';

export default function SitiosCount() {
  const { t } = useTranslation('global');

  return (
    <section className="event_counter_area">
      <div className="container ocultar-div">
        <div className="row align-items-center">
          <div className="col-lg-12">
            <div className="event_text wow fadeInLeft">
              <h3>
                {t('home.en')} <span>Pérez Zeledón</span>
                {t('home.offers_to_you')}
              </h3>
            </div>
            <div className="event_countdown wow fadeInRight">
              <div className="event_counter">
                <Cantidades />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
