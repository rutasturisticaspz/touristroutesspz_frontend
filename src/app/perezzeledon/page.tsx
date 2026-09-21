'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CustomNavbar from '../../components/CustomNavbar';
import FooterRutas from '../../components/Footer/FooterRutas';
import BannerDetalle from '../../components/Banner/BannerDetalle';
import Sectitle from '../../components/Title/Sectitle';
import TarjetasDistrito from '../../components/PerezZeledon/TarjetasDistrito';
import HitoHistorico from '../../components/PerezZeledon/HitoHistorico';
import BloqueInformativo from '../../components/PerezZeledon/BloqueInformativo';
import AtraccionesActionThree from '../../components/Atracciones/AtraccionesActionThree';

// Los cinco hitos de la línea de tiempo, con su foto y su ícono.
const HITOS = [
  {
    imagen: '1.jpg',
    icono: 'icon01.png',
    titulo: 'perez_zeledon.the_origin_of_the_canton',
    descripcion: 'perez_zeledon.origin_description',
  },
  {
    imagen: '2.jpg',
    icono: 'icon02.png',
    titulo: 'perez_zeledon.education_grows',
    descripcion: 'perez_zeledon.education_description',
  },
  {
    imagen: '3.jpg',
    icono: 'icon03.png',
    titulo: 'perez_zeledon.we_are_canton',
    descripcion: 'perez_zeledon.we_are_canton_description',
  },
  {
    imagen: '4.jpg',
    icono: 'icon04.png',
    titulo: 'perez_zeledon.the_first_municipality',
    descripcion: 'perez_zeledon.the_first_municipality_description',
  },
  {
    imagen: 'pz.jpg',
    icono: 'icon05.png',
    titulo: 'perez_zeledon.the_canton_continues_to_grow',
    descripcion: 'perez_zeledon.the_canton_continues_to_grow_description',
  },
];

// Los anclas del menú de la página.
const SECCIONES = [
  { ancla: 'pz_distritos', etiqueta: 'perez_zeledon.districts' },
  { ancla: 'pz_historia', etiqueta: 'perez_zeledon.history' },
  { ancla: 'pz_geologia', etiqueta: 'perez_zeledon.geological_features' },
  { ancla: 'pz_geografia', etiqueta: 'perez_zeledon.geographic_location' },
  { ancla: 'pz_florafauna', etiqueta: 'perez_zeledon.flora_and_fauna' },
];

export default function Pagina() {
  const { t } = useTranslation('global');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="body_wrapper">
      <CustomNavbar slogo="sticky_logo" mClass="menu_four" nClass="w_menu ml-auto mr-auto" />
      <BannerDetalle
        imagen="/img/distritos/pz.jpg"
        titulo="Pérez Zeledón"
        descripcion={t('perez_zeledon.description')}
      />

      <section className="mt_70">
        <div className="container">
          <div className="row pz-menu">
            {SECCIONES.map((seccion) => (
              <a key={seccion.ancla} href={`#${seccion.ancla}`} className="hosting_btn btn_hover">
                {t(seccion.etiqueta)}
              </a>
            ))}
          </div>
        </div>
      </section>

      <TarjetasDistrito id="pz_distritos" />

      <section className="process_area bg_color sec_pad" id="pz_historia">
        <div className="container">
          <Sectitle
            sClass="sec_title text-center"
            Title={t('perez_zeledon.history')}
            tClass="t_color3"
            TitleP={t('perez_zeledon.history_description')}
          />
          <div className="features_info">
            <img className="dot_img" src="/img/home4/divider.png" alt="" />
            {HITOS.map((hito, indice) => (
              <HitoHistorico
                key={hito.imagen}
                claseFila={indice % 2 === 0 ? 'row flex-row-reverse' : 'row'}
                claseTexto={indice % 2 === 0 ? 'pr_70 pl_70' : 'pl_100'}
                imagen={hito.imagen}
                icono={hito.icono}
                titulo={t(hito.titulo)}
                descripcion={t(hito.descripcion)}
              />
            ))}
            <div className="dot middle_dot">
              <span className="dot1" />
              <span className="dot2" />
            </div>
          </div>
        </div>
      </section>

      <BloqueInformativo
        titulo={t('perez_zeledon.biodiversity_of_perez_zeledon')}
        conRelleno={false}
        parrafos={[
          t('perez_zeledon.biodiversity_description1'),
          t('perez_zeledon.biodiversity_description2'),
          t('perez_zeledon.biodiversity_description3'),
          t('perez_zeledon.biodiversity_description4'),
          t('perez_zeledon.biodiversity_description5'),
        ]}
        creditos={t('perez_zeledon.biodiversity_credits')}
      />

      <BloqueInformativo
        id="pz_geologia"
        imagen="geologia.jpg"
        titulo={t('perez_zeledon.geological_features')}
        parrafos={[t('perez_zeledon.geological_features_description')]}
        creditos={t('perez_zeledon.geological_features_credits')}
      />

      <BloqueInformativo
        id="pz_geografia"
        imagen="geografia.png"
        titulo={t('perez_zeledon.geographic_location')}
        parrafos={[t('perez_zeledon.geographic_location_description')]}
        creditos={t('perez_zeledon.geographic_location_credits')}
      />

      <BloqueInformativo
        id="pz_florafauna"
        imagen="florafauna.jpg"
        titulo={t('perez_zeledon.flora_and_fauna')}
        parrafos={[t('perez_zeledon.flora_and_fauna_description')]}
        creditos={t('perez_zeledon.flora_and_fauna_credits')}
      />

      <AtraccionesActionThree />
      <FooterRutas />
    </div>
  );
}
