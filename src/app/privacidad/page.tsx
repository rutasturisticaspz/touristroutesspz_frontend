'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CustomNavbar from '../../components/CustomNavbar';
import FooterRutas from '../../components/Footer/FooterRutas';
import BannerDetalle from '../../components/Banner/BannerDetalle';
import { CONTACTOS } from '../../lib/contactos';

const SECCIONES = ['site', 'data', 'use', 'email', 'sharing'] as const;

export default function Pagina() {
  const { t } = useTranslation('global');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="body_wrapper">
      <CustomNavbar mClass="menu_four" slogo="sticky_logo" nClass="w_menu custom_container p0" />
      <BannerDetalle
        titulo={t('privacy.privacy_title')}
        descripcion={t('privacy.privacy_description')}
      />

      <section className="contact_info_area sec_pad bg_color">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              {SECCIONES.map((seccion) => (
                <div key={seccion} className="mb_40">
                  <h2 className="f_p f_size_22 t_color3 f_600 l_height28 mb_20">
                    {t(`privacy.${seccion}_title`)}
                  </h2>
                  <p className="f_400 f_size_15 l_height28">{t(`privacy.${seccion}_text`)}</p>
                </div>
              ))}

              <div className="mb_40">
                <h2 className="f_p f_size_22 t_color3 f_600 l_height28 mb_20">
                  {t('privacy.rights_title')}
                </h2>
                <p className="f_400 f_size_15 l_height28">{t('privacy.rights_text')}</p>
                <p className="f_400 f_size_15">
                  <span className="f_400 t_color3">Email:</span>{' '}
                  <a href={`mailto:${CONTACTOS.correo}`}>{CONTACTOS.correo}</a>
                </p>
                <p className="f_400 f_size_15">
                  <span className="f_400 t_color3">{t('contact.phone')}:</span>{' '}
                  <a href={CONTACTOS.telefonoLlamada}>{CONTACTOS.telefono}</a>
                </p>
              </div>

              <p className="f_400 f_size_15 t_color3">
                {t('privacy.updated_label')}: {t('privacy.updated_value')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <FooterRutas />
    </div>
  );
}
