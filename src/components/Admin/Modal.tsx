'use client';

import { useEffect, type ReactNode } from 'react';

// Ventana modal.
// Reemplaza a los Modal de react-bootstrap y a los recuadros de
// sweetalert2, que entre los dos sumaban dos librerías para lo mismo.
// Cierra con Escape y con clic afuera, cosa que los de sweetalert2 no
// hacían en las confirmaciones de borrado.
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
