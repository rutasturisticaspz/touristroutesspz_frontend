'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../lib/api';
import '../../styles/cantidades.css';

// Los seis círculos con la cantidad de sitios de cada tipo.
// OJO con el cambio de forma: el API anterior devolvía
//     { "atracciones": [ { "count": 124 } ], "rentacars": [ ... ] }
// y el componente lo leía como `counts?.[key]?.[0]?.count || 0`. Ese
// `|| 0` escondía cualquier error: si la respuesta cambiaba, la
// portada mostraba seis ceros sin avisar. El backend nuevo devuelve
// números planos y las llaves cambiaron (`rentacars` → `rentadoras`).

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
