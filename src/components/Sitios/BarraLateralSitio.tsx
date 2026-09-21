'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../lib/api';
import { primeraImagen, validarTexto } from '../../lib/helpers';
import { slugDistrito } from '../../lib/distritos';
import { TIPOS, type ConfigTipo } from '../../lib/tiposSitio';
import type { Sitio } from '../../lib/tipos';
import '../../styles/buscador.css';

// Barra lateral de la página de detalle: buscador, sitios similares y
// el conteo por tipo.
// El original repetía cuatro veces la misma llamada
// "sitios con la misma categoría", una por tipo, y armaba a mano la
// lista de conteos leyendo `counts?.atracciones[0].count` —una forma
// que el backend nuevo ya no devuelve—. Aquí el conteo viene como un
// objeto plano y los similares los calcula el backend.
export default function BarraLateralSitio({
  tipo,
  sitioId,
}: {
  tipo: ConfigTipo;
  sitioId: number;
}) {
  const { t } = useTranslation('global');
  const router = useRouter();

  const [filtro, setFiltro] = useState('');
  const [similares, setSimilares] = useState<Sitio[]>([]);
  const [conteo, setConteo] = useState<Record<string, number>>({});

  useEffect(() => {
    let vigente = true;
    api
      .relacionados(tipo.api, sitioId, 3)
      .then((pagina) => vigente && setSimilares(pagina.datos))
      .catch((error) => console.error('No se pudieron leer los similares:', error));
    return () => {
      vigente = false;
    };
  }, [tipo.api, sitioId]);

  useEffect(() => {
    let vigente = true;
    api
      .conteo()
      .then((datos) => vigente && setConteo(datos))
      .catch((error) => console.error('No se pudo leer el conteo:', error));
    return () => {
      vigente = false;
    };
  }, []);

  const buscar = () => {
    const texto = filtro.trim().length > 1 ? encodeURIComponent(filtro.trim()) : 'Todos';
    router.push(`/buscar/${tipo.clave}/${texto}/Todos/1/Todos/Todos`);
  };

  return (
    <div className="blog-sidebar mt_30">
      <div className="widget sidebar_widget widget_search">
        <div className="widget_title">
          <h3 className="f_p f_size_20 t_color3">{t('global.keep_looking')}</h3>
        </div>
        <form
          className="search-form input-group"
          onSubmit={(evento) => {
            evento.preventDefault();
            buscar();
          }}
        >
          <input
            type="search"
            className="form-control widget_input"
            value={filtro}
            maxLength={40}
            placeholder={`${t('global.search')} ${t(tipo.etiqueta)}`}
            onChange={(evento) => setFiltro(evento.target.value)}
            onKeyDown={(evento) => {
              if (evento.key !== 'Enter') validarTexto(evento, /[^a-zA-Z0-9, ñáéíóúÁÉÍÓÚ]/g);
            }}
          />
          <button type="submit">
            <i className="ti-search" />
          </button>
        </form>
      </div>

      {similares.length > 0 && (
        <div className="widget sidebar_widget widget_recent_post mt_60">
          <div className="widget_title">
            <h3 className="f_p f_size_20 t_color3">{t('global.similar')}</h3>
            <div className="border_bottom" />
          </div>
          {similares.map((s) => {
            const slug = slugDistrito(s.ubicacion?.distrito);
            return (
              <div className="media post_item" key={s.id}>
                <img src={primeraImagen(s)} alt={s.nombre} />
                <div className="media-body">
                  <Link href={`/sitio/${tipo.clave}/${s.id}`}>
                    <h3 className="f_size_16 f_p f_400">{s.nombre}</h3>
                  </Link>
                  {slug && (
                    <div className="entry_post_info">
                      <Link href={`/distritos/${slug}`}>{s.ubicacion?.distrito}</Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="widget sidebar_widget widget_categorie mt_60">
        <div className="widget_title">
          <h3 className="f_p f_size_20 t_color3">{t('global.categories')}</h3>
          <div className="border_bottom" />
        </div>
        <ul className="list-unstyled">
          {Object.values(TIPOS).map((otro) => (
            <li key={otro.clave}>
              <Link
                href={`/buscar/${otro.clave}/Todos/Todos/1/Todos/Todos`}
                className={otro.clave === tipo.clave ? 'categorie_active' : ''}
              >
                {t(otro.etiqueta)}
              </Link>
              <em>({conteo[otro.conteo] ?? 0})</em>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
