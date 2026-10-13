import type { TipoSitio } from './tipos';

// The six site types, in a single place.
// The previous site had a page, a banner, a search box and a services
// file FOR EACH type — six copies of the same code with different
// text. Here each type is a row of this table.
// `clave` is the segment that goes in the URL /sitio/:tipo/:id. The
// ones from the current site are kept exactly (including those in
// camel case, like operadoresTuristicos) so as not to break links
// already published.

export interface ConfigTipo {
  // Segment in /sitio/:tipo/:id
  clave: string;
  // Type as the backend calls it
  api: TipoSitio;
  // Key of this type in the /atracciones/conteo response
  conteo: string;
  // List route
  ruta: string;
  // Translation key for the banner title
  titulo: string;
  // Translation keys for the two description lines
  descripcion: [string, string?];
  // Banner image, in public/img
  imagen: string;
  // Translation key for the short label (menus, search box)
  etiqueta: string;
  // true if the search box offers filtering by category
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

// Aliases the previous site's search box used in the URL /buscar/…
// ('oficinas' and 'operadores' instead of the long names).
const ALIAS: Record<string, string> = {
  oficinas: 'oficinasTuristicas',
  operadores: 'operadoresTuristicos',
  atraccion: 'atracciones',
  hoteles: 'hospedaje',
  rentadoras: 'rentacars',
};

// Returns the configuration of a type, accepting the old aliases.
export function buscarTipo(clave: string | undefined): ConfigTipo | null {
  if (!clave) return null;
  return TIPOS[clave] ?? TIPOS[ALIAS[clave] ?? ''] ?? null;
}

export const CLAVES_TIPO = Object.keys(TIPOS);
