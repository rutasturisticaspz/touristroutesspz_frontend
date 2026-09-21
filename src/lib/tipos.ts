// Tipos de lo que devuelve el backend.
// El sitio anterior era JavaScript sin tipos: cada componente adivinaba
// la forma de la respuesta, y por eso hay tantos `?.` y `|| []`
// regados. Al declararlo una vez, el editor avisa cuando un campo no
// existe en vez de que salga undefined en pantalla.

export interface Ubicacion {
  id: number;
  provincia: string | null;
  canton: string | null;
  distrito: string | null;
  detalle: string | null;
  // Ojo: en la base vienen como texto, a veces en grados/minutos/segundos.
  latitud: string | null;
  longitud: string | null;
}

export interface Imagen {
  id: number;
  nombre: string;
  descripcion: string | null;
  // Ruta relativa servida por el backend, p. ej. /uploads/21-163476.jpg
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

// Campos comunes a los siete tipos de sitio.
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

// Todas las listas del backend responden con esta forma.
export interface Pagina<T> {
  total: number;
  datos: T[];
}

// Los tipos de sitio, tal como van en la URL del API.
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
