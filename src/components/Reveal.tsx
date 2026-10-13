'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

// Animated appearance when entering the screen.
// Replaces react-reveal, which became unmaintained and does not work
// with React 19. It uses IntersectionObserver and the animate.css
// classes the project already had, so it looks the same as before.
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

    // If the browser does not support it, it is shown without animation.
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
