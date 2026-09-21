'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function Contactanos() {
  const { t } = useTranslation('global');

  return (
    <section className="erp_action_area mt_130 mb_70">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-4 col-md-4">
            <img src="/img/resources/contactanos.png" alt="" />
          </div>
          <div className="col-lg-8 col-md-8">
            <div className="erp_content">
              <h2>{t('home.contact_us_description')}</h2>
            </div>
            <Link href="/contacto" className="hosting_btn btn_hover">
              {t('home.contact_us')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
