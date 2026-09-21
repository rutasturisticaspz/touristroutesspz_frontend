// Los filtros de accesibilidad del buscador.
// En las URLs publicadas del sitio anterior estos filtros viajan con
// su rótulo en español ("Discapacidad visual", "Permite mascotas").
// Se conservan tal cual para no romper enlaces compartidos, pero aquí
// se traducen al nombre de columna que espera el backend, en vez de
// mandarle el rótulo y confiar en que lo entienda.

export interface FiltroAccesibilidad {
  // Rótulo tal como aparece en la URL.
  rotulo: string;
  // Columna booleana en la base de datos.
  campo: string;
  // Rótulo en inglés, para mostrar.
  ingles: string;
}

export const ACCESIBILIDADES: FiltroAccesibilidad[] = [
  { rotulo: 'Discapacidad visual', campo: 'discapacidadVisual', ingles: 'Visual disability' },
  { rotulo: 'Discapacidad auditiva', campo: 'discapacidadAuditiva', ingles: 'Hearing disability' },
  { rotulo: 'Discapacidad física', campo: 'discapacidadFisica', ingles: 'Physical disability' },
  { rotulo: 'Discapacidad cognitiva', campo: 'discapacidadCognitiva', ingles: 'Cognitive disability' },
  { rotulo: 'Discapacidad sicosocial', campo: 'discapacidadSicosocial', ingles: 'Psychosocial disability' },
];

export const OTROS: FiltroAccesibilidad[] = [
  { rotulo: 'Declaración turística', campo: 'declaracionTuristica', ingles: 'Tourist declaration' },
  { rotulo: 'Permite mascotas', campo: 'permitenMascotas', ingles: 'Pets allowed' },
  { rotulo: 'Permite niños', campo: 'permitenNinos', ingles: 'Children allowed' },
];

const POR_ROTULO = new Map(
  [...ACCESIBILIDADES, ...OTROS].map((f) => [f.rotulo, f.campo] as const),
);

// Nombres de columna a partir de los rótulos que vienen en la URL.
export function camposDeRotulos(rotulos: string[]): string[] {
  return rotulos.map((r) => POR_ROTULO.get(r)).filter((c): c is string => Boolean(c));
}

// "Todos" o vacío significan "sin filtro".
export function leerLista(segmento: string | undefined): string[] {
  if (!segmento || segmento === 'Todos') return [];
  return decodeURIComponent(segmento)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

// Vuelve a armar el segmento de la URL a partir de una lista.
export function escribirLista(valores: string[]): string {
  return valores.length === 0 ? 'Todos' : encodeURIComponent(valores.join(','));
}

// Agrega o quita un valor de la lista.
export function alternar(valores: string[], valor: string): string[] {
  return valores.includes(valor) ? valores.filter((v) => v !== valor) : [...valores, valor];
}
