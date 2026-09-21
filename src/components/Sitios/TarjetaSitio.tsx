'use client';

import Link from 'next/link';
import { hrefContacto, iconoContacto, primeraImagen } from '../../lib/helpers';
import type { Sitio } from '../../lib/tipos';

// Tarjeta de un sitio, con los contactos al pasar el mouse.
// Reemplaza a AtraccionesCardItemOne / CardItemTwo y sus equivalentes
// en las otras cinco carpetas: eran el mismo componente repetido.
// Arreglo de camino: la tarjeta anterior enlazaba a
// `/sitio/atraccion/:id` en el título de arriba y a
// `/sitio/atracciones/:id` en el de abajo. El primero, en singular, no
// corresponde a ningún tipo, así que daba una página vacía.
export default function TarjetaSitio({
  sitio,
  tipoClave,
}: {
  sitio: Sitio;
  tipoClave: string;
}) {
  const destino = `/sitio/${tipoClave}/${sitio.id}`;
  const contactos = sitio.contactos ?? [];

  return (
    <div className="ex_team_item">
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
