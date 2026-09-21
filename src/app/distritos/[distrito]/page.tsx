'use client';

import { notFound, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CustomNavbar from '../../../components/CustomNavbar';
import FooterRutas from '../../../components/Footer/FooterRutas';
import BannerDetalle from '../../../components/Banner/BannerDetalle';
import VideoYoutube from '../../../components/Distritos/VideoYoutube';
import SitiosDelDistrito, {
  TIPOS_EN_DISTRITO,
} from '../../../components/Distritos/SitiosDelDistrito';
import { fichaPorSlug } from '../../../lib/datosDistritos';
import { useIdioma } from '../../../context/IdiomaContext';

// /distritos/:slug — la ficha de un distrito.
// La búsqueda de sitios usa el nombre sin acentos, porque así están
// escritos los distritos en la tabla de ubicaciones.
export default function Pagina() {
  const parametros = useParams<{ distrito: string }>();
  const ficha = fichaPorSlug(parametros?.distrito);
  if (!ficha) notFound();

  const { t } = useTranslation('global');
  const { esEspanol } = useIdioma();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [ficha.id]);

  const sinAcentos = ficha.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const resena = esEspanol ? ficha.descripcionES : ficha.descripcionEN;

  return (
    <div className="body_wrapper">
      <CustomNavbar slogo="sticky_logo" mClass="menu_four" nClass="w_menu ml-auto mr-auto" />
      <BannerDetalle imagen="/img/distritos/pz.jpg" titulo={ficha.nombre} />

      <section className="service_details_area sec_pad">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 pr_70">
              <div className="job_info">
                <div className="info_head">
                  <img src={`/img/distritos/escudos/${ficha.id}.jpeg`} alt={ficha.nombre} />
                  <h6 className="f_p f_600 f_size_18 t_color3">{ficha.nombre}</h6>
                </div>
                <div className="info_item">
                  <h6>{t('districts.zip_code')}</h6>
                  <p>{ficha.codigoPostal}</p>
                </div>
                {ficha.poblacion !== -1 && (
                  <div className="info_item">
                    <h6>{t('districts.population')}</h6>
                    <p>
                      {ficha.poblacion.toLocaleString('es-CR')}
                      {t('districts.inhabitants')}
                    </p>
                  </div>
                )}
                {ficha.territorio !== -1 && (
                  <div className="info_item">
                    <h6>{t('districts.territory')}</h6>
                    <p>
                      {ficha.territorio} km<sup>2</sup>
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-7">
              <div className="details_content">
                <div className="sec_title">
                  <p className="subtitle">{t('districts.historical_review')}</p>
                  <p className="f_400 f_size_15 text-justify">{resena}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12 mt_70 mb_70">
              <VideoYoutube url={ficha.urlVideo} titulo={ficha.nombre} />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              {TIPOS_EN_DISTRITO.map(({ tipo, titulo }) => (
                <SitiosDelDistrito
                  key={tipo.clave}
                  tipo={tipo}
                  distrito={sinAcentos}
                  titulo={titulo}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <FooterRutas />
    </div>
  );
}
