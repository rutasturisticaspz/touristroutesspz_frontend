'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CustomNavbar from '../../components/CustomNavbar';
import FooterRutas from '../../components/Footer/FooterRutas';
import BannerDetalle from '../../components/Banner/BannerDetalle';
import Reveal from '../../components/Reveal';
import { MAPAS, MAPAS_SON_EXTERNOS, enlaceMapa } from '../../lib/mapas';

// /mapas — los mapas descargables.
// El original tenía los catorce escritos a mano en pares dentro de
// siete filas. Aquí salen de la tabla de lib/mapas.ts, que es también
// donde queda documentado que los archivos hay que moverlos del Drive
// personal a un servidor de la U.
export default function Pagina() {
  const { t } = useTranslation('global');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="body_wrapper">
      <CustomNavbar mClass="menu_four" slogo="sticky_logo" nClass="w_menu custom_container p0" />
      <BannerDetalle titulo={t('maps.maps_title')} descripcion={t('maps.maps_description')} />

      <section className="contact_info_area mb_60 bg_color">
        <div className="container">
          {MAPAS.map((mapa, indice) =>
            indice % 2 === 0 ? (
              <div className="mapas_featured_item row" key={mapa.archivo}>
                {[mapa, MAPAS[indice + 1]].filter(Boolean).map((m) => (
                  <ItemMapa key={m.archivo} mapa={m} rotulo={t('maps.see_map')} />
                ))}
              </div>
            ) : null,
          )}
        </div>
      </section>

      <FooterRutas />
    </div>
  );
}

function ItemMapa({
  mapa,
  rotulo,
}: {
  mapa: (typeof MAPAS)[number];
  rotulo: string;
}) {
  return (
    <>
      <div className="col-lg-4 mt_75">
        <Reveal effect="fadeInLeft">
          <div className="agency_featured_img text-center">
            <img src={`/img/mapas/${mapa.imagen}`} alt={mapa.titulo} />
          </div>
        </Reveal>
      </div>
      <div className="col-lg-2">
        <div className="agency_featured_content wow fadeInLeft" data-wow-delay="0.6s">
          <Reveal effect="fadeInRight">
            <h3>{mapa.titulo}</h3>
            <a
              href={enlaceMapa(mapa)}
              className="mapa_item_btn"
              {...(MAPAS_SON_EXTERNOS
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : { download: mapa.archivo })}
            >
              {rotulo}
              <i className="arrow_right" />
            </a>
          </Reveal>
        </div>
      </div>
    </>
  );
}
