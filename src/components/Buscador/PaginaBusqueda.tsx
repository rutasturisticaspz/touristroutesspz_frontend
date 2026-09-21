'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomNavbar from '../CustomNavbar';
import FooterRutas from '../Footer/FooterRutas';
import BannerDetalle from '../Banner/BannerDetalle';
import TarjetaResultado from './TarjetaResultado';
import { api, pedir } from '../../lib/api';
import { validarTexto } from '../../lib/helpers';
import { useIdioma } from '../../context/IdiomaContext';
import { TIPOS, type ConfigTipo } from '../../lib/tiposSitio';
import {
  ACCESIBILIDADES,
  OTROS,
  alternar,
  camposDeRotulos,
  escribirLista,
} from '../../lib/filtrosBusqueda';
import type { Categoria, Pagina, Sitio } from '../../lib/tipos';
import '../../styles/buscador.css';

// Cuántos resultados por página, igual que antes.
const POR_PAGINA = 8;

export interface EstadoBusqueda {
  tipo: ConfigTipo;
  filtro: string;
  categorias: string[];
  pagina: number;
  accesibilidad: string[];
  otros: string[];
}

// Buscador con filtros.
// El original mandaba a cada tipo de sitio su propia función
// `getXWithAllFilters` —seis, con distinta cantidad de parámetros— y
// armaba las URLs concatenando cadenas en cinco lugares distintos.
// Aquí la URL se arma en un solo sitio y el backend recibe siempre los
// mismos parámetros.
export default function PaginaBusqueda({ estado }: { estado: EstadoBusqueda }) {
  const { t } = useTranslation('global');
  const { esEspanol } = useIdioma();
  const router = useRouter();

  const { tipo, filtro, categorias, pagina, accesibilidad, otros } = estado;

  const [texto, setTexto] = useState(filtro);
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [listaCategorias, setListaCategorias] = useState<Categoria[]>([]);

  useEffect(() => setTexto(filtro), [filtro]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tipo.clave, filtro, pagina]);

  // Los campos de accesibilidad que la tabla de este tipo realmente
  // tiene; mandar uno que no existe haría fallar la consulta.
  const campos = useMemo(
    () => camposDeRotulos([...accesibilidad, ...otros]),
    [accesibilidad, otros],
  );

  useEffect(() => {
    let vigente = true;
    setCargando(true);

    api
      .listar(tipo.api, {
        filtro: filtro || undefined,
        categorias: tipo.conCategorias && categorias.length > 0 ? categorias : undefined,
        accesibilidad: campos.length > 0 ? campos : undefined,
        skip: (pagina - 1) * POR_PAGINA,
        take: POR_PAGINA,
      })
      .then((resultado) => {
        if (!vigente) return;
        setSitios(resultado.datos);
        setTotal(resultado.total);
      })
      .catch((error) => {
        if (!vigente) return;
        console.error('Falló la búsqueda:', error);
        setSitios([]);
        setTotal(0);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, [tipo.api, tipo.conCategorias, filtro, categorias, campos, pagina]);

  useEffect(() => {
    if (!tipo.conCategorias) return;
    let vigente = true;
    pedir<Pagina<Categoria>>('/categorias', { take: 100 })
      .then((resultado) => vigente && setListaCategorias(resultado.datos))
      .catch((error) => console.error('No se pudieron leer las categorías:', error));
    return () => {
      vigente = false;
    };
  }, [tipo.conCategorias]);

  // Arma la URL del buscador cambiando sólo lo que se le pase.
  const url = (cambios: Partial<EstadoBusqueda & { tipoClave: string }> = {}) => {
    const clave = cambios.tipoClave ?? tipo.clave;
    const f = cambios.filtro ?? filtro;
    const c = cambios.categorias ?? categorias;
    const p = cambios.pagina ?? 1;
    const a = cambios.accesibilidad ?? accesibilidad;
    const o = cambios.otros ?? otros;
    return `/buscar/${clave}/${f ? encodeURIComponent(f) : 'Todos'}/${escribirLista(c)}/${p}/${escribirLista(a)}/${escribirLista(o)}`;
  };

  const ultima = Math.max(1, Math.ceil(total / POR_PAGINA));
  const rotulo = (f: { rotulo: string; ingles: string }) => (esEspanol ? f.rotulo : f.ingles);
  const nombreCategoria = (c: Categoria) =>
    (esEspanol ? c.nombre : c.nombreIngles || c.nombre) || c.nombre;

  // Los números de página que se muestran: 1 … n-1 [n] n+1 … última
  const paginas = (): number[] => {
    const cerca = [pagina - 1, pagina, pagina + 1].filter((n) => n >= 1 && n <= ultima);
    const todas = new Set([1, ...cerca, ultima]);
    return [...todas].sort((a, b) => a - b);
  };

  return (
    <div className="body_wrapper">
      <CustomNavbar mClass="menu_four" slogo="sticky_logo" nClass="w_menu custom_container p0" />
      <BannerDetalle titulo={t('browser.browser')} descripcion={t('browser.browser_description')} />

      <section className="blog_area_two sec_pad">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 blog_grid_info">
              <div className="row">
                {cargando && <p>…</p>}

                {!cargando && sitios.length === 0 && (
                  <p>
                    {esEspanol
                      ? 'No se encontró ningún dato con la información proporcionada en la búsqueda. Revisá los filtros o intentá más tarde.'
                      : 'No results matched your search. Please review the filters or try again later.'}
                  </p>
                )}

                {!cargando &&
                  sitios.map((sitio) => (
                    <TarjetaResultado key={sitio.id} sitio={sitio} tipo={tipo} />
                  ))}
              </div>

              {ultima > 1 && (
                <ul className="list-unstyled page-numbers shop_page_number text-left mt_30">
                  {pagina > 1 && (
                    <li>
                      <Link href={url({ pagina: pagina - 1 })}>
                        <span className="next page-numbers">
                          <i className="ti-arrow-left" />
                        </span>
                      </Link>
                    </li>
                  )}
                  {paginas().map((n, indice, lista) => (
                    <li key={n}>
                      {indice > 0 && n - lista[indice - 1] > 1 && (
                        <span className="page-numbers etc">...</span>
                      )}
                      {n === pagina ? (
                        <span aria-current="page" className="page-numbers current">
                          {n}
                        </span>
                      ) : (
                        <Link href={url({ pagina: n })}>
                          <span className="page-numbers">{n}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                  {pagina < ultima && (
                    <li>
                      <Link href={url({ pagina: pagina + 1 })}>
                        <span className="next page-numbers">
                          <i className="ti-arrow-right" />
                        </span>
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </div>

            <div className="col-lg-4">
              <div className="blog-sidebar">
                <div className="widget sidebar_widget widget_search">
                  <div className="widget_title">
                    <h3 className="f_p f_size_20 t_color3">{t('browser.keep_looking')}</h3>
                  </div>
                  <form
                    className="search-form input-group"
                    onSubmit={(evento) => {
                      evento.preventDefault();
                      router.push(url({ filtro: texto.trim(), pagina: 1 }));
                    }}
                  >
                    <input
                      type="search"
                      className="form-control widget_input"
                      value={texto}
                      maxLength={40}
                      placeholder={t('global.search')}
                      onChange={(evento) => setTexto(evento.target.value)}
                      onKeyDown={(evento) => {
                        if (evento.key !== 'Enter')
                          validarTexto(evento, /[^a-zA-Z0-9, ñáéíóúÁÉÍÓÚ]/g);
                      }}
                    />
                    <button type="submit">
                      <i className="ti-search" />
                    </button>
                  </form>
                </div>

                <div className="widget sidebar_widget widget_categorie mt_60">
                  <div className="widget_title">
                    <h3 className="f_p f_size_20 t_color3">{t('browser.categories')}</h3>
                    <div className="border_bottom" />
                  </div>
                  <ul className="list-unstyled">
                    {Object.values(TIPOS).map((otro) => (
                      <li key={otro.clave}>
                        <Link
                          href={`/buscar/${otro.clave}/Todos/Todos/1/${escribirLista(accesibilidad)}/${escribirLista(otros)}`}
                          className={otro.clave === tipo.clave ? 'categorie_active' : ''}
                        >
                          {t(otro.etiqueta)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="widget sidebar_widget widget_tag_cloud mt_60">
                  <div className="widget_title">
                    <h3 className="f_p f_size_20 t_color3">{t('accessibility.accessibilities')}</h3>
                    <div className="border_bottom" />
                  </div>
                  <div className="post-tags">
                    {ACCESIBILIDADES.map((f) => (
                      <Link
                        key={f.campo}
                        href={url({ accesibilidad: alternar(accesibilidad, f.rotulo), pagina: 1 })}
                        className={accesibilidad.includes(f.rotulo) ? 'subcategorie_active' : ''}
                      >
                        {rotulo(f)}
                      </Link>
                    ))}
                  </div>
                </div>

                {tipo.clave !== 'rentacars' && (
                  <div className="widget sidebar_widget widget_tag_cloud mt_60">
                    <div className="widget_title">
                      <h3 className="f_p f_size_20 t_color3">{t('global.others')}</h3>
                      <div className="border_bottom" />
                    </div>
                    <div className="post-tags">
                      {OTROS.map((f) => (
                        <Link
                          key={f.campo}
                          href={url({ otros: alternar(otros, f.rotulo), pagina: 1 })}
                          className={otros.includes(f.rotulo) ? 'subcategorie_active' : ''}
                        >
                          {rotulo(f)}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {tipo.conCategorias && listaCategorias.length > 0 && (
                  <div className="widget sidebar_widget widget_tag_cloud mt_60">
                    <div className="widget_title">
                      <h3 className="f_p f_size_20 t_color3">{t('browser.subcategories')}</h3>
                      <div className="border_bottom" />
                    </div>
                    <div className="post-tags">
                      {listaCategorias.map((c) => (
                        <Link
                          key={c.id}
                          href={url({ categorias: alternar(categorias, c.nombre), pagina: 1 })}
                          className={categorias.includes(c.nombre) ? 'subcategorie_active' : ''}
                        >
                          {nombreCategoria(c)}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterRutas />
    </div>
  );
}
