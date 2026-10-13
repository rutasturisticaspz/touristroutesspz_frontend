// Sustainable Tourism Barometer: self-assessment instrument and its
// scoring. Data and calculation only; the screen is in
// components/Barometro.

export const RESPUESTAS = ['Sí', 'Parcialmente', 'En proceso', 'No', 'No aplica'] as const;
export type Respuesta = (typeof RESPUESTAS)[number];

const PUNTOS: Record<Exclude<Respuesta, 'No aplica'>, number> = {
  Sí: 1,
  Parcialmente: 0.6,
  'En proceso': 0.3,
  No: 0,
};

export interface Dimension {
  nombre: string;
  indicadores: readonly string[];
}

export const DIMENSIONES: readonly Dimension[] = [
  {
    nombre: 'Uso sostenible de la biodiversidad',
    indicadores: [
      'Su principal atractivo, servicio o producto está vinculado a la observación, fotografía, monitoreo, investigación y/o protección de bosques y/o especies silvestres.',
      'Dentro de sus servicios o productos se integran elementos educativos, pedagógicos o informativos que permitan a clientes aprender sobre la biodiversidad local.',
      'En el negocio se utilizan tecnologías para el registro, monitoreo, aprendizaje o difusión de la biodiversidad (p. ej., ciencia ciudadana, sistemas de reporte o identificación de especies).',
      'El emprendimiento cuenta con experiencia en proyectos de instituciones, organizaciones o fundaciones asociados a la conservación, estudio o promoción de la biodiversidad.',
      'La actividad, servicio o producto aporta a la conservación y uso sustentable de la biodiversidad local.',
    ],
  },
  {
    nombre: 'Gestión del recurso hídrico',
    indicadores: [
      'Existe un plan para el ahorro de agua o se implementa alguna acción específica de ahorro.',
      'Se ha realizado una reunión o taller de sensibilización sobre el uso eficiente del agua.',
      'Se utilizan letreros, carteles o publicaciones que comuniquen los beneficios del ahorro de agua.',
      'Se cuenta con un sistema de tratamiento de aguas residuales, como biojardineras, trampas de grasa o filtros.',
      'Se aprovecha el agua de lluvia, aguas residuales u otras fuentes.',
    ],
  },
  {
    nombre: 'Manejo integral de residuos',
    indicadores: [
      'Se tiene un programa o plan para el manejo de residuos o desechos.',
      'Se reutilizan residuos ordinarios, como envases plásticos o cajas para almacenar insumos.',
      'Se aprovechan residuos orgánicos para compost, abono o alimento para animales.',
      'Se separan adecuadamente los residuos ordinarios: papel-cartón, tetrabrik, plásticos, aluminio y hojalata.',
      'Existe coordinación con municipalidad, instituciones, organizaciones, grupos locales o empresas privadas para programas de reciclaje.',
    ],
  },
  {
    nombre: 'Energía y emisiones',
    indicadores: [
      'Existe un plan para el ahorro de energía o se implementa alguna acción específica.',
      'Se ha capacitado o explicado al personal el uso y ahorro eficiente de la energía eléctrica.',
      'Se ha calculado o registrado al menos una vez la cantidad de emisiones generadas en el establecimiento.',
      'Se utiliza algún tipo de energía renovable: solar, eólica, hidráulica u otra.',
    ],
  },
  {
    nombre: 'Compras e insumos verdes',
    indicadores: [
      'Se reutilizan productos o materiales de más de un uso, como bolsas de tela, vidrio, plástico, metales o textiles.',
      'Se elimina el uso de estereofón dentro del establecimiento.',
      'Se elimina el uso de plásticos de un solo uso.',
      'Se realizan compras de insumos biodegradables, como bolsas, envases o empaques.',
    ],
  },
  {
    nombre: 'Alianzas estratégicas',
    indicadores: [
      'Se tienen alianzas con instituciones públicas, organizaciones locales o internacionales, o programas ambientales.',
      'Se participa en encadenamientos productivos para obtener o gestionar productos o servicios locales.',
      'El negocio ha participado en capacitaciones, proyectos o iniciativas asociadas al medioambiente.',
    ],
  },
  {
    nombre: 'Elementos de innovación',
    indicadores: [
      'Se utilizan redes sociales interactivas como Facebook o Instagram para promocionar la oferta y comunicarse con clientes.',
      'Se facilitan métodos de pago digitales, como SINPE, PayPal u otros.',
      'Se utilizan aplicaciones móviles, programas o sistemas que mejoren la experiencia de las personas usuarias.',
      'Se utilizan imágenes, videos, podcast u otros mecanismos audiovisuales para comunicar atractivos, servicios o productos.',
    ],
  },
  {
    nombre: 'Perspectiva sociocultural',
    indicadores: [
      'Existe una política o estrategia de inclusión social en empleabilidad para poblaciones indígenas, mujeres locales, jóvenes, campesinado, personas con discapacidad, personas migrantes u otras.',
      'El negocio integra acciones de accesibilidad para personas con discapacidad.',
      'Se emplean personas locales de la propia comunidad.',
      'Existen protocolos de espacios seguros para prevenir acoso y abuso sexual.',
      'El negocio busca resaltar, proteger o gestionar elementos del patrimonio cultural local.',
    ],
  },
];

export type Nivel = 'Avanzado' | 'En consolidación' | 'Inicial' | 'Prioritario';

const UMBRAL_AVANZADO = 80;
const UMBRAL_CONSOLIDACION = 60;
const UMBRAL_INICIAL = 40;

export function nivelDe(porcentaje: number): Nivel {
  if (porcentaje >= UMBRAL_AVANZADO) return 'Avanzado';
  if (porcentaje >= UMBRAL_CONSOLIDACION) return 'En consolidación';
  if (porcentaje >= UMBRAL_INICIAL) return 'Inicial';
  return 'Prioritario';
}

export type Tono = 'bueno' | 'medio' | 'bajo';

export function tonoDe(porcentaje: number): Tono {
  if (porcentaje >= UMBRAL_CONSOLIDACION) return 'bueno';
  if (porcentaje >= UMBRAL_INICIAL) return 'medio';
  return 'bajo';
}

// Answers per dimension: respuestas[d][i] is the one for indicator i
// of dimension d, or undefined if it has not been answered yet.
export type Respuestas = ReadonlyArray<ReadonlyArray<Respuesta | undefined>>;

export function respuestasVacias(): Respuestas {
  return DIMENSIONES.map((d) => d.indicadores.map(() => undefined));
}

export interface ResultadoDimension {
  nombre: string;
  // Answered and applicable indicators ("No aplica" ones do not count).
  validos: number;
  // null while there is no valid indicator.
  porcentaje: number | null;
}

export interface Resultado {
  dimensiones: ResultadoDimension[];
  validos: number;
  sinResponder: number;
  // null while there is no valid indicator.
  porcentaje: number | null;
}

export function calcular(respuestas: Respuestas): Resultado {
  let puntosTotales = 0;
  let validosTotales = 0;
  let sinResponder = 0;

  const dimensiones = DIMENSIONES.map((dimension, d) => {
    let puntos = 0;
    let validos = 0;
    for (const respuesta of respuestas[d]) {
      if (respuesta === undefined) sinResponder++;
      else if (respuesta !== 'No aplica') {
        validos++;
        puntos += PUNTOS[respuesta];
      }
    }
    puntosTotales += puntos;
    validosTotales += validos;
    return {
      nombre: dimension.nombre,
      validos,
      porcentaje: validos ? Math.round((puntos / validos) * 100) : null,
    };
  });

  return {
    dimensiones,
    validos: validosTotales,
    sinResponder,
    porcentaje: validosTotales ? Math.round((puntosTotales / validosTotales) * 100) : null,
  };
}

export interface DatosNegocio {
  nombre: string;
  actividad: string;
  ubicacion: string;
}

export function resumenDe(porcentaje: number | null): string {
  if (porcentaje === null) return 'Responda los indicadores para ver su resultado.';
  return `El nivel global es ${nivelDe(porcentaje).toLowerCase()}. Priorice las dimensiones con menor puntaje y convierta las acciones “en proceso” en prácticas verificables.`;
}

function indicadores(cantidad: number): string {
  return cantidad === 1 ? '1 indicador' : `${cantidad} indicadores`;
}

export function notaBaseDeCalculo({ validos, sinResponder }: Resultado): string {
  const base = `Base de cálculo: ${indicadores(validos)} ${validos === 1 ? 'aplicable' : 'aplicables'}.`;
  return sinResponder > 0 ? `${base} ${indicadores(sinResponder)} sin responder.` : base;
}

export const AVISO_IMPORTANTE_TITULO = 'Importante:';
export const AVISO_IMPORTANTE_TEXTO =
  ' este resultado es un autodiagnóstico orientativo. Las respuestas “Sí”, “Parcialmente” y “En proceso” deben respaldarse con evidencias verificables (documentos, fotografías, registros, capacitaciones, sistemas instalados o visitas de campo).';

// Direction (cosine, sine) of axis `indice` of a radar with `total`
// axes. The first one points up and the rest follow clockwise.
export function direccionDeEje(indice: number, total: number): [number, number] {
  const angulo = -Math.PI / 2 + (indice / total) * 2 * Math.PI;
  return [Math.cos(angulo), Math.sin(angulo)];
}
