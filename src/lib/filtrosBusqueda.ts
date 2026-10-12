// The search page's accessibility filters.
// In the published URLs of the previous site these filters travel with
// their Spanish label ("Discapacidad visual", "Permite mascotas").
// They are kept as is so shared links do not break, but here they are
// translated to the column name the backend expects, instead of
// sending it the label and trusting that it understands it.

export interface FiltroAccesibilidad {
  // Label as it appears in the URL.
  rotulo: string;
  // Boolean column in the database.
  campo: string;
  // English label, for display.
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

// Column names from the labels that come in the URL.
export function camposDeRotulos(rotulos: string[]): string[] {
  return rotulos.map((r) => POR_ROTULO.get(r)).filter((c): c is string => Boolean(c));
}

// "Todos" or empty mean "no filter".
export function leerLista(segmento: string | undefined): string[] {
  if (!segmento || segmento === 'Todos') return [];
  return decodeURIComponent(segmento)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

// Rebuilds the URL segment from a list.
export function escribirLista(valores: string[]): string {
  return valores.length === 0 ? 'Todos' : encodeURIComponent(valores.join(','));
}

// Adds or removes a value from the list.
export function alternar(valores: string[], valor: string): string[] {
  return valores.includes(valor) ? valores.filter((v) => v !== valor) : [...valores, valor];
}
