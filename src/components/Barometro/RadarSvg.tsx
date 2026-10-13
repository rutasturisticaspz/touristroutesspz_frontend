import { direccionDeEje, type ResultadoDimension } from '../../lib/barometro';

// SVG radar chart, without charting libraries. One axis per
// dimension, from 0% at the center to 100% at the edge.

const TAMANO = 360;
const CENTRO = TAMANO / 2;
const RADIO = 110;
const RADIO_ETIQUETAS = RADIO + 18;
const ANILLOS = [20, 40, 60, 80, 100];
const CARACTERES_POR_LINEA = 16;

function punto(indice: number, total: number, radio: number): [number, number] {
  const [cos, sen] = direccionDeEje(indice, total);
  return [CENTRO + radio * cos, CENTRO + radio * sen];
}

function poligono(puntos: Array<[number, number]>): string {
  return puntos.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

// Splits a long label into lines of a few words.
function partirEtiqueta(texto: string): string[] {
  const lineas: string[] = [];
  for (const palabra of texto.split(' ')) {
    const ultima = lineas[lineas.length - 1];
    if (ultima && `${ultima} ${palabra}`.length <= CARACTERES_POR_LINEA) {
      lineas[lineas.length - 1] = `${ultima} ${palabra}`;
    } else {
      lineas.push(palabra);
    }
  }
  return lineas;
}

function anclaje(x: number): 'start' | 'middle' | 'end' {
  if (x < CENTRO - 8) return 'end';
  if (x > CENTRO + 8) return 'start';
  return 'middle';
}

export default function RadarSvg({ dimensiones }: { dimensiones: ResultadoDimension[] }) {
  const total = dimensiones.length;
  const datos = dimensiones.map((d, i) => punto(i, total, (RADIO * (d.porcentaje ?? 0)) / 100));
  const descripcion = dimensiones
    .map((d) => `${d.nombre}: ${d.porcentaje === null ? 'sin datos' : `${d.porcentaje}%`}`)
    .join('. ');

  return (
    <svg
      className="rt_baro_radar"
      viewBox={`0 0 ${TAMANO} ${TAMANO}`}
      role="img"
      aria-label={`Desempeño por dimensión. ${descripcion}`}
    >
      {ANILLOS.map((nivel) => (
        <polygon
          key={nivel}
          className="rt_baro_radar_anillo"
          points={poligono(dimensiones.map((_, i) => punto(i, total, (RADIO * nivel) / 100)))}
        />
      ))}

      {dimensiones.map((dimension, i) => {
        const [x, y] = punto(i, total, RADIO);
        const [xEtiqueta, yEtiqueta] = punto(i, total, RADIO_ETIQUETAS);
        const lineas = partirEtiqueta(dimension.nombre);
        return (
          <g key={dimension.nombre}>
            <line className="rt_baro_radar_eje" x1={CENTRO} y1={CENTRO} x2={x} y2={y} />
            <text
              className="rt_baro_radar_etiqueta"
              x={xEtiqueta}
              y={yEtiqueta - ((lineas.length - 1) * 6) / 2}
              textAnchor={anclaje(xEtiqueta)}
              dominantBaseline="middle"
            >
              {lineas.map((linea, n) => (
                <tspan key={linea} x={xEtiqueta} dy={n === 0 ? 0 : 12}>
                  {linea}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}

      <polygon className="rt_baro_radar_area" points={poligono(datos)} />
      {datos.map(([x, y], i) => (
        <circle key={dimensiones[i].nombre} className="rt_baro_radar_punto" cx={x} cy={y} r={3.5} />
      ))}
    </svg>
  );
}
