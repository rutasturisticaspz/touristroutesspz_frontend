'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomNavbar from '../CustomNavbar';
import FooterRutas from '../Footer/FooterRutas';
import BannerDetalle from '../Banner/BannerDetalle';
import Carrusel from '../Carrusel';
import Accesibilidades from './Accesibilidades';
import BarraLateralSitio from './BarraLateralSitio';
import MapaSitio from '../Mapa/MapaSitio';
import { api, ErrorApi, urlImagen } from '../../lib/api';
import { hrefContacto, iconoContacto, opcionesSlider, primeraImagen, primerTelefono } from '../../lib/helpers';
import { itemDePlan, usePlan } from '../../context/PlanContext';
import { useIdioma } from '../../context/IdiomaContext';
import type { ConfigTipo } from '../../lib/tiposSitio';
import type { Contacto, Sitio } from '../../lib/tipos';

// Página de detalle de un sitio, común a los seis tipos.
// Antes SitioIndividual.js repetía seis veces el mismo bloque de
// carga —uno por tipo, cada uno con su servicio y su nombre de campo
// en la respuesta— y luego SitioIndividualContainer volvía a traducir
// el tipo a mano tres veces más. Aquí el tipo llega resuelto desde la
// tabla de tipos y la carga es una sola.

// Los enlaces de Facebook/Instagram/web muestran el tipo; el resto, el valor.
function rotuloContacto(contacto: Contacto): string {
  const conRotulo = ['Facebook', 'Instagram', 'Página web'];
  return conRotulo.includes(contacto.tipo) ? contacto.tipo : contacto.valor;
}

export default function DetalleSitio({ tipo, id }: { tipo: ConfigTipo; id: number }) {
  const { t } = useTranslation('global');
  const { esEspanol } = useIdioma();
  const { addToPlan } = usePlan();

  const [sitio, setSitio] = useState<Sitio | null>(null);
  const [cercanos, setCercanos] = useState<Sitio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    let vigente = true;
    setCargando(true);
    setError(null);

    api
      .obtener(tipo.api, id)
      .then((datos) => {
        if (!vigente) return;
        setSitio(datos);
        setCargando(false);

        // Otros del mismo tipo en el mismo distrito.
        const distrito = datos.ubicacion?.distrito;
        if (!distrito) return;
        return api
          .listar(tipo.api, { distrito, take: 4 })
          .then((pagina) => {
            if (!vigente) return;
            setCercanos(pagina.datos.filter((s) => s.id !== datos.id).slice(0, 3));
          })
          .catch((problema) => console.error('No se pudieron leer los cercanos:', problema));
      })
      .catch((problema) => {
        if (!vigente) return;
        setCargando(false);
        setError(
          problema instanceof ErrorApi && problema.status === 404
            ? 'no-existe'
            : String(problema instanceof Error ? problema.message : problema),
        );
      });

    return () => {
      vigente = false;
    };
  }, [tipo.api, id]);

  const descripcion = (() => {
    if (!sitio) return '';
    const preferida = esEspanol ? sitio.descripcion : sitio.descripcionIngles;
    const alterna = esEspanol ? sitio.descripcionIngles : sitio.descripcion;
    return preferida || alterna || '';
  })();

  const nombreCategoria = (categoria: { nombre: string; nombreIngles: string | null }) =>
    (esEspanol ? categoria.nombre : categoria.nombreIngles || categoria.nombre) || categoria.nombre;

  const imagenes = sitio?.imagenes ?? [];
  const categorias = sitio?.categorias ?? [];
  const contactos = sitio?.contactos ?? [];
  const ubicacion = sitio?.ubicacion;

  return (
    <div className="body_wrapper">
      <CustomNavbar mClass="menu_four" slogo="sticky_logo" nClass="w_menu custom_container p0" />
      <BannerDetalle imagen={sitio ? primeraImagen(sitio) : null} titulo={sitio?.nombre} />

      <section className="blog_area sec_pad">
        <div className="container">
          {cargando && <p className="text-center f_400">…</p>}

          {error === 'no-existe' && (
            <p className="text-center f_400">
              {esEspanol
                ? 'Este sitio ya no está disponible.'
                : 'This place is no longer available.'}
            </p>
          )}

          {error && error !== 'no-existe' && (
            <p className="text-center f_400">
              {esEspanol
                ? 'No se pudo cargar la información. Intentá de nuevo más tarde.'
                : 'The information could not be loaded. Please try again later.'}
            </p>
          )}

          {sitio && (
            <>
              {imagenes.length > 0 && (
                <div className="row">
                  <div className="col-lg-12">
                    <Carrusel opciones={opcionesSlider(1, 1, 1, 1)} className="sitio_single_slider">
                      {imagenes.map((imagen) => (
                        <div className="iitem" key={imagen.id}>
                          <div className="sitio_single_item">
                            <img src={urlImagen(imagen.url)} alt={imagen.nombre || sitio.nombre} />
                          </div>
                        </div>
                      ))}
                    </Carrusel>
                  </div>
                </div>
              )}

              <div className="row">
                <div className="col-lg-8 blog_sidebar_left">
                  <div className="blog_single mb_50">
                    <div className="blog_content">
                      <div className="entry_post_info">
                        <span>{t(tipo.etiqueta)}</span>
                      </div>

                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="f_p f_size_20 f_500 t_color mb_15">{sitio.nombre}</h5>
                        <button
                          type="button"
                          className="btn btn-primary rt_boton_plan"
                          onClick={() =>
                            addToPlan(itemDePlan(sitio, tipo.clave, primeraImagen(sitio)))
                          }
                        >
                          {t('global.addPlan')}
                        </button>
                      </div>

                      <Accesibilidades sitio={sitio} tipoClave={tipo.clave} />

                      {descripcion && <p className="f_400 mb-30 text-justify">{descripcion}</p>}

                      {categorias.length > 0 && (
                        <div className="post_tag">
                          <div className="post-nam">{t('global.categories')}: </div>
                          {categorias.map((categoria) => (
                            <Link
                              key={categoria.id}
                              href={`/buscar/${tipo.clave}/Todos/${encodeURIComponent(categoria.nombre)}/1/Todos/Todos`}
                            >
                              {nombreCategoria(categoria)}
                            </Link>
                          ))}
                        </div>
                      )}

                      {contactos.length > 0 && (
                        <div className="post_share mb-30">
                          {contactos.map((contacto) => (
                            <a
                              key={contacto.id}
                              href={hrefContacto(contacto)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className={iconoContacto(contacto.tipo)} />
                              {rotuloContacto(contacto)}
                            </a>
                          ))}
                        </div>
                      )}

                      {ubicacion && (
                        <>
                          <div className="post-nam">
                            <span>
                              <i className="icon_pin_alt" />
                              {t('global.location')}
                            </span>
                          </div>
                          <p className="f_400 mt_05">
                            {[
                              ubicacion.provincia,
                              ubicacion.canton,
                              ubicacion.distrito,
                              ubicacion.detalle,
                            ]
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                          <MapaSitio ubicacion={ubicacion} nombre={sitio.nombre} />
                        </>
                      )}
                    </div>
                  </div>

                  {cercanos.length > 0 && (
                    <div className="blog_post">
                      <div className="widget_title">
                        <h3 className="f_p f_size_20 t_color3">
                          {`${t(tipo.etiqueta)} ${t('global.near_there')}`}
                        </h3>
                        <div className="border_bottom" />
                      </div>
                      <div className="row">
                        {cercanos.map((lugar) => (
                          <div className="col-lg-4 col-sm-6" key={lugar.id}>
                            <div className="blog_post_item">
                              <div className="blog_img">
                                <img src={primeraImagen(lugar)} alt={lugar.nombre} />
                              </div>
                              <div className="blog_content">
                                <div className="entry_post_info">{t(tipo.etiqueta)}</div>
                                <Link href={`/sitio/${tipo.clave}/${lugar.id}`}>
                                  <h5 className="f_p f_size_16 f_500 t_color">{lugar.nombre}</h5>
                                </Link>
                                <p className="f_400 mb-0">
                                  {lugar.ubicacion?.distrito}
                                  <br />
                                  {primerTelefono(lugar.contactos)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-lg-4">
                  <BarraLateralSitio tipo={tipo} sitioId={sitio.id} />
                </div>
              </div>
            </>
          )}
        </div>

        <style>{`
          .rt_boton_plan { transition: transform .2s, box-shadow .2s; }
          .rt_boton_plan:hover { transform: scale(1.07); box-shadow: 0 4px 16px rgba(0,0,0,.15); }
        `}</style>
      </section>

      <FooterRutas />
    </div>
  );
}
