'use client';

import Link from 'next/link';
import { hrefContacto, iconoContacto } from '../../lib/helpers';
import EtiquetaNuevo from '../Nuevo/EtiquetaNuevo';
import { esNuevo } from '../../lib/nuevos';
import type { Contacto } from '../../lib/tipos';

// Event card. Same markup as the previous site, but the whole card is a
// link to the event; the contact icons stay clickable on top.
export default function EventosCardItemOne({
  img,
  nombre,
  distrito,
  id,
  fecha,
  contactos = [],
  creadoEn,
}: {
  img: string;
  nombre: string;
  distrito?: string | null;
  id: number;
  fecha: string;
  contactos?: Contacto[];
  // Creation date, to mark the card as new.
  creadoEn?: string;
}) {
  const nuevo = esNuevo(creadoEn);

  return (
    <div className="ex_team_item">
      {nuevo && <EtiquetaNuevo />}
      <Link href={`/evento/${id}`} className="rt_tarjeta_enlace" tabIndex={-1} aria-hidden="true" />
      <img src={img} alt={nombre} />
      <div className="team_content">
        <Link href={`/evento/${id}`}>
          <h3 className="f_p f_size_16 f_600 t_color3">{nombre}</h3>
        </Link>
        <h5>{fecha}</h5>
      </div>
      <div className="hover_content">
        <div className="n_hover_content">
          {contactos.length > 0 && (
            <ul className="list-unstyled">
              {contactos.map((contacto) => (
                <li key={contacto.id}>
                  <a href={hrefContacto(contacto)}>
                    <i className={iconoContacto(contacto.tipo)} />
                  </a>
                </li>
              ))}
            </ul>
          )}
          <div className="br" />
          <Link href={`/evento/${id}`}>
            <h3 className="f_p f_size_16 f_600 w_color">{nombre}</h3>
          </Link>
          <h5>{distrito}</h5>
          <h5>{fecha}</h5>
        </div>
      </div>
    </div>
  );
}
