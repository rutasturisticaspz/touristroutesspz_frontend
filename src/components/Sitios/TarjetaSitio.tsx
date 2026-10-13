'use client';

import Link from 'next/link';
import { hrefContacto, iconoContacto, primeraImagen } from '../../lib/helpers';
import EtiquetaNuevo from '../Nuevo/EtiquetaNuevo';
import { esNuevo } from '../../lib/nuevos';
import type { Sitio } from '../../lib/tipos';

// Card of a site, with the contacts on mouse hover. The whole card is a
// link to the detail page; the contact icons stay clickable on top.
// Replaces AtraccionesCardItemOne / CardItemTwo and their equivalents
// in the other five folders: they were the same component repeated.
// Fix along the way: the previous card linked to
// `/sitio/atraccion/:id` in the top title and to
// `/sitio/atracciones/:id` in the bottom one. The first, in the
// singular, does not correspond to any type, so it gave an empty page.
export default function TarjetaSitio({
  sitio,
  tipoClave,
}: {
  sitio: Sitio;
  tipoClave: string;
}) {
  const destino = `/sitio/${tipoClave}/${sitio.id}`;
  const contactos = sitio.contactos ?? [];
  const nuevo = esNuevo(sitio.createdAt);

  return (
    <div className="ex_team_item">
      {nuevo && <EtiquetaNuevo />}
      <Link href={destino} className="rt_tarjeta_enlace" tabIndex={-1} aria-hidden="true" />
      <img src={primeraImagen(sitio)} alt={sitio.nombre} />
      <div className="team_content">
        <Link href={destino}>
          <h3 className="f_p f_size_16 f_600 t_color3">{sitio.nombre}</h3>
        </Link>
        <h5>{sitio.ubicacion?.distrito}</h5>
      </div>
      <div className="hover_content">
        <div className="n_hover_content">
          {contactos.length > 0 && (
            <ul className="list-unstyled">
              {contactos.map((contacto) => (
                <li key={contacto.id}>
                  <a href={hrefContacto(contacto)} target="_blank" rel="noopener noreferrer">
                    <i className={iconoContacto(contacto.tipo)} />
                  </a>
                </li>
              ))}
            </ul>
          )}
          <div className="br" />
          <Link href={destino}>
            <h3 className="f_p f_size_16 f_600 w_color">{sitio.nombre}</h3>
          </Link>
          <h5>{sitio.ubicacion?.distrito}</h5>
        </div>
      </div>
    </div>
  );
}
