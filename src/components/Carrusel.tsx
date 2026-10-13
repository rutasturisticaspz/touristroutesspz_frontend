'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

// react-slick wrapper.
// It is loaded only in the browser (`ssr: false`). react-slick
// measures the container width when mounting, which does not exist on
// the server; without this Next builds HTML that does not match what
// the browser paints and warns of a hydration mismatch.
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
