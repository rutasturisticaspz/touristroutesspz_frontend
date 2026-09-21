'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

// Aparición con animación al entrar en pantalla.
// Reemplaza a react-reveal, que quedó sin mantenimiento y no funciona
// con React 19. Usa IntersectionObserver y las clases de animate.css
// que el proyecto ya traía, así que se ve igual que antes.
export default function Reveal({
  children,
  effect = 'fadeInLeft',
  duration = 500,
  className,
}: {
  children: ReactNode;
  effect?: string;
  duration?: number;
  className?: string;
}) {
  const referencia = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const elemento = referencia.current;
    if (!elemento) return;

    // Si el navegador no lo soporta, se muestra sin animación.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={referencia}
      className={[className, visible ? `animated ${effect}` : undefined]
        .filter(Boolean)
        .join(' ')}
      style={{
        animationDuration: `${duration}ms`,
        visibility: visible ? 'visible' : 'hidden',
      }}
    >
      {children}
    </div>
  );
}
