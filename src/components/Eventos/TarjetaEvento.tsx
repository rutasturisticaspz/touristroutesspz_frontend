'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { primeraImagen, rangoFechas } from '../../lib/helpers';
import { useIdioma } from '../../context/IdiomaContext';
import type { Evento } from '../../lib/tipos';

// Tarjeta grande de evento, para la página /eventos.
// La del sitio anterior enlazaba la foto a /eventos/evento/:id y el
// título a /evento/:id. La primera no correspondía a ninguna ruta, así
// que hacer clic en la foto llevaba a la página de error.
export default function TarjetaEvento({ evento }: { evento: Evento }) {
  const { t } = useTranslation('global');
  const { esEspanol } = useIdioma();

  const destino = `/evento/${evento.id}`;
  const nombre = (esEspanol ? evento.nombre : evento.nombreIngles) || evento.nombre;
  const descripcion =
    (esEspanol ? evento.descripcion : evento.descripcionIngles) || evento.descripcion;
  const fechas = rangoFechas(evento.fechaInicio, evento.fechaFin);

  return (
    <div className="col-sm-6">
      <div className="h_blog_item">
        <Link href={destino}>
          <img src={primeraImagen(evento)} alt={nombre} />
        </Link>
        <div className="h_blog_content">
          {evento.ubicacion?.distrito && (
            <span className="post_time">
              <i className="icon_pin_alt" />
              {evento.ubicacion.distrito}
            </span>
          )}
          <Link href={destino}>
            <h3>{nombre}</h3>
          </Link>
          <div className="post-info-bottom">
            <span className="post_time">{descripcion}</span>
          </div>
          {fechas && (
            <div>
              <span className="post_time" style={{ fontWeight: 'bold' }}>
                {esEspanol ? 'Fecha: ' : 'Date: '}
              </span>
              <span>{fechas}</span>
            </div>
          )}
          <div className="post-info-bottom">
            <Link href={destino} className="learn_btn_two">
              {t('events.see_event')}
              <i className="arrow_right" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
