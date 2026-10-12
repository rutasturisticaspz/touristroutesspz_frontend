'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomNavbar from '../CustomNavbar';
import FooterRutas from '../Footer/FooterRutas';
import BannerSitio from '../Banner/BannerSitio';
import BuscadorSitio from './BuscadorSitio';
import TarjetaSitio from './TarjetaSitio';
import Sectitle from '../Title/Sectitle';
import Reveal from '../Reveal';
import AtraccionesActionThree from '../Atracciones/AtraccionesActionThree';
import { MAX_FOTOS_COLLAGE, type FotoCollage } from '../Banner/CollageInteractivo';
import { api } from '../../lib/api';
import { primeraImagen } from '../../lib/helpers';
import { DIAS_COMO_NUEVO, esNuevo } from '../../lib/nuevos';
import { useIdioma } from '../../context/IdiomaContext';
import type { ConfigTipo } from '../../lib/tiposSitio';
import type { Sitio } from '../../lib/tipos';

// List page, common to the six site types.
// In the previous project these were six pages —Atracciones.js,
// Hospedaje.js, Restaurantes.js…— with the same structure and
// different text, each with its own SectionOne, SectionTwo and
// CardSlider components. Here it is a single one, and the type comes
// in as a parameter.
// It shows only sites WITH images, same as before: a card without a
// photo looks broken. The recently created ones go first and carry a
// "New" ribbon.
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
      .conImagenes(tipo.api, { take: 24, nuevos: DIAS_COMO_NUEVO })
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

  // The collage uses the first photos of the list, so what is new shows up
  // there too.
  const fotos = useMemo<FotoCollage[]>(
    () =>
      sitios.slice(0, MAX_FOTOS_COLLAGE).map((sitio) => ({
        id: sitio.id,
        url: primeraImagen(sitio),
        nombre: sitio.nombre,
        href: `/sitio/${tipo.clave}/${sitio.id}`,
        nuevo: esNuevo(sitio.createdAt),
      })),
    [sitios, tipo.clave],
  );

  return (
    <div className="body_wrapper">
      <CustomNavbar cClass="custom_container p0" />
      <BannerSitio tipo={tipo} fotos={fotos} />
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
