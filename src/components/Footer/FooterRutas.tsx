'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Reveal from '../Reveal';
import { useIdioma } from '../../context/IdiomaContext';
import { CONTACTO, SECCIONES, copywrite, copywriteEN } from './FooterData';

// Pie de página. Mismo marcado y mismas clases que el sitio actual.
export default function FooterRutas({ fClass = '' }: { fClass?: string }) {
  const { t } = useTranslation('global');
  const { esEspanol } = useIdioma();

  return (
    <footer className={`footer_area footer_area_four h_footer_dark ${fClass}`}>
      <div className="footer_top">
        <div className="container">
          <div className="row">
            <Reveal effect="fadeInLeft" duration={500} className="col-lg-3 col-sm-12">
              <div className="f_widget dark_widget company_widget">
                <div className="d-flex justify-content-start">
                  <Link href="/" className="f-logo">
                    <img style={{ height: '6vh' }} src="/img/logoRT.png" alt="Rutas Turísticas" />
                  </Link>
                  <Link href="/" className="f-logo">
                    <img style={{ height: '6vh' }} src="/img/logoVP.png" alt="Vení a Pérez" />
                  </Link>
                  <Link href="/" className="f-logo">
                    <img
                      style={{ height: '6vh' }}
                      src="/img/logoUNA.png"
                      alt="Universidad Nacional"
                    />
                  </Link>
                  <Link href="/" className="f-logo">
                    <img
                      style={{ height: '5vh' }}
                      src="/img/destinoAccesible.png"
                      alt="Destino accesible"
                    />
                  </Link>
                </div>

                <div className="widget-wrap">
                  <p className="f_400 f_p f_size_15 mb-0 l_height34">
                    <span>Email:</span>{' '}
                    <a href={`mailto:${CONTACTO.email}`} className="f_400">
                      {CONTACTO.email}
                    </a>
                  </p>
                  <p className="f_400 f_p f_size_15 mb-0 l_height34">
                    <span>Tel:</span>{' '}
                    <a href={`tel:${CONTACTO.telefonoEnlace}`} className="f_400">
                      (506) {CONTACTO.telefono}
                    </a>
                  </p>
                  <Link href="/contacto">
                    <button type="button" className="btn_hover">
                      {t('footer.i_want_to_be_on_the_page')}
                    </button>
                  </Link>
                </div>
              </div>
            </Reveal>

            {SECCIONES.map((widget) => (
              <Reveal
                key={widget.id}
                effect="fadeInLeft"
                duration={500}
                className="col-lg-3 col-sm-12"
              >
                <div className="f_widget dark_widget about-widget pl_70">
                  <h3 className="f-title f_500 t_color f_size_18 mb_40">
                    {esEspanol ? widget.title : widget.titleEN}
                  </h3>
                  <ul className="list-unstyled f_list">
                    {widget.menuItems.map((item) => (
                      <li key={item.id}>
                        <Link href={item.url}>{esEspanol ? item.text : item.textEN}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="row">
            <div className="col-lg-12 pt_120 text-center">
              <p className="f_size_12 text-justify">{t('footer.footer_description')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer_bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-6">
              <p className="mb-0 f_400">{esEspanol ? copywrite() : copywriteEN()}</p>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="f_social_icon_two text-right">
                <p>
                  {t('footer.developed_with_the')} <i className="icon_heart" />{' '}
                  {t('footer.by')}{' '}
                  <a
                    href="https://www.linkedin.com/in/pablove00/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pablo Venegas
                  </a>{' '}
                  y{' '}
                  <a
                    href="https://www.linkedin.com/in/luis-miguel-valverde-navarro-b1816b213/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Luis Valverde
                  </a>
                  .
                </p>
                <p>
                  {t('footer.academic')}:{' '}
                  <a
                    href="https://orcid.org/0000-0003-4317-3422"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Mag. Erick Madrigal Villanueva
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
