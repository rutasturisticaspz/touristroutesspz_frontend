// The twelve districts of Pérez Zeledón and their URL segment.
// This used to live loose inside helpers.js as `mapDistritos`, and the
// function that queried it silently returned `undefined` when the name
// did not match —which produced links to /distritos/undefined—. Here
// the lookup ignores case and accents, and the caller decides what to
// do if there is no match.

export interface Distrito {
  // Name as it comes in the database.
  nombre: string;
  // Segment in /distritos/:slug
  slug: string;
}

export const DISTRITOS: Distrito[] = [
  { nombre: 'San Isidro De El General', slug: 'sanisidro' },
  { nombre: 'El General', slug: 'general' },
  { nombre: 'Daniel Flores', slug: 'danielflores' },
  { nombre: 'Rivas', slug: 'rivas' },
  { nombre: 'San Pedro', slug: 'sanpedro' },
  { nombre: 'Platanares', slug: 'platanares' },
  { nombre: 'Pejibaye', slug: 'pejibaye' },
  { nombre: 'Cajon', slug: 'cajon' },
  { nombre: 'Baru', slug: 'baru' },
  { nombre: 'Rio Nuevo', slug: 'rionuevo' },
  { nombre: 'Páramo', slug: 'paramo' },
  { nombre: 'La Amistad', slug: 'laamistad' },
];

// Strips accents and lowercases, to compare without surprises.
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

// District slug, or null if the name does not match any.
export function slugDistrito(nombre: string | null | undefined): string | null {
  if (!nombre) return null;
  const buscado = normalizar(nombre);
  return DISTRITOS.find((d) => normalizar(d.nombre) === buscado)?.slug ?? null;
}

// District from the URL segment.
export function distritoPorSlug(slug: string | undefined): Distrito | null {
  if (!slug) return null;
  return DISTRITOS.find((d) => d.slug === slug.toLowerCase()) ?? null;
}
