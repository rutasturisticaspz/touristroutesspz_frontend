// Los doce distritos de Pérez Zeledón y su segmento de URL.
// Antes esto vivía suelto dentro de helpers.js como `mapDistritos`, y
// la función que lo consultaba devolvía `undefined` en silencio cuando
// el nombre no coincidía —lo que producía enlaces a
// /distritos/undefined—. Aquí la búsqueda no distingue mayúsculas ni
// acentos, y quien llama decide qué hacer si no hay coincidencia.

export interface Distrito {
  // Nombre tal como viene en la base de datos.
  nombre: string;
  // Segmento en /distritos/:slug
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

// Quita acentos y baja a minúsculas, para comparar sin sorpresas.
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

// Slug del distrito, o null si el nombre no corresponde a ninguno.
export function slugDistrito(nombre: string | null | undefined): string | null {
  if (!nombre) return null;
  const buscado = normalizar(nombre);
  return DISTRITOS.find((d) => normalizar(d.nombre) === buscado)?.slug ?? null;
}

// Distrito a partir del segmento de la URL.
export function distritoPorSlug(slug: string | undefined): Distrito | null {
  if (!slug) return null;
  return DISTRITOS.find((d) => d.slug === slug.toLowerCase()) ?? null;
}
