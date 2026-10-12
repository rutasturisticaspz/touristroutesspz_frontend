'use client';

import { useEffect } from 'react';
import '../styles/toast.css';

// Floating notification for the public site (forms, etc).
// Before, the "message sent" confirmation was just text that appeared
// below the button -- easy to miss, especially if the form is long or
// on a phone you have to scroll. This component always appears in the
// same position, on top of everything else, and closes by itself.

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
