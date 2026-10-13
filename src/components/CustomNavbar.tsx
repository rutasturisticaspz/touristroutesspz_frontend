'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sticky from './Sticky';
import { usePlan } from '../context/PlanContext';
import { useIdioma } from '../context/IdiomaContext';
import { useNovedades, type Seccion } from '../context/NovedadesContext';
import '../styles/navbar.css';

// Navigation bar.
// It is the same as before, with the same markup and the same
// Bootstrap 4 classes, but the collapsible menu and the dropdown are
// handled with React state instead of Bootstrap's JavaScript. That
// takes jQuery and popper.js out of the project, which were only
// there for this.

interface Props {
  mClass?: string;
  nClass?: string;
  cClass?: string;
  slogo?: string;
}

const ENLACE_INSTAGRAM =
  'https://www.instagram.com/quehacerenperez_com?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw/';

export default function CustomNavbar({
  mClass = '',
  nClass = '',
  cClass = '',
  slogo = '',
}: Props) {
  const { t } = useTranslation('global');
  const { planItems } = usePlan();
  const { idioma, cambiarIdioma } = useIdioma();
  const novedades = useNovedades();
  const rutaActual = usePathname();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [submenuAbierto, setSubmenuAbierto] = useState(false);

  // Plan counter animation, same as before.
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

  // When changing page the menu closes; on mobile it stayed open.
  useEffect(() => {
    setMenuAbierto(false);
    setSubmenuAbierto(false);
  }, [rutaActual]);

  // Label with the "x new" badge on top, if the section has one.
  const conInsignia = (etiqueta: string, cantidad: number) => (
    <span className="rt_nav_etiqueta">
      {etiqueta}
      <InsigniaNuevos cantidad={cantidad} />
    </span>
  );

  const enlace = (destino: string, etiqueta: string, seccion?: Seccion) => (
    <li className="nav-item">
      <Link
        title={etiqueta}
        className={`nav-link${rutaActual === destino ? ' active' : ''}`}
        href={destino}
      >
        {conInsignia(etiqueta, seccion ? novedades[seccion] : 0)}
      </Link>
    </li>
  );

  const novedadesDeMas = novedades.oficinas + novedades.operadores + novedades.rentadoras;

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
                {enlace('/eventos', t('global.events'), 'eventos')}
                {enlace('/atracciones', t('global.attractions'), 'atracciones')}
                {enlace('/restaurantes', t('global.restaurants'), 'restaurantes')}
                {enlace('/hospedaje', t('global.lodgings'), 'hoteles')}
                {enlace('/barometro', t('global.barometer'))}

                <li className={`nav-item dropdown submenu${submenuAbierto ? ' show' : ''}`}>
                  <button
                    type="button"
                    className="nav-link dropdown-toggle"
                    onClick={() => setSubmenuAbierto((abierto) => !abierto)}
                    aria-haspopup="true"
                    aria-expanded={submenuAbierto}
                    style={{ background: 'none', border: 'none' }}
                  >
                    {conInsignia(t('global.more'), novedadesDeMas)}
                  </button>
                  <ul className={`dropdown-menu${submenuAbierto ? ' show' : ''}`}>
                    {enlace('/oficinas-turisticas', t('global.touristic_offices'), 'oficinas')}
                    {enlace('/operadores-turisticos', t('global.tour_operators'), 'operadores')}
                    {enlace('/renta-cars', t('global.rental_cars'), 'rentadoras')}
                    {enlace('/perezzeledon', t('global.perez_zeledon'))}
                    {enlace('/mapas', t('global.maps'))}
                    {enlace('/contacto', t('global.contact'))}
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

// "1 new", "20 new". It is not drawn if there is nothing new.
function InsigniaNuevos({ cantidad }: { cantidad: number }) {
  const { t } = useTranslation('global');
  if (cantidad <= 0) return null;
  return <span className="rt_insignia_nuevos">{t('global.new_count', { count: cantidad })}</span>;
}
