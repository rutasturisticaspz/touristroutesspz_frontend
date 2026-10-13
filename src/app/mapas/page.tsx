'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomNavbar from '../../components/CustomNavbar';
import FooterRutas from '../../components/Footer/FooterRutas';
import BannerDetalle from '../../components/Banner/BannerDetalle';
import Reveal from '../../components/Reveal';
import { api } from '../../lib/api';
import type { Mapa } from '../../lib/tipos';

const IMAGEN_DE_RESPALDO = '/img/logoRT.png';
const MAPAS_POR_FILA = 2;

// /mapas — the downloadable maps.
// The list is managed by the panel (/admin/mapas): each map is a name
// and the link of the file on Drive.
export default function Pagina() {
  const { t } = useTranslation('global');
  const [mapas, setMapas] = useState<Mapa[]>([]);
  const [estado, setEstado] = useState<'cargando' | 'listo' | 'error'>('cargando');

  useEffect(() => {
    window.scrollTo(0, 0);
    let vigente = true;
    api
      .mapas()
      .then((pagina) => {
        if (!vigente) return;
        setMapas(pagina.datos);
        setEstado('listo');
      })
      .catch(() => vigente && setEstado('error'));
    return () => {
      vigente = false;
    };
  }, []);

  return (
    <div className="body_wrapper">
      <CustomNavbar mClass="menu_four" slogo="sticky_logo" nClass="w_menu custom_container p0" />
      <BannerDetalle titulo={t('maps.maps_title')} descripcion={t('maps.maps_description')} />

      <section className="contact_info_area mb_60 bg_color">
        <div className="container">
          {estado === 'error' && <p className="text-center mt_75">{t('maps.error')}</p>}
          {estado === 'listo' && mapas.length === 0 && (
            <p className="text-center mt_75">{t('maps.empty')}</p>
          )}

          {agruparEnFilas(mapas).map((fila) => (
            <div className="mapas_featured_item row" key={fila[0].id}>
              {fila.map((mapa) => (
                <ItemMapa key={mapa.id} mapa={mapa} rotulo={t('maps.see_map')} />
              ))}
            </div>
          ))}
        </div>
      </section>

      <FooterRutas />
    </div>
  );
}

function agruparEnFilas(mapas: Mapa[]): Mapa[][] {
  const filas: Mapa[][] = [];
  for (let i = 0; i < mapas.length; i += MAPAS_POR_FILA) {
    filas.push(mapas.slice(i, i + MAPAS_POR_FILA));
  }
  return filas;
}

function ItemMapa({ mapa, rotulo }: { mapa: Mapa; rotulo: string }) {
  return (
    <>
      <div className="col-lg-4 mt_75">
        <Reveal effect="fadeInLeft">
          <div className="agency_featured_img text-center">
            <img
              src={mapa.miniatura ?? IMAGEN_DE_RESPALDO}
              alt={mapa.nombre}
              referrerPolicy="no-referrer"
              onError={(evento) => {
                if (!evento.currentTarget.src.endsWith(IMAGEN_DE_RESPALDO)) {
                  evento.currentTarget.src = IMAGEN_DE_RESPALDO;
                }
              }}
            />
          </div>
        </Reveal>
      </div>
      <div className="col-lg-2">
        <div className="agency_featured_content wow fadeInLeft" data-wow-delay="0.6s">
          <Reveal effect="fadeInRight">
            <h3>{mapa.nombre}</h3>
            <a
              href={mapa.enlace}
              className="mapa_item_btn"
              target="_blank"
              rel="noopener noreferrer"
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
