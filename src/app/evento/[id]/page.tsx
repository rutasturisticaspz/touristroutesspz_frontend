'use client';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomNavbar from '../../../components/CustomNavbar';
import FooterRutas from '../../../components/Footer/FooterRutas';
import BannerDetalle from '../../../components/Banner/BannerDetalle';
import Carrusel from '../../../components/Carrusel';
import MapaSitio from '../../../components/Mapa/MapaSitio';
import { api, urlImagen } from '../../../lib/api';
import { hrefContacto, iconoContacto, opcionesSlider, primeraImagen, rangoFechas } from '../../../lib/helpers';
import { useIdioma } from '../../../context/IdiomaContext';
import type { Contacto, Evento, Sitio } from '../../../lib/tipos';

// /evento/:id — el detalle de un evento.
// La barra lateral muestra los sitios que participan. El backend
// devuelve los seis vínculos ya aplanados, así que aquí es una tabla
// en vez de los seis bloques copiados del original.

// Los seis tipos de sitio que un evento puede tener asociados.
const PARTICIPAN = [
  { campo: 'atracciones', tipoClave: 'atracciones', es: 'Atracciones', en: 'Attractions' },
  { campo: 'restaurantes', tipoClave: 'restaurantes', es: 'Restaurantes', en: 'Restaurants' },
  { campo: 'hoteles', tipoClave: 'hospedaje', es: 'Hoteles', en: 'Lodgings' },
  {
    campo: 'oficinasTuristicas',
    tipoClave: 'oficinasTuristicas',
    es: 'Oficinas turísticas',
    en: 'Touristic offices',
  },
  {
    campo: 'operadoresTuristicos',
    tipoClave: 'operadoresTuristicos',
    es: 'Operadores turísticos',
    en: 'Tour operators',
  },
  {
    campo: 'rentadorasVehiculos',
    tipoClave: 'rentacars',
    es: 'Rentadoras de vehículos',
    en: 'Rental cars',
  },
] as const;

function rotuloContacto(contacto: Contacto): string {
  const conRotulo = ['Facebook', 'Instagram', 'Página web'];
  return conRotulo.includes(contacto.tipo) ? contacto.tipo : contacto.valor;
}

export default function Pagina() {
  const parametros = useParams<{ id: string }>();
  const id = Number(parametros?.id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const { t } = useTranslation('global');
  const { esEspanol } = useIdioma();

  const [evento, setEvento] = useState<Evento | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    let vigente = true;

    api
      .obtener('eventos', id)
      .then((datos) => vigente && setEvento(datos as Evento))
      .catch((error) => console.error('No se pudo leer el evento:', error))
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, [id]);

  const nombre = evento
    ? (esEspanol ? evento.nombre : evento.nombreIngles) || evento.nombre
    : '';
  const descripcion = evento
    ? (esEspanol ? evento.descripcion : evento.descripcionIngles) || evento.descripcion
    : '';
  const fechas = evento ? rangoFechas(evento.fechaInicio, evento.fechaFin) : '';
  const imagenes = evento?.imagenes ?? [];
  const contactos = evento?.contactos ?? [];
  const ubicacion = evento?.ubicacion;

  return (
    <div className="body_wrapper">
      <CustomNavbar mClass="menu_four" slogo="sticky_logo" nClass="w_menu custom_container p0" />
      <BannerDetalle
        imagen={evento ? primeraImagen(evento) : null}
        titulo={nombre}
        descripcion={descripcion}
      />

      <section className="blog_area sec_pad">
        <div className="container">
          {cargando && <p className="text-center f_400">…</p>}

          {!cargando && !evento && (
            <p className="text-center f_400">
              {esEspanol ? 'Este evento ya no está disponible.' : 'This event is no longer available.'}
            </p>
          )}

          {evento && (
            <>
              {imagenes.length > 0 && (
                <div className="row">
                  <div className="col-lg-12">
                    <Carrusel opciones={opcionesSlider(1, 1, 1, 1)} className="sitio_single_slider">
                      {imagenes.map((imagen) => (
                        <div className="iitem" key={imagen.id}>
                          <div className="sitio_single_item">
                            <img src={urlImagen(imagen.url)} alt={imagen.nombre || nombre} />
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
                      <h5 className="f_p f_size_20 f_500 t_color mb_15">{nombre}</h5>

                      {descripcion && <p className="f_400 mb-30 text-justify">{descripcion}</p>}

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
                          <MapaSitio ubicacion={ubicacion} nombre={nombre} />
                        </>
                      )}

                      {fechas && (
                        <>
                          <div className="post-nam">
                            <span>
                              <i className="icon_calendar" />
                              {esEspanol ? 'Fecha' : 'Date'}
                            </span>
                          </div>
                          <p className="f_400 mt_05">{fechas}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="blog-sidebar mt_30">
                    <div className="widget sidebar_widget widget_categorie">
                      <div className="widget_title">
                        <h3 className="f_p f_size_20 t_color3">
                          {esEspanol ? 'PARTICIPAN' : 'PARTICIPATE'}
                        </h3>
                      </div>
                      {PARTICIPAN.map((grupo) => {
                        const sitios = (evento[grupo.campo] as Sitio[] | undefined) ?? [];
                        if (sitios.length === 0) return null;
                        return (
                          <div key={grupo.campo}>
                            <h4 className="f_p f_size_20 t_color3">
                              {esEspanol ? grupo.es : grupo.en}
                            </h4>
                            <ul className="list-unstyled">
                              {sitios.map((sitio) => (
                                <li key={sitio.id}>
                                  <Link href={`/sitio/${grupo.tipoClave}/${sitio.id}`}>
                                    {sitio.nombre}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                            <br />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <FooterRutas />
    </div>
  );
}
