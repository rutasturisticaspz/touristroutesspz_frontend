'use client';

import { useEffect, useState, type ReactNode } from 'react';

// Barra que se fija al hacer scroll.
// Reemplaza a react-stickynode, que no tiene versión compatible con
// React 19. Aplica la misma clase `navbar_fixed` que ya usan los
// estilos heredados, así que el resultado visual es el mismo sin
// agregar una dependencia más.
export default function Sticky({
  children,
  claseActiva = 'navbar_fixed',
  desde = 0,
}: {
  children: ReactNode;
  claseActiva?: string;
  desde?: number;
}) {
  const [fijo, setFijo] = useState(false);

  useEffect(() => {
    const alHacerScroll = () => setFijo(window.scrollY > desde);
    alHacerScroll();
    window.addEventListener('scroll', alHacerScroll, { passive: true });
    return () => window.removeEventListener('scroll', alHacerScroll);
  }, [desde]);

  return (
    <div className={`sticky-wrapper${fijo ? ` ${claseActiva}` : ''}`} style={{ zIndex: 9999 }}>
      {children}
    </div>
  );
}
