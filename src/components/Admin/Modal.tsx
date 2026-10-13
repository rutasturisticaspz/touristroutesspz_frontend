'use client';

import { useEffect, type ReactNode } from 'react';

// Modal window.
// Replaces react-bootstrap's Modal and sweetalert2's boxes, which
// together amounted to two libraries for the same thing.
// It closes with Escape and with a click outside, which sweetalert2's
// did not do in the deletion confirmations.
export default function Modal({
  titulo,
  abierto,
  alCerrar,
  children,
  acciones,
}: {
  titulo: string;
  abierto: boolean;
  alCerrar: () => void;
  children: ReactNode;
  acciones?: ReactNode;
}) {
  useEffect(() => {
    if (!abierto) return;
    const alPresionar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') alCerrar();
    };
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [abierto, alCerrar]);

  if (!abierto) return null;

  return (
    <div className="rt_modal_fondo" onMouseDown={alCerrar} role="presentation">
      <div
        className="rt_modal"
        onMouseDown={(evento) => evento.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
      >
        <h2>{titulo}</h2>
        {children}
        {acciones && <div className="rt_modal_acciones">{acciones}</div>}
      </div>
    </div>
  );
}
