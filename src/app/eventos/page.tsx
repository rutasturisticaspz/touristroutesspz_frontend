'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomNavbar from '../../components/CustomNavbar';
import FooterRutas from '../../components/Footer/FooterRutas';
import BannerEventos from '../../components/Banner/BannerEventos';
import TarjetaEvento from '../../components/Eventos/TarjetaEvento';
import AtraccionesActionThree from '../../components/Atracciones/AtraccionesActionThree';
import Sectitle from '../../components/Title/Sectitle';
import { api } from '../../lib/api';
import { useIdioma } from '../../context/IdiomaContext';
import type { Evento } from '../../lib/tipos';

// /eventos — todos los eventos.
// El original pedía `take=9999999` para traerlos todos de un golpe.
// Aquí se piden 100, que es más que los que hay y no obliga a la base
// a preparar un lote absurdo.
export default function Pagina() {
  const { t } = useTranslation('global');
  const { esEspanol } = useIdioma();
  const [eventos, setEventos] = useState<Evento[]>([]);
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

    return () => {
      vigente = false;
    };
  }, []);

  return (
    <div className="body_wrapper">
      <CustomNavbar cClass="custom_container p0" />
      <BannerEventos />

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
