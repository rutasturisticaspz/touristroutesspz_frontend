'use client';

import { useEffect, useState, type ReactNode } from 'react';
import '../../styles/accesibilidad.css';
import { useIdioma } from '../../context/IdiomaContext';

// Menú de accesibilidad.
// Es un botón flotante, presente en todas las páginas (se monta una
// sola vez en el layout raíz), que abre un panel para ajustar tamaño
// de texto, contraste, espaciado, animaciones, imágenes, tipografía y
// cursor. Los ajustes se guardan en localStorage y se vuelven a
// aplicar en cada visita.
// Los efectos en sí (las clases `a11y-*`) están en
// `src/styles/accesibilidad.css`; este componente solo lleva el
// estado y prende/apaga esas clases en <html>.

const CLAVE_ALMACENAMIENTO = 'accesibilidad-rt';
const ESCALA_MIN = 100;
const ESCALA_MAX = 160;
const ESCALA_PASO = 10;

interface EstadoAccesibilidad {
  escalaTexto: number;
  contraste: boolean;
  enlaces: boolean;
  espaciado: boolean;
  interlineado: boolean;
  sinAnimaciones: boolean;
  sinImagenes: boolean;
  dislexia: boolean;
  cursorGrande: boolean;
}

const ESTADO_INICIAL: EstadoAccesibilidad = {
  escalaTexto: 100,
  contraste: false,
  enlaces: false,
  espaciado: false,
  interlineado: false,
  sinAnimaciones: false,
  sinImagenes: false,
  dislexia: false,
  cursorGrande: false,
};

type ClaveInterruptor = Exclude<keyof EstadoAccesibilidad, 'escalaTexto'>;

function leerEstadoGuardado(): EstadoAccesibilidad {
  if (typeof window === 'undefined') return ESTADO_INICIAL;
  try {
    const guardado = window.localStorage.getItem(CLAVE_ALMACENAMIENTO);
    if (!guardado) return ESTADO_INICIAL;
    return { ...ESTADO_INICIAL, ...(JSON.parse(guardado) as Partial<EstadoAccesibilidad>) };
  } catch {
    return ESTADO_INICIAL;
  }
}

export default function AccesibilidadWidget() {
  const { esEspanol } = useIdioma();
  const [abierto, setAbierto] = useState(false);
  const [listo, setListo] = useState(false);
  const [estado, setEstado] = useState<EstadoAccesibilidad>(ESTADO_INICIAL);

  // El estado guardado solo se puede leer en el navegador. Se carga
  // en un efecto para que el primer render coincida con el que arma
  // el servidor (si no, React se queja de un mismatch de hidratación).
  useEffect(() => {
    setEstado(leerEstadoGuardado());
    setListo(true);
  }, []);

  useEffect(() => {
    if (!listo) return;
    const html = document.documentElement;
    html.style.fontSize = estado.escalaTexto === 100 ? '' : `${estado.escalaTexto}%`;
    html.classList.toggle('a11y-contraste', estado.contraste);
    html.classList.toggle('a11y-enlaces', estado.enlaces);
    html.classList.toggle('a11y-espaciado', estado.espaciado);
    html.classList.toggle('a11y-interlineado', estado.interlineado);
    html.classList.toggle('a11y-sin-animaciones', estado.sinAnimaciones);
    html.classList.toggle('a11y-sin-imagenes', estado.sinImagenes);
    html.classList.toggle('a11y-dislexia', estado.dislexia);
    html.classList.toggle('a11y-cursor-grande', estado.cursorGrande);
    try {
      window.localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(estado));
    } catch {
      // Sin almacenamiento los ajustes valen para esta visita nada más.
    }
  }, [estado, listo]);

  useEffect(() => {
    if (!abierto) return;
    function alCerrarConEscape(evento: KeyboardEvent) {
      if (evento.key === 'Escape') setAbierto(false);
    }
    window.addEventListener('keydown', alCerrarConEscape);
    return () => window.removeEventListener('keydown', alCerrarConEscape);
  }, [abierto]);

  const t = (es: string, en: string) => (esEspanol ? es : en);

  function alternar(clave: ClaveInterruptor) {
    setEstado((previo) => ({ ...previo, [clave]: !previo[clave] }));
  }

  function cambiarEscala(delta: number) {
    setEstado((previo) => ({
      ...previo,
      escalaTexto: Math.min(ESCALA_MAX, Math.max(ESCALA_MIN, previo.escalaTexto + delta)),
    }));
  }

  function restablecer() {
    setEstado(ESTADO_INICIAL);
  }

  return (
    <>
      <button
        type="button"
        className="accesibilidad-boton"
        aria-haspopup="dialog"
        aria-expanded={abierto}
        aria-label={t('Abrir menú de accesibilidad', 'Open accessibility menu')}
        onClick={() => setAbierto(true)}
      >
        <IconoAccesibilidad />
      </button>

      {abierto && (
        <>
          <div className="accesibilidad-fondo" onClick={() => setAbierto(false)} />
          <div
            className="accesibilidad-panel"
            role="dialog"
            aria-modal="true"
            aria-label={t('Menú de accesibilidad', 'Accessibility menu')}
          >
            <div className="accesibilidad-panel-encabezado">
              <h2>{t('Accesibilidad', 'Accessibility')}</h2>
              <button
                type="button"
                className="accesibilidad-cerrar"
                aria-label={t('Cerrar', 'Close')}
                onClick={() => setAbierto(false)}
              >
                <IconoCerrar />
              </button>
            </div>

            <div className="accesibilidad-panel-cuerpo">
              <div className="accesibilidad-fila-texto">
                <span>{t('Tamaño de texto', 'Text size')}</span>
                <div className="accesibilidad-fila-texto-botones">
                  <button
                    type="button"
                    className="accesibilidad-paso"
                    onClick={() => cambiarEscala(-ESCALA_PASO)}
                    disabled={estado.escalaTexto <= ESCALA_MIN}
                    aria-label={t('Reducir texto', 'Decrease text')}
                  >
                    A−
                  </button>
                  <span className="accesibilidad-porcentaje">{estado.escalaTexto}%</span>
                  <button
                    type="button"
                    className="accesibilidad-paso"
                    onClick={() => cambiarEscala(ESCALA_PASO)}
                    disabled={estado.escalaTexto >= ESCALA_MAX}
                    aria-label={t('Aumentar texto', 'Increase text')}
                  >
                    A+
                  </button>
                </div>
              </div>

              <div className="accesibilidad-cuadricula">
                <ItemAccesibilidad
                  activo={estado.contraste}
                  etiqueta={t('Alto contraste', 'High contrast')}
                  icono={<IconoContraste />}
                  onClick={() => alternar('contraste')}
                />
                <ItemAccesibilidad
                  activo={estado.enlaces}
                  etiqueta={t('Resaltar enlaces', 'Highlight links')}
                  icono={<IconoEnlace />}
                  onClick={() => alternar('enlaces')}
                />
                <ItemAccesibilidad
                  activo={estado.espaciado}
                  etiqueta={t('Espaciado de texto', 'Text spacing')}
                  icono={<IconoEspaciado />}
                  onClick={() => alternar('espaciado')}
                />
                <ItemAccesibilidad
                  activo={estado.interlineado}
                  etiqueta={t('Altura de línea', 'Line height')}
                  icono={<IconoInterlineado />}
                  onClick={() => alternar('interlineado')}
                />
                <ItemAccesibilidad
                  activo={estado.sinAnimaciones}
                  etiqueta={t('Detener animaciones', 'Stop animations')}
                  icono={<IconoPausa />}
                  onClick={() => alternar('sinAnimaciones')}
                />
                <ItemAccesibilidad
                  activo={estado.sinImagenes}
                  etiqueta={t('Ocultar imágenes', 'Hide images')}
                  icono={<IconoImagen />}
                  onClick={() => alternar('sinImagenes')}
                />
                <ItemAccesibilidad
                  activo={estado.dislexia}
                  etiqueta={t('Apto para dislexia', 'Dyslexia friendly')}
                  icono={<IconoDislexia />}
                  onClick={() => alternar('dislexia')}
                />
                <ItemAccesibilidad
                  activo={estado.cursorGrande}
                  etiqueta={t('Cursor grande', 'Large cursor')}
                  icono={<IconoCursor />}
                  onClick={() => alternar('cursorGrande')}
                />
              </div>

              <button type="button" className="accesibilidad-restablecer" onClick={restablecer}>
                {t('Restablecer todo', 'Reset all')}
              </button>
            </div>

            <div className="accesibilidad-panel-pie">
              {t(
                'Rutas Turísticas Pérez Zeledón — ajustes guardados en este dispositivo',
                'Rutas Turísticas Pérez Zeledón — settings saved on this device',
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

interface PropsItem {
  activo: boolean;
  etiqueta: string;
  icono: ReactNode;
  onClick: () => void;
}

function ItemAccesibilidad({ activo, etiqueta, icono, onClick }: PropsItem) {
  return (
    <button type="button" className="accesibilidad-item" aria-pressed={activo} onClick={onClick}>
      {icono}
      <span>{etiqueta}</span>
    </button>
  );
}

// Iconos propios, en SVG en línea, para no depender de una fuente de
// iconos externa ni de conexión a internet.

function IconoAccesibilidad() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="4.5" r="1.8" fill="currentColor" stroke="none" />
      <path d="M4 8.5 L20 8.5" />
      <path d="M12 8.5 L12 14 L16.5 20" />
      <path d="M12 14 L7.5 20" />
      <path d="M9 11.5 L15 11.5" />
    </svg>
  );
}

function IconoCerrar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M5 5 L19 19" />
      <path d="M19 5 L5 19" />
    </svg>
  );
}

function IconoContraste() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3 A9 9 0 0 1 12 21 Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconoEnlace() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9.5 14.5 L14.5 9.5" />
      <path d="M11 7.5 L13 5.5 A3.2 3.2 0 0 1 17.5 10 L15.5 12" />
      <path d="M13 16.5 L11 18.5 A3.2 3.2 0 0 1 6.5 14 L8.5 12" />
    </svg>
  );
}

function IconoEspaciado() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 12 L8 12" />
      <path d="M16 12 L20 12" />
      <path d="M6 9 L4 12 L6 15" />
      <path d="M18 9 L20 12 L18 15" />
      <path d="M11 8 L13 8" />
      <path d="M11 16 L13 16" />
    </svg>
  );
}

function IconoInterlineado() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 5 L20 5" />
      <path d="M9 12 L20 12" />
      <path d="M9 19 L20 19" />
      <path d="M4 4 L4 20" />
      <path d="M2 6 L4 4 L6 6" />
      <path d="M2 18 L4 20 L6 18" />
    </svg>
  );
}

function IconoPausa() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function IconoImagen() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <circle cx="9" cy="10" r="1.6" fill="currentColor" stroke="none" />
      <path d="M4 17 L9.5 12.5 L13 15.5 L16.5 12 L20 15.5" />
      <path d="M3 3 L21 21" />
    </svg>
  );
}

function IconoDislexia() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18 L6 6 L10.5 6 A3.5 3.5 0 0 1 10.5 13 L6 13" />
      <path d="M14 18 L14 6" />
      <path d="M18 6 L14 6" />
      <path d="M14 12 L17.5 12" />
      <path d="M14 18 L18 18" />
    </svg>
  );
}

function IconoCursor() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M4 3 L4 19 L8.2 15.4 L10.6 20.5 L13.2 19.3 L10.8 14.2 L16.5 13.8 Z" />
    </svg>
  );
}
