'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

// Envoltura de react-slick.
// Se carga sólo en el navegador (`ssr: false`). react-slick mide el
// ancho del contenedor al montarse, cosa que en el servidor no existe;
// sin esto Next arma un HTML que no coincide con lo que pinta el
// navegador y avisa de discrepancia de hidratación.
const Slider = dynamic(() => import('react-slick'), { ssr: false });

export default function Carrusel({
  opciones,
  className,
  children,
}: {
  opciones: Record<string, unknown>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Slider {...opciones} className={className}>
      {children}
    </Slider>
  );
}
