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

// Los próximos eventos en la portada.
// El componente anterior hacía `a.imagenes[0].url` sin comprobar nada:
// un evento sin fotos tumbaba la portada entera. Aquí se usa el
// marcador de posición, igual que en el resto del sitio.
export default function HomeEventos() {
  const { t } = useTranslation('global');
  const { esEspanol } = useIdioma();
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    let vigente = true;
    api
      .listar('eventos', { take: 5, ordenarPor: 'fechaInicio', direccion: 'desc' })
      .then((pagina) => {
        if (vigente) setEventos(pagina.datos as Evento[]);
      })
      .catch((error) => console.error('No se pudieron leer los eventos:', error));
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
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
