// The types the panel manages, in a single table.
// In the previous admin each type had its own components folder
// (Atracciones.jsx, AtraccionesEditar.jsx, AtraccionesTableRow.jsx)
// plus its Galeria, its Ubicaciones and its Contactos: six copies of
// the same six files, some 9,000 repeated lines. The only thing that
// changes between them is what is declared down here.

// Accessibility fields, according to what each table has in the DDL.
const DISCAPACIDAD = [
  'discapacidadVisual',
  'discapacidadAuditiva',
  'discapacidadFisica',
  'discapacidadCognitiva',
  'discapacidadSicosocial',
] as const;

// attractions, hotels, restaurants: everything.
const ACCESIBILIDAD_COMPLETA = [
  'declaracionTuristica',
  'permitenMascotas',
  'permitenNinos',
  ...DISCAPACIDAD,
] as const;

// offices, operators: no pets or children.
const ACCESIBILIDAD_SIN_MASCOTAS = ['declaracionTuristica', ...DISCAPACIDAD] as const;

// rental companies: the table has no declaracionTuristica.
const ACCESIBILIDAD_SOLO_DISCAPACIDAD = [...DISCAPACIDAD] as const;

// Label of each badge, for the form.
export const ROTULOS_ACCESIBILIDAD: Record<string, string> = {
  declaracionTuristica: 'Declaración turística',
  permitenMascotas: 'Permite mascotas',
  permitenNinos: 'Permite niños',
  discapacidadVisual: 'Discapacidad visual',
  discapacidadAuditiva: 'Discapacidad auditiva',
  discapacidadFisica: 'Discapacidad física',
  discapacidadCognitiva: 'Discapacidad cognitiva',
  discapacidadSicosocial: 'Discapacidad sicosocial',
};

// declaracionTuristica is the only one without a pair of descriptions.
export const SIN_DESCRIPCION = new Set(['declaracionTuristica']);

// An extra text field, specific to a type.
export interface CampoExtra {
  nombre: string;
  rotulo: string;
  // true if the backend requires it on creation.
  obligatorio?: boolean;
  tipo?: 'texto' | 'fecha';
}

export interface TipoAdmin {
  // Segment in /admin/:clave
  clave: string;
  // Backend route.
  api: string;
  // What it is called in titles and messages.
  rotulo: string;
  // Singular, for "Add …" and the deletion notices.
  singular: string;
  // true if the table has categories.
  conCategorias: boolean;
  // true if the table has contacts.
  conContactos: boolean;
  // Boolean accessibility columns it supports.
  accesibilidad: readonly string[];
  // Own text fields in addition to name/descriptions.
  extras: CampoExtra[];
  // Image type, as /imagenes/:tipo names it.
  tipoImagen: string;
  // Public site segment (/sitio/:clave/:id), for the "View on the site"
  // button. null for events, which have their own route.
  claveSitio: string | null;
}

export const TIPOS_ADMIN: Record<string, TipoAdmin> = {
  atracciones: {
    clave: 'atracciones',
    api: '/atracciones',
    rotulo: 'Atracciones',
    singular: 'atracción',
    conCategorias: true,
    conContactos: true,
    accesibilidad: ACCESIBILIDAD_COMPLETA,
    extras: [],
    tipoImagen: 'atracciones',
    claveSitio: 'atracciones',
  },
  hoteles: {
    clave: 'hoteles',
    api: '/hoteles',
    rotulo: 'Hospedaje',
    singular: 'hospedaje',
    conCategorias: true,
    conContactos: true,
    accesibilidad: ACCESIBILIDAD_COMPLETA,
    extras: [],
    tipoImagen: 'hoteles',
    claveSitio: 'hospedaje',
  },
  restaurantes: {
    clave: 'restaurantes',
    api: '/restaurantes',
    rotulo: 'Restaurantes',
    singular: 'restaurante',
    conCategorias: false,
    conContactos: true,
    accesibilidad: ACCESIBILIDAD_COMPLETA,
    extras: [],
    tipoImagen: 'restaurantes',
    claveSitio: 'restaurantes',
  },
  oficinas: {
    clave: 'oficinas',
    api: '/oficinas-turisticas',
    rotulo: 'Oficinas Turísticas',
    singular: 'oficina turística',
    conCategorias: false,
    conContactos: true,
    accesibilidad: ACCESIBILIDAD_SIN_MASCOTAS,
    // The backend requires it on creation, same as the table.
    extras: [{ nombre: 'nombreEncargado', rotulo: 'Nombre del encargado', obligatorio: true }],
    tipoImagen: 'oficinas-turisticas',
    claveSitio: 'oficinasTuristicas',
  },
  operadores: {
    clave: 'operadores',
    api: '/operadores-turisticos',
    rotulo: 'Operadores Turísticos',
    singular: 'operador turístico',
    conCategorias: false,
    conContactos: true,
    accesibilidad: ACCESIBILIDAD_SIN_MASCOTAS,
    extras: [],
    tipoImagen: 'operadores-turisticos',
    claveSitio: 'operadoresTuristicos',
  },
  rentadoras: {
    clave: 'rentadoras',
    api: '/rentadoras-vehiculos',
    rotulo: 'Rentadoras de vehículos',
    singular: 'rentadora',
    conCategorias: false,
    conContactos: true,
    accesibilidad: ACCESIBILIDAD_SOLO_DISCAPACIDAD,
    extras: [],
    tipoImagen: 'rentadoras-vehiculos',
    claveSitio: 'rentacars',
  },
  eventos: {
    clave: 'eventos',
    api: '/eventos',
    rotulo: 'Eventos',
    singular: 'evento',
    conCategorias: false,
    conContactos: true,
    accesibilidad: [],
    extras: [
      { nombre: 'nombreIngles', rotulo: 'Nombre en inglés', obligatorio: true },
      { nombre: 'fechaInicio', rotulo: 'Fecha de inicio', tipo: 'fecha' },
      { nombre: 'fechaFin', rotulo: 'Fecha de fin', tipo: 'fecha' },
      { nombre: 'mostrarFechaInicio', rotulo: 'Publicar desde', tipo: 'fecha' },
      { nombre: 'mostrarFechaFin', rotulo: 'Publicar hasta', tipo: 'fecha' },
    ],
    tipoImagen: 'eventos',
    claveSitio: null,
  },
};

export function buscarTipoAdmin(clave: string | undefined): TipoAdmin | null {
  if (!clave) return null;
  return TIPOS_ADMIN[clave] ?? null;
}

// The panel's side menu.
export interface EntradaMenu {
  ruta: string;
  rotulo: string;
  // true if only an ADMIN sees it.
  soloAdmin?: boolean;
  // true while the section is not built yet: it is shown greyed out.
  pendiente?: boolean;
}

export const MENU: EntradaMenu[] = [
  { ruta: '/admin/atracciones', rotulo: 'Atracciones' },
  { ruta: '/admin/hoteles', rotulo: 'Hospedaje' },
  { ruta: '/admin/restaurantes', rotulo: 'Restaurantes' },
  { ruta: '/admin/operadores', rotulo: 'Operadores Turísticos' },
  { ruta: '/admin/oficinas', rotulo: 'Oficinas Turísticas' },
  { ruta: '/admin/rentadoras', rotulo: 'Rentadoras de vehículos' },
  { ruta: '/admin/eventos', rotulo: 'Eventos' },
  { ruta: '/admin/categorias', rotulo: 'Categorías' },
  { ruta: '/admin/mapas', rotulo: 'Mapas' },
  { ruta: '/admin/mensajes', rotulo: 'Mensajes' },
  { ruta: '/admin/exportar', rotulo: 'Exportar a Excel' },
  { ruta: '/admin/usuarios', rotulo: 'Usuarios y permisos', soloAdmin: true },
];
