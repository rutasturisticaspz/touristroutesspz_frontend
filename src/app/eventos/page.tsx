'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomNavbar from '../../components/CustomNavbar';
import FooterRutas from '../../components/Footer/FooterRutas';
import BannerEventos from '../../components/Banner/BannerEventos';
import TarjetaEvento from '../../components/Eventos/TarjetaEvento';
import AtraccionesActionThree from '../../components/Atracciones/AtraccionesActionThree';
import Sectitle from '../../components/Title/Sectitle';
import { MAX_FOTOS_COLLAGE, type FotoCollage } from '../../components/Banner/CollageInteractivo';
import { api } from '../../lib/api';
import { primeraImagen } from '../../lib/helpers';
import { esNuevo } from '../../lib/nuevos';
import { useIdioma } from '../../context/IdiomaContext';
import type { Evento } from '../../lib/tipos';

// Enough recent events to find a few with a photo for the collage.
const EVENTOS_PARA_COLLAGE = 30;

// /eventos — all the events.
// The original requested `take=9999999` to fetch them all in one go.
// Here 100 are requested, which is more than there are and does not
// force the database to prepare an absurd batch.
export default function Pagina() {
  const { t } = useTranslation('global');
  const { esEspanol } = useIdioma();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [recientes, setRecientes] = useState<Evento[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    let vigente = true;

    api
      .listar('eventos', { take: 100, ordenarPor: 'fechaInicio', direccion: 'desc' })
      .then((pagina) => vigente && setEventos(pagina.datos as Evento[]))
      .catch((error) => console.error('No se pudieron leer los eventos:', error))
      .finally(() => {
        if (vigente) setCargando(false);
      });

    // A second, small request: the newest created, not the newest by date.
    api
      .listar('eventos', { take: EVENTOS_PARA_COLLAGE, ordenarPor: 'createdAt', direccion: 'desc' })
      .then((pagina) => vigente && setRecientes(pagina.datos as Evento[]))
      .catch((error) => console.error('No se pudieron leer los eventos recientes:', error));

    return () => {
      vigente = false;
    };
  }, []);

  // Photos for the banner collage: the most recently created events that
  // have a picture, whatever their date.
  const fotos = useMemo<FotoCollage[]>(
    () =>
      recientes
        .filter((evento) => evento.imagenes?.length > 0)
        .slice(0, MAX_FOTOS_COLLAGE)
        .map((evento) => ({
          id: evento.id,
          url: primeraImagen(evento),
          nombre: (esEspanol ? evento.nombre : evento.nombreIngles) || evento.nombre,
          href: `/evento/${evento.id}`,
          nuevo: esNuevo(evento.createdAt),
        })),
    [recientes, esEspanol],
  );

  return (
    <div className="body_wrapper">
      <CustomNavbar cClass="custom_container p0" />
      <BannerEventos fotos={fotos} />

      <section className="h_blog_area sec_pad">
        <div className="container">
          <Sectitle
            Title={t('events.section_card_title')}
            TitleP=""
            sClass="hosting_title text-center"
          />
          {cargando && <p className="text-center f_400">…</p>}
          {!cargando && eventos.length === 0 && (
            <p className="text-center f_400">
              {esEspanol ? 'Por ahora no hay eventos publicados.' : 'No events published yet.'}
            </p>
          )}
          <div className="row">
            {eventos.map((evento) => (
              <TarjetaEvento key={evento.id} evento={evento} />
            ))}
          </div>
        </div>
      </section>

      <AtraccionesActionThree />
      <FooterRutas />
    </div>
  );
}
