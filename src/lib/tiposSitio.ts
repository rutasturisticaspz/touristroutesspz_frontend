import type { TipoSitio } from './tipos';

// Los seis tipos de sitio, en un solo lugar.
// El sitio anterior tenía una página, un banner, un buscador y un
// archivo de servicios POR CADA tipo — seis copias del mismo código con
// distinto texto. Aquí cada tipo es una fila de esta tabla.
// `clave` es el segmento que va en la URL /sitio/:tipo/:id. Se
// conservan exactamente los del sitio actual (incluidos los que están
// en camello, como operadoresTuristicos) para no romper los enlaces ya
// publicados.

export interface ConfigTipo {
  // Segmento en /sitio/:tipo/:id
  clave: string;
  // Tipo tal como lo llama el backend
  api: TipoSitio;
  // Llave de este tipo en la respuesta de /atracciones/conteo
  conteo: string;
  // Ruta del listado
  ruta: string;
  // Clave de traducción del título del banner
  titulo: string;
  // Claves de traducción de las dos líneas de descripción
  descripcion: [string, string?];
  // Imagen del banner, en public/img
  imagen: string;
  // Clave de traducción del rótulo corto (menús, buscador)
  etiqueta: string;
  // true si el buscador ofrece filtro por categoría
  conCategorias: boolean;
}

export const TIPOS: Record<string, ConfigTipo> = {
  atracciones: {
    clave: 'atracciones',
    api: 'atracciones',
    conteo: 'atracciones',
    ruta: '/atracciones',
    titulo: 'attractions.attractions',
    descripcion: ['attractions.description1', 'attractions.description2'],
    imagen: '/img/atracciones/banner.png',
    etiqueta: 'global.attractions',
    conCategorias: true,
  },
  restaurantes: {
    clave: 'restaurantes',
    api: 'restaurantes',
    conteo: 'restaurantes',
    ruta: '/restaurantes',
    titulo: 'restaurants.restaurants',
    descripcion: ['restaurants.description1', 'restaurants.description2'],
    imagen: '/img/restaurantes/banner.png',
    etiqueta: 'global.restaurants',
    conCategorias: false,
  },
  hospedaje: {
    clave: 'hospedaje',
    api: 'hoteles',
    conteo: 'hoteles',
    ruta: '/hospedaje',
    titulo: 'lodging.lodging',
    descripcion: [
      'lodging.rest_in_magical_places_of_our_canton',
      'lodging.recover_energy_for_the_rest_of_your_trip',
    ],
    imagen: '/img/hospedaje/banner.png',
    etiqueta: 'global.lodgings',
    conCategorias: true,
  },
  oficinasTuristicas: {
    clave: 'oficinasTuristicas',
    api: 'oficinas-turisticas',
    conteo: 'oficinas',
    ruta: '/oficinas-turisticas',
    titulo: 'tourist_offices.tourist_offices',
    descripcion: [
      'tourist_offices.do_you_need_help_deciding',
      'tourist_offices.you_can_ask_for_information',
    ],
    imagen: '/img/oficinas/banner.png',
    etiqueta: 'global.touristic_offices',
    conCategorias: false,
  },
  operadoresTuristicos: {
    clave: 'operadoresTuristicos',
    api: 'operadores-turisticos',
    conteo: 'operadores',
    ruta: '/operadores-turisticos',
    titulo: 'tour_operators.tour_operators',
    descripcion: [
      'tour_operators.schedule_and_organize_your_tour',
      'tour_operators.they_will_make_sure',
    ],
    imagen: '/img/operadores/banner.png',
    etiqueta: 'global.tour_operators',
    conCategorias: false,
  },
  rentacars: {
    clave: 'rentacars',
    api: 'rentadoras-vehiculos',
    conteo: 'rentadoras',
    ruta: '/renta-cars',
    titulo: 'car_rentals.car_rentals',
    descripcion: ['car_rentals.choose_the_vehicle', 'car_rentals.thus_travel_the_roads'],
    imagen: '/img/rentadoras/banner.png',
    etiqueta: 'global.rental_cars',
    conCategorias: false,
  },
};

// Alias que usaba el buscador del sitio anterior en la URL /buscar/…
// ('oficinas' y 'operadores' en vez de los nombres largos).
const ALIAS: Record<string, string> = {
  oficinas: 'oficinasTuristicas',
  operadores: 'operadoresTuristicos',
  atraccion: 'atracciones',
  hoteles: 'hospedaje',
  rentadoras: 'rentacars',
};

// Devuelve la configuración de un tipo, aceptando los alias viejos.
export function buscarTipo(clave: string | undefined): ConfigTipo | null {
  if (!clave) return null;
  return TIPOS[clave] ?? TIPOS[ALIAS[clave] ?? ''] ?? null;
}

export const CLAVES_TIPO = Object.keys(TIPOS);
