// Contenido del pie de página.
// Mismos textos y enlaces que el sitio actual. Se mantiene el par
// texto/textoEN porque estos rótulos nunca estuvieron en los archivos
// de traducción, sino escritos aquí.

export interface ItemMenu {
  id: number;
  url: string;
  text: string;
  textEN: string;
}

export interface WidgetMenu {
  id: number;
  title: string;
  titleEN: string;
  menuItems: ItemMenu[];
}

function anioActual(): number {
  return new Date().getFullYear();
}

export const SECCIONES: WidgetMenu[] = [
  {
    id: 1,
    title: 'Secciones',
    titleEN: 'Sections',
    menuItems: [
      { id: 1, url: '/', text: 'Inicio', textEN: 'Home' },
      { id: 2, url: '/atracciones', text: 'Atracciones', textEN: 'Attractions' },
      { id: 3, url: '/restaurantes', text: 'Restaurantes', textEN: 'Restaurants' },
      { id: 4, url: '/hospedaje', text: 'Hospedaje', textEN: 'Lodging' },
      {
        id: 5,
        url: '/oficinas-turisticas',
        text: 'Oficinas turísticas',
        textEN: 'Touristic offices',
      },
      {
        id: 6,
        url: '/operadores-turisticos',
        text: 'Operadores turísticos',
        textEN: 'Tour operators',
      },
      { id: 7, url: '/renta-cars', text: 'Renta Cars', textEN: 'Rental car' },
      { id: 8, url: '/contacto', text: 'Contacto', textEN: 'Contact' },
    ],
  },
  {
    id: 2,
    title: 'Acerca de',
    titleEN: 'About',
    menuItems: [
      { id: 1, url: '/perezzeledon', text: 'Pérez Zeledón', textEN: 'Pérez Zeledón' },
      { id: 2, url: '/mapas', text: 'Mapas', textEN: 'Maps' },
      {
        id: 3,
        url: '/distritos/sanisidro',
        text: 'San Isidro De El General',
        textEN: 'San Isidro De El General',
      },
      { id: 4, url: '/distritos/general', text: 'El General', textEN: 'El General' },
      { id: 5, url: '/distritos/danielflores', text: 'Daniel Flores', textEN: 'Daniel Flores' },
      { id: 6, url: '/distritos/rivas', text: 'Rivas', textEN: 'Rivas' },
      { id: 7, url: '/distritos/sanpedro', text: 'San Pedro', textEN: 'San Pedro' },
    ],
  },
  {
    id: 3,
    title: ' ',
    titleEN: ' ',
    menuItems: [
      { id: 1, url: '/distritos/platanares', text: 'Platanares', textEN: 'Platanares' },
      { id: 2, url: '/distritos/pejibaye', text: 'Pejibaye', textEN: 'Pejibaye' },
      { id: 3, url: '/distritos/cajon', text: 'Cajón', textEN: 'Cajón' },
      { id: 4, url: '/distritos/baru', text: 'Barú', textEN: 'Barú' },
      { id: 5, url: '/distritos/rionuevo', text: 'Río Nuevo', textEN: 'Río Nuevo' },
      { id: 6, url: '/distritos/paramo', text: 'Páramo', textEN: 'Páramo' },
      { id: 7, url: '/distritos/laamistad', text: 'La Amistad', textEN: 'La Amistad' },
    ],
  },
];

export const CONTACTO = {
  email: 'erick.madrigal.villanueva@una.ac.cr',
  telefono: '88388535',
  telefonoEnlace: '50688388535',
};

export const REDES = [
  { id: 1, url: 'https://www.facebook.com/rutasturisticaspz', icon: 'ti-facebook' },
  { id: 2, url: 'https://www.instagram.com/rutasturisticaspz', icon: 'ti-instagram' },
];

export const copywrite = () =>
  `quehacerenperez.com © ${anioActual()}. Todos los derechos reservados.`;

export const copywriteEN = () => `quehacerenperez.com © ${anioActual()}. All rights reserved.`;
