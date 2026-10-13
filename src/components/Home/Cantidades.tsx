'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../lib/api';
import '../../styles/cantidades.css';

// The six circles with the number of sites of each type.
// NOTE on the change of shape: the previous API returned
//     { "atracciones": [ { "count": 124 } ], "rentacars": [ ... ] }
// and the component read it as `counts?.[key]?.[0]?.count || 0`. That
// `|| 0` hid any error: if the response changed, the home page showed
// six zeros without warning. The new backend returns plain numbers and
// the keys changed (`rentacars` → `rentadoras`).

const TIPOS = [
  { href: '/atracciones', clave: 'atracciones', etiqueta: 'attractions', caja: 'one' },
  { href: '/hospedaje', clave: 'hoteles', etiqueta: 'lodgings', caja: 'five' },
  { href: '/restaurantes', clave: 'restaurantes', etiqueta: 'restaurants', caja: 'two' },
  {
    href: '/operadores-turisticos',
    clave: 'operadores',
    etiqueta: 'tour_operators',
    caja: 'six',
  },
  {
    href: '/oficinas-turisticas',
    clave: 'oficinas',
    etiqueta: 'touristic_offices',
    caja: 'three',
  },
  { href: '/renta-cars', clave: 'rentadoras', etiqueta: 'rental_cars', caja: 'four' },
] as const;

export default function Cantidades() {
  const { t } = useTranslation('global');
  const [conteos, setConteos] = useState<Record<string, number>>({});

  useEffect(() => {
    let vigente = true;
    api
      .conteo()
      .then((datos) => {
        if (vigente) setConteos(datos);
      })
      .catch((error) => {
        console.error('No se pudo leer el conteo de sitios:', error);
      });
    return () => {
      vigente = false;
    };
  }, []);

  return (
    <div id="countdown" className="row justify-content-center">
      {TIPOS.map(({ href, clave, etiqueta, caja }) => (
        <div key={clave} className="col-lg-2 col-6 mb-4">
          <div className={`box ${caja}`}>
            <Link href={href} className="circle-link">
              <div className="circle">
                <p className="count">{conteos[clave] ?? 0}</p>
                <span className="label">{t(`global.${etiqueta}`)}</span>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
