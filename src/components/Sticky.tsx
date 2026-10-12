'use client';

import { useEffect, useState, type ReactNode } from 'react';

// Bar that sticks on scroll.
// Replaces react-stickynode, which has no version compatible with
// React 19. It applies the same `navbar_fixed` class that the
// inherited styles already use, so the visual result is the same
// without adding one more dependency.
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
