'use client';

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import '../../styles/accesibilidad.css';
import { useIdioma } from '../../context/IdiomaContext';

// Accessibility menu.
// It is a floating button, present on all pages (mounted only once in
// the root layout), that opens a panel to adjust text size, contrast,
// spacing, animations, images, typography and cursor. The settings
// are saved in localStorage and reapplied on every visit.
// The button can be dragged to any of the four corners, or the corner
// can be chosen from the panel (for those who do not use a pointer).
// The effects themselves (the `a11y-*` classes) are in
// `src/styles/accesibilidad.css`; this component only holds the state
// and turns those classes on/off on <html>.

const CLAVE_ALMACENAMIENTO = 'accesibilidad-rt';
const CLAVE_ESQUINA = 'accesibilidad-rt-esquina';
const TAMANO_BOTON = 52;
const MARGEN_BOTON = 16;
// How far the pointer has to move for it to count as a drag and not
// as a click with a shaky hand.
const UMBRAL_ARRASTRE = 6;
// Window in which the click the browser fires when a drag is released
// is ignored.
const MS_IGNORAR_CLIC = 300;
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

// The button lives in one of the four corners. The position is saved
// separately from the settings: "Reset all" does not move it.
const ESQUINAS = ['superior-izquierda', 'superior-derecha', 'inferior-izquierda', 'inferior-derecha'] as const;
type Esquina = (typeof ESQUINAS)[number];
const ESQUINA_INICIAL: Esquina = 'inferior-izquierda';

type Traducir = (es: string, en: string) => string;

const ROTULO_ESQUINA: Record<Esquina, (t: Traducir) => string> = {
  'superior-izquierda': (t) => t('Arriba a la izquierda', 'Top left'),
  'superior-derecha': (t) => t('Arriba a la derecha', 'Top right'),
  'inferior-izquierda': (t) => t('Abajo a la izquierda', 'Bottom left'),
  'inferior-derecha': (t) => t('Abajo a la derecha', 'Bottom right'),
};

function esEsquina(valor: unknown): valor is Esquina {
  return (ESQUINAS as readonly unknown[]).includes(valor);
}

function leerEsquinaGuardada(): Esquina {
  try {
    const guardada = window.localStorage.getItem(CLAVE_ESQUINA);
    return esEsquina(guardada) ? guardada : ESQUINA_INICIAL;
  } catch {
    return ESQUINA_INICIAL;
  }
}

function esquinaMasCercana(x: number, y: number): Esquina {
  const vertical = y < window.innerHeight / 2 ? 'superior' : 'inferior';
  const horizontal = x < window.innerWidth / 2 ? 'izquierda' : 'derecha';
  return `${vertical}-${horizontal}`;
}

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
  const [esquina, setEsquina] = useState<Esquina>(ESQUINA_INICIAL);
  // Button position while dragging; null when it is in a corner.
  const [arrastre, setArrastre] = useState<{ x: number; y: number } | null>(null);
  const gesto = useRef<{ inicioX: number; inicioY: number; movido: boolean } | null>(null);
  const finDeUltimoArrastre = useRef(0);

  // The saved state can only be read in the browser. It is loaded in an
  // effect so the first render matches the one the server builds
  // (otherwise, React complains about a hydration mismatch).
  useEffect(() => {
    setEstado(leerEstadoGuardado());
    setEsquina(leerEsquinaGuardada());
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
      // Without storage the settings only apply for this visit.
    }
  }, [estado, listo]);

  useEffect(() => {
    if (!listo) return;
    try {
      window.localStorage.setItem(CLAVE_ESQUINA, esquina);
    } catch {
      // Without storage the position only applies for this visit.
    }
  }, [esquina, listo]);

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

  function alPresionarBoton(evento: PointerEvent<HTMLButtonElement>) {
    gesto.current = { inicioX: evento.clientX, inicioY: evento.clientY, movido: false };
    evento.currentTarget.setPointerCapture(evento.pointerId);
  }

  function alMoverBoton(evento: PointerEvent<HTMLButtonElement>) {
    const actual = gesto.current;
    if (!actual) return;
    const distancia = Math.hypot(evento.clientX - actual.inicioX, evento.clientY - actual.inicioY);
    if (!actual.movido && distancia < UMBRAL_ARRASTRE) return;
    actual.movido = true;
    setArrastre({ x: evento.clientX, y: evento.clientY });
  }

  function alSoltarBoton(evento: PointerEvent<HTMLButtonElement>) {
    const actual = gesto.current;
    gesto.current = null;
    if (!actual?.movido) return;
    finDeUltimoArrastre.current = performance.now();
    setEsquina(esquinaMasCercana(evento.clientX, evento.clientY));
    setArrastre(null);
  }

  function alCancelarGesto() {
    gesto.current = null;
    setArrastre(null);
  }

  // A drag ends in a click; that click must not open the panel.
  function alHacerClicEnBoton() {
    if (performance.now() - finDeUltimoArrastre.current < MS_IGNORAR_CLIC) return;
    setAbierto(true);
  }

  const estiloArrastre = arrastre && {
    left: Math.max(0, arrastre.x - TAMANO_BOTON / 2),
    top: Math.max(0, arrastre.y - TAMANO_BOTON / 2),
    right: 'auto',
    bottom: 'auto',
  };
  const ladoDelPanel = esquina.endsWith('derecha') ? 'derecha' : 'izquierda';

  return (
    <>
      <button
        type="button"
        className="accesibilidad-boton"
        data-esquina={esquina}
        data-arrastrando={arrastre !== null}
        style={estiloArrastre || undefined}
        aria-haspopup="dialog"
        aria-expanded={abierto}
        aria-label={t('Abrir menú de accesibilidad', 'Open accessibility menu')}
        onClick={alHacerClicEnBoton}
        onPointerDown={alPresionarBoton}
        onPointerMove={alMoverBoton}
        onPointerUp={alSoltarBoton}
        onPointerCancel={alCancelarGesto}
      >
        <IconoAccesibilidad />
      </button>

      {abierto && (
        <>
          <div className="accesibilidad-fondo" onClick={() => setAbierto(false)} />
          <div
            className="accesibilidad-panel"
            data-lado={ladoDelPanel}
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

              <div className="accesibilidad-fila-texto accesibilidad-fila-posicion">
                <span id="accesibilidad-posicion">
                  {t('Posición del botón', 'Button position')}
                </span>
                <div
                  className="accesibilidad-esquinas"
                  role="group"
                  aria-labelledby="accesibilidad-posicion"
                >
                  {ESQUINAS.map((opcion) => (
                    <button
                      key={opcion}
                      type="button"
                      className="accesibilidad-esquina"
                      data-esquina={opcion}
                      aria-pressed={esquina === opcion}
                      aria-label={ROTULO_ESQUINA[opcion](t)}
                      title={ROTULO_ESQUINA[opcion](t)}
                      onClick={() => setEsquina(opcion)}
                    />
                  ))}
                </div>
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

// Own icons, inline SVG, so as not to depend on an external icon font
// or on an internet connection.

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
