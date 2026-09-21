'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../lib/api';
import { primeraImagen, primerTelefono } from '../../lib/helpers';
import { TIPOS, type ConfigTipo } from '../../lib/tiposSitio';
import type { Sitio } from '../../lib/tipos';

// Los sitios de un tipo que hay en un distrito.
// El original repetía este bloque cuatro veces —atracciones,
// restaurantes, hospedaje y operadores— con el mismo marcado y sólo
// cambiando el nombre del servicio y el título. Aquí es un componente
// con el tipo como parámetro.
export default function SitiosDelDistrito({
  tipo,
  distrito,
  titulo,
}: {
  tipo: ConfigTipo;
  // Nombre del distrito, sin acentos, como está en la base.
  distrito: string;
  // Clave de traducción del encabezado.
  titulo: string;
}) {
  const { t } = useTranslation('global');
  const [sitios, setSitios] = useState<Sitio[]>([]);

  useEffect(() => {
    let vigente = true;
    api
      .listar(tipo.api, { provincia: 'San José', canton: 'Pérez Zeledón', distrito, take: 3 })
      .then((pagina) => vigente && setSitios(pagina.datos))
      .catch((error) => console.error(`No se pudieron leer los sitios de ${tipo.api}:`, error));
    return () => {
      vigente = false;
    };
  }, [tipo.api, distrito]);

  if (sitios.length === 0) return null;

  return (
    <>
      <div className="blog_post mt_70">
        <div className="widget_title">
          <h3 className="f_p f_size_20 t_color3">{t(titulo)}</h3>
          <div className="border_bottom" />
        </div>
        <div className="row">
          {sitios.map((lugar) => (
            <div className="col-lg-4 col-sm-6" key={lugar.id}>
              <div className="blog_post_item">
                <div className="blog_img distrito">
                  <img src={primeraImagen(lugar)} alt={lugar.nombre} />
                </div>
                <div className="blog_content">
                  <div className="entry_post_info">
                    <Link href={`/buscar/${tipo.clave}/Todos/Todos/1/Todos/Todos`}>
                      {t(tipo.etiqueta)}
                    </Link>
                  </div>
                  <Link href={`/sitio/${tipo.clave}/${lugar.id}`}>
                    <h5 className="f_p f_size_16 f_500 t_color">{lugar.nombre}</h5>
                  </Link>
                  <p className="f_400 mb-0">{primerTelefono(lugar.contactos)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12 text-center mt_40 mb_40">
          <Link
            href={`/buscar/${tipo.clave}/${encodeURIComponent(distrito)}/Todos/1/Todos/Todos`}
            className="restaurante_btn restaurante_btn_one btn_hover"
          >
            {t('global.see_more')}
          </Link>
        </div>
      </div>
    </>
  );
}

// Los cuatro tipos que la ficha de distrito muestra, con su título.
export const TIPOS_EN_DISTRITO = [
  { tipo: TIPOS.atracciones, titulo: 'districts.attractions_in_the_district' },
  { tipo: TIPOS.restaurantes, titulo: 'districts.restaurants_in_the_district' },
  { tipo: TIPOS.hospedaje, titulo: 'districts.lodging_in_the_district' },
  {
    tipo: TIPOS.operadoresTuristicos,
    titulo: 'districts.touristic_operators_in_the_district',
  },
];
