// Types of what the backend returns.
// The previous site was untyped JavaScript: every component guessed
// the shape of the response, and that is why there are so many `?.`
// and `|| []` scattered around. By declaring it once, the editor warns
// when a field does not exist instead of undefined showing up on
// screen.

export interface Ubicacion {
  id: number;
  provincia: string | null;
  canton: string | null;
  distrito: string | null;
  detalle: string | null;
  // Note: in the database they come as text, sometimes in
  // degrees/minutes/seconds.
  latitud: string | null;
  longitud: string | null;
}

export interface Imagen {
  id: number;
  nombre: string;
  descripcion: string | null;
  // Relative path served by the backend, e.g. /uploads/21-163476.jpg
  url: string;
  nameUrl: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  nombreIngles: string | null;
  descripcion: string | null;
  descripcionIngles: string | null;
}

export interface Contacto {
  id: number;
  valor: string;
  tipo: string;
}

// Fields common to the seven site types.
export interface Sitio {
  id: number;
  nombre: string;
  descripcion: string;
  descripcionIngles: string;
  state: string;
  createdAt: string;
  updateAt: string | null;
  ubicacionId: number | null;
  ubicacion: Ubicacion | null;
  imagenes: Imagen[];
  categorias?: Categoria[];
  contactos?: Contacto[];

  declaracionTuristica?: boolean;
  permitenMascotas?: boolean;
  permitenNinos?: boolean;
  discapacidadVisual?: boolean;
  discapacidadAuditiva?: boolean;
  discapacidadFisica?: boolean;
  discapacidadCognitiva?: boolean;
  discapacidadSicosocial?: boolean;
  [clave: string]: unknown;
}

export interface Evento extends Sitio {
  nombreIngles: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  mostrarFechaInicio: string | null;
  mostrarFechaFin: string | null;
}

// A downloadable map: name and link of the file on Google Drive.
export interface Mapa {
  id: string;
  nombre: string;
  enlace: string;
  // Drive preview; null if the link is not for a file.
  miniatura: string | null;
  createdAt: string;
}

// All the backend's lists respond with this shape.
export interface Pagina<T> {
  total: number;
  datos: T[];
}

// The site types, as they appear in the API URL.
export const TIPOS_SITIO = [
  'atracciones',
  'hoteles',
  'restaurantes',
  'oficinas-turisticas',
  'operadores-turisticos',
  'rentadoras-vehiculos',
  'eventos',
] as const;

export type TipoSitio = (typeof TIPOS_SITIO)[number];
