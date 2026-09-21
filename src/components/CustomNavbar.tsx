'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sticky from './Sticky';
import { usePlan } from '../context/PlanContext';
import { useIdioma } from '../context/IdiomaContext';
import '../styles/navbar.css';

// Barra de navegación.
// Es la misma de antes, con el mismo marcado y las mismas clases de
// Bootstrap 4, pero el menú colapsable y el desplegable se manejan con
// estado de React en vez del JavaScript de Bootstrap. Eso saca del
// proyecto a jQuery y a popper.js, que estaban sólo para esto.

interface Props {
  mClass?: string;
  nClass?: string;
  cClass?: string;
  slogo?: string;
}

const ENLACE_INSTAGRAM =
  'https://www.instagram.com/quehacerenperez_com?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw/';

// OJO: este enlace apunta a una carpeta de Drive personal. Queda igual
// que en el sitio actual, pero es uno de los pendientes de la
// migración: hay que moverlo a un archivo servido por la Universidad.
const ENLACE_RECURSOS =
  'https://drive.google.com/drive/folders/10OkYsHdGs9-HaJI7FgEdEbjNAOo32gZn?usp=sharing';

export default function CustomNavbar({
  mClass = '',
  nClass = '',
  cClass = '',
  slogo = '',
}: Props) {
  const { t } = useTranslation('global');
  const { planItems } = usePlan();
  const { idioma, cambiarIdioma } = useIdioma();
  const rutaActual = usePathname();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [submenuAbierto, setSubmenuAbierto] = useState(false);

  // Animación del contador del plan, igual que antes.
  const conteoPrevio = useRef(planItems.length);
  const [animar, setAnimar] = useState(false);

  useEffect(() => {
    if (conteoPrevio.current !== planItems.length) {
      setAnimar(true);
      const tiempo = setTimeout(() => setAnimar(false), 300);
      conteoPrevio.current = planItems.length;
      return () => clearTimeout(tiempo);
    }
  }, [planItems.length]);

  // Al cambiar de página se cierra el menú; en móvil quedaba abierto.
  useEffect(() => {
    setMenuAbierto(false);
    setSubmenuAbierto(false);
  }, [rutaActual]);

  const enlace = (destino: string, etiqueta: string) => (
    <li className="nav-item">
      <Link
        title={etiqueta}
        className={`nav-link${rutaActual === destino ? ' active' : ''}`}
        href={destino}
      >
        {etiqueta}
      </Link>
    </li>
  );

  const botonIdioma = (codigo: 'es' | 'en', etiqueta: string) => (
    <button
      type="button"
      onClick={() => cambiarIdioma(codigo)}
      className={`language-button ${codigo}${idioma === codigo ? ' active' : ''}`}
      title={etiqueta}
      aria-label={etiqueta}
      aria-pressed={idioma === codigo}
    />
  );

  return (
    <Sticky>
      <header className="header_area">
        <nav className={`navbar navbar-expand-lg menu_one ${mClass}`}>
          <div className={`container ${cClass}`}>
            <a
              className={`navbar-brand ${slogo}`}
              href={ENLACE_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img style={{ height: '6vh' }} src="/img/logoRT.png" alt="Rutas Turísticas" />
              <img style={{ height: '6vh' }} src="/img/logoRTC.png" alt="" />
            </a>

            <Link className={`navbar-brand ${slogo}`} href="/">
              <img style={{ height: '6vh' }} src="/img/logoVP.png" alt="Vení a Pérez" />
              <img style={{ height: '6vh' }} src="/img/logoVPC.png" alt="" />
            </Link>

            <a
              className={`navbar-brand ${slogo}`}
              href="https://www.una.ac.cr/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img style={{ height: '6vh' }} src="/img/logoUNA.png" alt="Universidad Nacional" />
              <img style={{ height: '6vh' }} src="/img/logoUNAC.png" alt="" />
            </a>

            <a
              className={`navbar-brand rt_marca_simple ${slogo}`}
              href={ENLACE_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                style={{ height: '5vh' }}
                src="/img/destinoAccesible.png"
                alt="Destino accesible"
              />
            </a>

            <button
              className={`navbar-toggler${menuAbierto ? '' : ' collapsed'}`}
              type="button"
              onClick={() => setMenuAbierto((abierto) => !abierto)}
              aria-controls="navbarSupportedContent"
              aria-expanded={menuAbierto}
              aria-label="Abrir menú"
            >
              <span className="menu_toggle">
                <span className="hamburger">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="hamburger-cross">
                  <span />
                  <span />
                </span>
              </span>
            </button>

            <div
              className={`collapse navbar-collapse${menuAbierto ? ' show' : ''}`}
              id="navbarSupportedContent"
            >
              <ul className={`navbar-nav menu ml-auto ${nClass}`}>
                {enlace('/inicio', t('global.home'))}
                {enlace('/eventos', t('global.events'))}
                {enlace('/atracciones', t('global.attractions'))}
                {enlace('/restaurantes', t('global.restaurants'))}
                {enlace('/hospedaje', t('global.lodgings'))}

                <li className={`nav-item dropdown submenu${submenuAbierto ? ' show' : ''}`}>
                  <button
                    type="button"
                    className="nav-link dropdown-toggle"
                    onClick={() => setSubmenuAbierto((abierto) => !abierto)}
                    aria-haspopup="true"
                    aria-expanded={submenuAbierto}
                    style={{ background: 'none', border: 'none' }}
                  >
                    {t('global.more')}
                  </button>
                  <ul className={`dropdown-menu${submenuAbierto ? ' show' : ''}`}>
                    {enlace('/oficinas-turisticas', t('global.touristic_offices'))}
                    {enlace('/operadores-turisticos', t('global.tour_operators'))}
                    {enlace('/renta-cars', t('global.rental_cars'))}
                    {enlace('/perezzeledon', t('global.perez_zeledon'))}
                    {enlace('/mapas', t('global.maps'))}
                    {enlace('/contacto', t('global.contact'))}
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={ENLACE_RECURSOS}
                      >
                        {t('global.downloadable_resources')}
                      </a>
                    </li>
                  </ul>
                </li>

                <li
                  className="nav-item"
                  style={{
                    display: 'flex',
                    gap: 10,
                    marginLeft: 20,
                    alignItems: 'center',
                  }}
                >
                  {botonIdioma('es', 'Español')}
                  {botonIdioma('en', 'English')}
                </li>

                <li
                  className="nav-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    fontWeight: 600,
                  }}
                >
                  <Link
                    title={t('global.Plan')}
                    className="nav-link"
                    href="/planLugares"
                    style={{ display: 'inline-flex', alignItems: 'center', position: 'relative' }}
                  >
                    {t('global.Plan')}
                    {planItems.length > 0 && (
                      <span
                        aria-label={`${planItems.length} elementos en el plan`}
                        style={{
                          marginLeft: 8,
                          backgroundColor: '#dc3545',
                          color: 'white',
                          borderRadius: '50%',
                          minWidth: 20,
                          height: 20,
                          padding: '0 6px',
                          fontSize: 12,
                          fontWeight: 'bold',
                          display: 'inline-flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          userSelect: 'none',
                          transformOrigin: 'center',
                          transform: animar ? 'scale(1.3)' : 'scale(1)',
                          transition: 'transform 0.3s ease',
                          boxShadow: '0 0 6px rgba(220, 53, 69, 0.7)',
                        }}
                      >
                        {planItems.length}
                      </span>
                    )}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </Sticky>
  );
}
