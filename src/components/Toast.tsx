'use client';

import { useEffect } from 'react';
import '../styles/toast.css';

// Notificacion flotante para el sitio publico (formularios, etc).
// Antes la confirmacion de "mensaje enviado" era solo un texto que
// aparecia debajo del boton -- facil de no ver, sobre todo si el
// formulario es largo o en el celular hay que hacer scroll. Este
// componente aparece siempre en la misma posicion, arriba de todo lo
// demas, y se cierra solo.

interface Props {
  tipo: 'ok' | 'error';
  children: React.ReactNode;
  alCerrar: () => void;
  duracionMs?: number;
}

export default function Toast({ tipo, children, alCerrar, duracionMs = 6000 }: Props) {
  useEffect(() => {
    const temporizador = setTimeout(alCerrar, duracionMs);
    return () => clearTimeout(temporizador);
  }, [alCerrar, duracionMs]);

  return (
    <div className={`rt_toast rt_toast_${tipo}`} role="status" aria-live="polite">
      <span className="rt_toast_icono" aria-hidden="true">
        {tipo === 'ok' ? '✓' : '!'}
      </span>
      <span className="rt_toast_texto">{children}</span>
      <button type="button" className="rt_toast_cerrar" onClick={alCerrar} aria-label="Cerrar">
        ×
      </button>
    </div>
  );
}
