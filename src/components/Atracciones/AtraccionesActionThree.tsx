'use client';

import { useTranslation } from 'react-i18next';

export default function AtraccionesActionThree() {
  const { t } = useTranslation('global');

  return (
    <section className="atracciones_action_three_area">
      <div className="container">
        <div className="erp_action_content text-center">
          <img src="/img/atracciones/feliz.png" alt="" />
          <h3>{t('home.give_to_yourself_the_opportunity')}</h3>
          <p>
            <span>{t('home.come_to_perez')}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
