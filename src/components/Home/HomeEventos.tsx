'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sectitle from '../Title/Sectitle';
import EventosCardItemOne from '../Eventos/EventosCardItemOne';
import { api } from '../../lib/api';
import { primeraImagen, rangoFechas } from '../../lib/helpers';
import { useIdioma } from '../../context/IdiomaContext';
import type { Evento } from '../../lib/tipos';

const EVENTOS_EN_PORTADA = 4;

// The upcoming events on the home page: only those that have not
// passed yet, from the nearest to the farthest.
// The previous component did `a.imagenes[0].url` without checking
// anything: an event without photos took down the whole home page.
// Here the placeholder is used, as in the rest of the site.
export default function HomeEventos() {
  const { t } = useTranslation('global');
  const { esEspanol } = useIdioma();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [estado, setEstado] = useState<'cargando' | 'listo' | 'error'>('cargando');

  useEffect(() => {
    let vigente = true;
    api
      .listar('eventos', {
        proximos: true,
        take: EVENTOS_EN_PORTADA,
        ordenarPor: 'fechaInicio',
        direccion: 'asc',
      })
      .then((pagina) => {
        if (!vigente) return;
        setEventos(pagina.datos as Evento[]);
        setEstado('listo');
      })
      .catch((error) => {
        console.error('No se pudieron leer los eventos:', error);
        if (vigente) setEstado('error');
      });
    return () => {
      vigente = false;
    };
  }, []);

  return (
    <section className="app_screenshot_area mt_75">
      <div className="container">
        <Sectitle
          sClass="atracciones_section_cards_one_title text-center align-middle"
          Title={t('events.events')}
          TitleP={t('events.come')}
        />
        <div className="row justify-content-center">
          <div className="col text-center">
            <div className="event_about_item wow fadeInUp" data-wow-delay="0.2s">
              <Link href="/eventos" className="hosting_btn btn_hover text-center">
                {t('events.see_all')}
              </Link>
            </div>
          </div>
        </div>
        {estado === 'listo' && eventos.length === 0 && (
          <p className="text-center mt_30">{t('events.none_upcoming')}</p>
        )}
        {estado === 'error' && <p className="text-center mt_30">{t('events.load_error')}</p>}
        <div className="row justify-content-center mt_30">
          {eventos.map((evento) => (
            <div className="col-lg-3 col-sm-6" key={evento.id}>
              <EventosCardItemOne
                id={evento.id}
                img={primeraImagen(evento)}
                nombre={esEspanol ? evento.nombre : evento.nombreIngles || evento.nombre}
                distrito={evento.ubicacion?.distrito}
                fecha={rangoFechas(evento.fechaInicio, evento.fechaFin)}
                contactos={evento.contactos}
                creadoEn={evento.createdAt}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
