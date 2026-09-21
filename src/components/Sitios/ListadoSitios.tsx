'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomNavbar from '../CustomNavbar';
import FooterRutas from '../Footer/FooterRutas';
import BannerSitio from '../Banner/BannerSitio';
import BuscadorSitio from './BuscadorSitio';
import TarjetaSitio from './TarjetaSitio';
import Sectitle from '../Title/Sectitle';
import Reveal from '../Reveal';
import AtraccionesActionThree from '../Atracciones/AtraccionesActionThree';
import { api } from '../../lib/api';
import { useIdioma } from '../../context/IdiomaContext';
import type { ConfigTipo } from '../../lib/tiposSitio';
import type { Sitio } from '../../lib/tipos';

// Página de listado, común a los seis tipos de sitio.
// En el proyecto anterior esto eran seis páginas —Atracciones.js,
// Hospedaje.js, Restaurantes.js…— con la misma estructura y distinto
// texto, cada una con sus propios componentes SectionOne, SectionTwo y
// CardSlider. Aquí es una sola, y el tipo entra como parámetro.
// Muestra sólo sitios CON imágenes, igual que antes: una tarjeta sin
// foto se ve rota.
export default function ListadoSitios({ tipo }: { tipo: ConfigTipo }) {
  const { t } = useTranslation('global');
  const { esEspanol } = useIdioma();
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    let vigente = true;

    api
      .conImagenes(tipo.api, { take: 24 })
      .then((pagina) => {
        if (!vigente) return;
        setSitios(pagina.datos);
        setCargando(false);
      })
      .catch((problema) => {
        if (!vigente) return;
        console.error(`No se pudieron leer los sitios de ${tipo.api}:`, problema);
        setError(String(problema instanceof Error ? problema.message : problema));
        setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, [tipo.api]);

  return (
    <div className="body_wrapper">
      <CustomNavbar cClass="custom_container p0" />
      <BannerSitio tipo={tipo} />
      <BuscadorSitio tipo={tipo} />

      <section className="atracciones_section_cards_one_area sec_pad">
        <div className="container">
          <Sectitle
            sClass="atracciones_section_cards_one_title text-center"
            Title={t('attractions.perez_zeledón_is_waiting_for_you')}
            TitleP={t('attractions.hundreds_of_attractions')}
          />

          {cargando && <p className="text-center f_400">…</p>}

          {error && (
            <p className="text-center f_400">
              {esEspanol
                ? 'No se pudo cargar la información. Intentá de nuevo más tarde.'
                : 'The information could not be loaded. Please try again later.'}
            </p>
          )}

          {!cargando && !error && sitios.length === 0 && (
            <p className="text-center f_400">
              {esEspanol ? 'Todavía no hay nada publicado aquí.' : 'Nothing published here yet.'}
            </p>
          )}

          <Reveal effect="fadeInUp">
            <div className="row">
              {sitios.map((sitio) => (
                <div className="col-lg-3 col-sm-6" key={sitio.id}>
                  <TarjetaSitio sitio={sitio} tipoClave={tipo.clave} />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <AtraccionesActionThree />
      <FooterRutas />
    </div>
  );
}
