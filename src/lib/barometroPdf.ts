import type { jsPDF } from 'jspdf';
import {
  AVISO_IMPORTANTE_TEXTO,
  AVISO_IMPORTANTE_TITULO,
  direccionDeEje,
  nivelDe,
  notaBaseDeCalculo,
  resumenDe,
  tonoDe,
  type DatosNegocio,
  type Resultado,
  type ResultadoDimension,
  type Tono,
} from './barometro';

// Barometer results PDF, with the same structure as seen on screen:
// business data, overall score, radar, table by dimension and notice.
// It is drawn directly with jsPDF (vector text, not a screenshot) and
// the library is only downloaded when the PDF is requested.
// Measurements in millimeters, A4 sheet.

type Color = [number, number, number];
type Punto = [number, number];

const NOMBRE_ARCHIVO = 'resultados_barometro_sostenibilidad.pdf';

const ANCHO_PAGINA = 210;
const MARGEN = 15;
const ANCHO_UTIL = ANCHO_PAGINA - 2 * MARGEN;

const VERDE: Color = [8, 106, 75];
const VERDE_CLARO: Color = [18, 146, 105];
const TINTA: Color = [24, 51, 43];
const GRIS: Color = [98, 118, 111];
const LINEA: Color = [219, 230, 224];
const FONDO_TABLA: Color = [237, 245, 240];
const VERDE_OSCURO: Color = [23, 85, 63];
const AMBAR: Color = [233, 162, 59];
const ROJO: Color = [220, 95, 95];
const BLANCO: Color = [255, 255, 255];
const FONDO_AVISO: Color = [255, 248, 233];
const ANILLO_VACIO: Color = [226, 235, 230];
const RELLENO_RADAR: Color = [220, 239, 231];
const TRAZO_RADAR: Color = [11, 128, 90];

const COLOR_POR_TONO: Record<Tono, Color> = { bueno: VERDE_CLARO, medio: AMBAR, bajo: ROJO };

const GRADOS_POR_PORCENTAJE = 3.6;
const GRADOS_POR_SEGMENTO = 3;
const INICIO_ARCO = -90;
const ANILLOS_RADAR = [20, 40, 60, 80, 100];

const ALTO_ENCABEZADO = 32;
const ALTO_FILA_TABLA = 8;

export async function descargarPdfBarometro(
  negocio: DatosNegocio,
  resultado: Resultado,
): Promise<void> {
  const { jsPDF: DocumentoPdf } = await import('jspdf');
  const doc = new DocumentoPdf({ unit: 'mm', format: 'a4' });

  dibujarEncabezado(doc);
  dibujarDatosNegocio(doc, negocio, 42);
  titulo(doc, 'Resultados del diagnóstico', 84, 13, TINTA);
  dibujarPuntaje(doc, resultado, 45, 112);
  dibujarRadar(doc, resultado.dimensiones, 140, 118);
  titulo(doc, 'Resultados por dimensión', 180, 11, VERDE);
  const finTabla = dibujarTabla(doc, resultado.dimensiones, 185);
  dibujarAviso(doc, finTabla + 8);

  doc.save(NOMBRE_ARCHIVO);
}

function fijarColorTexto(doc: jsPDF, [r, g, b]: Color) {
  doc.setTextColor(r, g, b);
}

function fijarRelleno(doc: jsPDF, [r, g, b]: Color) {
  doc.setFillColor(r, g, b);
}

function fijarTrazo(doc: jsPDF, [r, g, b]: Color, grosor: number) {
  doc.setDrawColor(r, g, b);
  doc.setLineWidth(grosor);
}

function texto(
  doc: jsPDF,
  contenido: string | string[],
  x: number,
  y: number,
  opciones: { tamano: number; color: Color; negrita?: boolean; alinear?: 'left' | 'center' | 'right' },
) {
  doc.setFont('helvetica', opciones.negrita ? 'bold' : 'normal');
  doc.setFontSize(opciones.tamano);
  fijarColorTexto(doc, opciones.color);
  doc.text(contenido, x, y, { align: opciones.alinear ?? 'left', baseline: 'middle' });
}

function titulo(doc: jsPDF, contenido: string, y: number, tamano: number, color: Color) {
  texto(doc, contenido, MARGEN, y, { tamano, color, negrita: true });
}

function lineasAjustadas(doc: jsPDF, contenido: string, ancho: number, tamano: number): string[] {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(tamano);
  return doc.splitTextToSize(contenido, ancho) as string[];
}

function dibujarEncabezado(doc: jsPDF) {
  fijarRelleno(doc, VERDE);
  doc.rect(0, 0, ANCHO_PAGINA, ALTO_ENCABEZADO, 'F');
  texto(doc, 'Barómetro de Sostenibilidad Turística', MARGEN, 13, {
    tamano: 18,
    color: BLANCO,
    negrita: true,
  });
  texto(doc, 'Autodiagnóstico para empresas y emprendimientos turísticos', MARGEN, 22, {
    tamano: 9.5,
    color: BLANCO,
  });
}

function dibujarDatosNegocio(doc: jsPDF, negocio: DatosNegocio, y: number) {
  titulo(doc, 'Datos del emprendimiento', y, 13, TINTA);

  const fecha = new Date().toLocaleDateString('es-CR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const filas: Array<[string, string]> = [
    ['Nombre del negocio', negocio.nombre],
    ['Actividad turística', negocio.actividad],
    ['Ubicación', negocio.ubicacion],
    ['Fecha del diagnóstico', fecha],
  ];

  filas.forEach(([rotulo, valor], i) => {
    const yFila = y + 8 + i * 6;
    texto(doc, rotulo, MARGEN, yFila, { tamano: 9, color: GRIS, negrita: true });
    texto(doc, valor.trim() || '—', MARGEN + 42, yFila, { tamano: 10, color: TINTA });
  });
}

function puntoEnCircunferencia(cx: number, cy: number, radio: number, grados: number): Punto {
  const radianes = (grados * Math.PI) / 180;
  return [cx + radio * Math.cos(radianes), cy + radio * Math.sin(radianes)];
}

function arco(cx: number, cy: number, radio: number, desde: number, hasta: number): Punto[] {
  const segmentos = Math.max(2, Math.ceil(Math.abs(hasta - desde) / GRADOS_POR_SEGMENTO));
  return Array.from({ length: segmentos + 1 }, (_, i) =>
    puntoEnCircunferencia(cx, cy, radio, desde + ((hasta - desde) * i) / segmentos),
  );
}

type EstiloTrazo = 'S' | 'F' | 'FD';

function poligono(doc: jsPDF, puntos: Punto[], estilo: EstiloTrazo) {
  const [[x0, y0], ...resto] = puntos;
  const vectores = resto.map(([x, y], i) => [x - puntos[i][0], y - puntos[i][1]]);
  doc.lines(vectores, x0, y0, [1, 1], estilo, true);
}

function dibujarSectorAnular(
  doc: jsPDF,
  centro: Punto,
  radios: { interno: number; externo: number },
  grados: { desde: number; hasta: number },
) {
  const [cx, cy] = centro;
  poligono(
    doc,
    [
      ...arco(cx, cy, radios.externo, grados.desde, grados.hasta),
      ...arco(cx, cy, radios.interno, grados.hasta, grados.desde),
    ],
    'F',
  );
}

function dibujarPuntaje(doc: jsPDF, resultado: Resultado, cx: number, cy: number) {
  const { porcentaje } = resultado;
  const radios = { interno: 17, externo: 22 };

  fijarRelleno(doc, ANILLO_VACIO);
  dibujarSectorAnular(doc, [cx, cy], radios, { desde: INICIO_ARCO, hasta: INICIO_ARCO + 360 });

  if (porcentaje !== null && porcentaje > 0) {
    fijarRelleno(doc, COLOR_POR_TONO[tonoDe(porcentaje)]);
    dibujarSectorAnular(doc, [cx, cy], radios, {
      desde: INICIO_ARCO,
      hasta: INICIO_ARCO + porcentaje * GRADOS_POR_PORCENTAJE,
    });
  }

  texto(doc, porcentaje === null ? '—' : `${porcentaje}%`, cx, cy - 2, {
    tamano: 20,
    color: TINTA,
    negrita: true,
    alinear: 'center',
  });
  texto(doc, porcentaje === null ? 'Sin calcular' : nivelDe(porcentaje), cx, cy + 6, {
    tamano: 8,
    color: TINTA,
    negrita: true,
    alinear: 'center',
  });

  const ancho = 66;
  const resumen = lineasAjustadas(doc, resumenDe(porcentaje), ancho, 9);
  texto(doc, resumen, cx, cy + 31, { tamano: 9, color: GRIS, alinear: 'center' });

  if (porcentaje !== null) {
    const yNota = cy + 31 + resumen.length * 4 + 3;
    const nota = lineasAjustadas(doc, notaBaseDeCalculo(resultado), ancho, 8.5);
    texto(doc, nota, cx, yNota, { tamano: 8.5, color: GRIS, alinear: 'center' });
  }
}

function dibujarRadar(doc: jsPDF, dimensiones: ResultadoDimension[], cx: number, cy: number) {
  const radio = 26;
  const total = dimensiones.length;
  const enEje = (indice: number, distancia: number): Punto => {
    const [cos, sen] = direccionDeEje(indice, total);
    return [cx + distancia * cos, cy + distancia * sen];
  };

  fijarTrazo(doc, LINEA, 0.2);
  for (const nivel of ANILLOS_RADAR) {
    poligono(
      doc,
      dimensiones.map((_, i) => enEje(i, (radio * nivel) / 100)),
      'S',
    );
  }
  dimensiones.forEach((_, i) => {
    const [x, y] = enEje(i, radio);
    doc.line(cx, cy, x, y);
  });

  fijarRelleno(doc, RELLENO_RADAR);
  fijarTrazo(doc, TRAZO_RADAR, 0.6);
  const datos = dimensiones.map((d, i) => enEje(i, (radio * (d.porcentaje ?? 0)) / 100));
  poligono(doc, datos, 'FD');

  fijarRelleno(doc, TRAZO_RADAR);
  for (const [x, y] of datos) doc.circle(x, y, 0.8, 'F');

  dimensiones.forEach((dimension, i) =>
    dibujarEtiquetaRadar(doc, dimension.nombre, enEje(i, radio + 3), [cx, cy]),
  );
}

// Label next to the tip of an axis: aligned away from the radar and
// shifted vertically depending on how high or low it falls.
function dibujarEtiquetaRadar(doc: jsPDF, nombre: string, [x, y]: Punto, [cx, cy]: Punto) {
  const altoLinea = 3.2;
  const tamano = 7;
  const anchoMaximo = 27;
  const lineas = lineasAjustadas(doc, nombre, anchoMaximo, tamano);
  const alto = (lineas.length - 1) * altoLinea;
  const dx = x - cx;
  const dy = y - cy;
  const alinear = Math.abs(dx) < 2 ? 'center' : dx < 0 ? 'right' : 'left';
  const primeraLinea = y - alto / 2 + (dy / Math.hypot(dx, dy)) * (alto / 2 + 1);

  lineas.forEach((linea, n) => {
    texto(doc, linea, x, primeraLinea + n * altoLinea, { tamano, color: TINTA, alinear });
  });
}

function dibujarTabla(doc: jsPDF, dimensiones: ResultadoDimension[], y: number): number {
  const columnas = { dimension: MARGEN + 2, validos: 124, puntaje: 144, lectura: 163 };

  fijarRelleno(doc, FONDO_TABLA);
  doc.rect(MARGEN, y, ANCHO_UTIL, ALTO_FILA_TABLA, 'F');
  const encabezados: Array<[string, number]> = [
    ['Dimensión', columnas.dimension],
    ['Indicadores válidos', columnas.validos],
    ['Puntaje', columnas.puntaje],
    ['Lectura', columnas.lectura],
  ];
  for (const [rotulo, x] of encabezados) {
    texto(doc, rotulo, x, y + ALTO_FILA_TABLA / 2, {
      tamano: 9,
      color: VERDE_OSCURO,
      negrita: true,
      alinear: rotulo === 'Indicadores válidos' ? 'center' : 'left',
    });
  }

  dimensiones.forEach((dimension, i) => {
    const arriba = y + ALTO_FILA_TABLA * (i + 1);
    const medio = arriba + ALTO_FILA_TABLA / 2;
    fijarTrazo(doc, LINEA, 0.2);
    doc.line(MARGEN, arriba + ALTO_FILA_TABLA, MARGEN + ANCHO_UTIL, arriba + ALTO_FILA_TABLA);

    texto(doc, dimension.nombre, columnas.dimension, medio, { tamano: 9, color: TINTA });
    texto(doc, String(dimension.validos), columnas.validos, medio, {
      tamano: 9,
      color: TINTA,
      alinear: 'center',
    });
    const { porcentaje } = dimension;
    texto(doc, porcentaje === null ? 'Sin datos' : `${porcentaje}%`, columnas.puntaje, medio, {
      tamano: 9,
      color: TINTA,
    });

    if (porcentaje === null) {
      texto(doc, '—', columnas.lectura, medio, { tamano: 9, color: TINTA });
    } else {
      dibujarEtiquetaNivel(doc, nivelDe(porcentaje), columnas.lectura - 2, medio);
    }
  });

  return y + ALTO_FILA_TABLA * (dimensiones.length + 1);
}

function dibujarEtiquetaNivel(doc: jsPDF, nivel: string, x: number, yMedio: number) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  const ancho = doc.getTextWidth(nivel) + 5;
  fijarRelleno(doc, FONDO_TABLA);
  doc.roundedRect(x, yMedio - 2.8, ancho, 5.6, 2.8, 2.8, 'F');
  texto(doc, nivel, x + 2.5, yMedio, { tamano: 8, color: VERDE_OSCURO, negrita: true });
}

function dibujarAviso(doc: jsPDF, y: number) {
  const altoLinea = 4.4;
  const anchoTexto = ANCHO_UTIL - 10;
  const lineas = lineasAjustadas(
    doc,
    `${AVISO_IMPORTANTE_TITULO}${AVISO_IMPORTANTE_TEXTO}`,
    anchoTexto,
    9,
  );
  const alto = lineas.length * altoLinea + 7;
  const x = MARGEN + 5;

  fijarRelleno(doc, FONDO_AVISO);
  doc.rect(MARGEN, y, ANCHO_UTIL, alto, 'F');
  fijarRelleno(doc, AMBAR);
  doc.rect(MARGEN, y, 1.2, alto, 'F');

  // The first line starts with the title in bold and continues normal.
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  const anchoTitulo = doc.getTextWidth(AVISO_IMPORTANTE_TITULO);
  texto(doc, AVISO_IMPORTANTE_TITULO, x, y + 5, { tamano: 9, color: TINTA, negrita: true });
  texto(doc, lineas[0].slice(AVISO_IMPORTANTE_TITULO.length), x + anchoTitulo, y + 5, {
    tamano: 9,
    color: TINTA,
  });
  lineas.slice(1).forEach((linea, n) => {
    texto(doc, linea, x, y + 5 + (n + 1) * altoLinea, { tamano: 9, color: TINTA });
  });
}
