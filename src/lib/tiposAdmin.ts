// Los tipos que administra el panel, en una sola tabla.
// En el admin anterior cada tipo tenía su carpeta de componentes
// (Atracciones.jsx, AtraccionesEditar.jsx, AtraccionesTableRow.jsx) más
// su Galeria, su Ubicaciones y sus Contactos: seis copias de los mismos
// seis archivos, unas 9 000 líneas repetidas. Lo único que cambia entre
// ellas es lo que está declarado acá abajo.

// Campos de accesibilidad, según lo que tiene cada tabla en el DDL.
const DISCAPACIDAD = [
  'discapacidadVisual',
  'discapacidadAuditiva',
  'discapacidadFisica',
  'discapacidadCognitiva',
  'discapacidadSicosocial',
] as const;

// atracciones, hoteles, restaurantes: todo.
const ACCESIBILIDAD_COMPLETA = [
  'declaracionTuristica',
  'permitenMascotas',
  'permitenNinos',
  ...DISCAPACIDAD,
] as const;

// oficinas, operadores: sin mascotas ni niños.
const ACCESIBILIDAD_SIN_MASCOTAS = ['declaracionTuristica', ...DISCAPACIDAD] as const;

// rentadoras: la tabla no tiene declaracionTuristica.
const ACCESIBILIDAD_SOLO_DISCAPACIDAD = [...DISCAPACIDAD] as const;

// Rótulo de cada distintivo, para el formulario.
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

// declaracionTuristica es la única sin par de descripciones.
export const SIN_DESCRIPCION = new Set(['declaracionTuristica']);

// Un campo de texto extra, propio de un tipo.
export interface CampoExtra {
  nombre: string;
  rotulo: string;
  // true si el backend lo exige al crear.
  obligatorio?: boolean;
  tipo?: 'texto' | 'fecha';
}

export interface TipoAdmin {
  // Segmento en /admin/:clave
  clave: string;
  // Ruta del backend.
  api: string;
  // Cómo se llama en los títulos y mensajes.
  rotulo: string;
  // Singular, para "Agregar …" y los avisos de borrado.
  singular: string;
  // true si la tabla tiene categorías.
  conCategorias: boolean;
  // true si la tabla tiene contactos.
  conContactos: boolean;
  // Columnas booleanas de accesibilidad que admite.
  accesibilidad: readonly string[];
  // Campos de texto propios además de nombre/descripciones.
  extras: CampoExtra[];
  // Tipo de imagen, tal como lo nombra /imagenes/:tipo.
  tipoImagen: string;
  // Segmento del sitio público (/sitio/:clave/:id), para el botón
  // "Ver en el sitio". null en eventos, que tienen su propia ruta.
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
    // El backend lo exige al crear, igual que la tabla.
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

// El menú lateral del panel.
export interface EntradaMenu {
  ruta: string;
  rotulo: string;
  // true si sólo la ve un ADMIN.
  soloAdmin?: boolean;
  // true mientras la sección no esté construida: se muestra apagada.
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
  { ruta: '/admin/mensajes', rotulo: 'Mensajes' },
  { ruta: '/admin/exportar', rotulo: 'Exportar a Excel' },
  { ruta: '/admin/usuarios', rotulo: 'Usuarios y permisos', soloAdmin: true },
];
