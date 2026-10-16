'use client';

import Link from 'next/link';
import { useRef, type CSSProperties, type MouseEvent } from 'react';
import EtiquetaNuevo from '../Nuevo/EtiquetaNuevo';
import '../../styles/collage.css';
import OptimizedImage from '../OptimizedImage';

// Photo collage for the banners of the list pages.
// It replaces a flat image: each tile is a real photo of the section and
// a link to its page. The tiles shift slightly with the mouse (each at a
// different depth) and the one under the pointer comes forward, straightens
// and shows its name. Whatever is new goes in first (the lists put it at
// the top) and carries the "New" ribbon, so it gets the most visibility. On small screens it becomes a plain grid.

export interface FotoCollage {
  id: number;
  url: string;
  nombre: string;
  href: string;
  // Recently created: it gets the "New" ribbon.
  nuevo: boolean;
}

interface Hueco {
  // Position and size inside the collage, in %.
  izquierda: number;
  arriba: number;
  ancho: number;
  alto: number;
  // Resting tilt, in degrees.
  giro: number;
  // How much it moves with the mouse (bigger = closer to the viewer).
  profundidad: number;
}

// Ordered so that any prefix of the list still looks balanced.
const HUECOS: Hueco[] = [
  { izquierda: 40, arriba: 6, ancho: 22, alto: 46, giro: -2, profundidad: 0.9 },
  { izquierda: 20, arriba: 52, ancho: 24, alto: 42, giro: 2, profundidad: 1.2 },
  { izquierda: 76, arriba: 12, ancho: 21, alto: 42, giro: 3, profundidad: 1.1 },
  { izquierda: 58, arriba: 50, ancho: 22, alto: 44, giro: -2, profundidad: 0.7 },
  { izquierda: 4, arriba: 10, ancho: 22, alto: 42, giro: -4, profundidad: 0.5 },
  { izquierda: 22, arriba: 4, ancho: 18, alto: 40, giro: 3, profundidad: 0.4 },
  { izquierda: 62, arriba: 6, ancho: 15, alto: 38, giro: -3, profundidad: 1.3 },
  { izquierda: 82, arriba: 54, ancho: 16, alto: 38, giro: 4, profundidad: 0.6 },
];

export const MAX_FOTOS_COLLAGE = HUECOS.length;
export const MIN_FOTOS_COLLAGE = 4;

export default function CollageInteractivo({
  fotos,
  imagenDeRespaldo,
}: {
  fotos: FotoCollage[];
  imagenDeRespaldo: string;
}) {
  const contenedor = useRef<HTMLDivElement>(null);

  // Too few photos make a sad collage: the flat image is shown instead.
  if (fotos.length < MIN_FOTOS_COLLAGE) {
    return <OptimizedImage src={imagenDeRespaldo} alt="" className="rt_collage_respaldo" />;
  }

  // The pointer position goes to CSS as two variables between -1 and 1;
  // the tiles do the rest, each according to its depth.
  const alMoverMouse = (evento: MouseEvent<HTMLDivElement>) => {
    const caja = contenedor.current?.getBoundingClientRect();
    if (!caja) return;
    const x = ((evento.clientX - caja.left) / caja.width - 0.5) * 2;
    const y = ((evento.clientY - caja.top) / caja.height - 0.5) * 2;
    contenedor.current?.style.setProperty('--mx', x.toFixed(3));
    contenedor.current?.style.setProperty('--my', y.toFixed(3));
  };

  const alSalirMouse = () => {
    contenedor.current?.style.setProperty('--mx', '0');
    contenedor.current?.style.setProperty('--my', '0');
  };

  return (
    <div
      ref={contenedor}
      className="rt_collage"
      onMouseMove={alMoverMouse}
      onMouseLeave={alSalirMouse}
    >
      {fotos.slice(0, MAX_FOTOS_COLLAGE).map((foto, i) => {
        const hueco = HUECOS[i];
        const estilo = {
          '--izq': `${hueco.izquierda}%`,
          '--arr': `${hueco.arriba}%`,
          '--ancho': `${hueco.ancho}%`,
          '--alto': `${hueco.alto}%`,
          '--giro': `${hueco.giro}deg`,
          '--prof': hueco.profundidad,
          '--retraso': `${i * 70}ms`,
        } as CSSProperties;

        return (
          <Link key={foto.id} href={foto.href} className="rt_collage_foto" style={estilo}>
            {foto.nuevo && <EtiquetaNuevo />}
            <OptimizedImage src={foto.url} alt="" sizes="(max-width: 768px) 50vw, 320px" />
            <span className="rt_collage_nombre">{foto.nombre}</span>
          </Link>
        );
      })}
    </div>
  );
}
