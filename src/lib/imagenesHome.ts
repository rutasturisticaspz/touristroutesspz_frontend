import { urlImagen } from './api';

// Las 15 fotos de la portada.
// Antes eran URLs completas de Firebase Storage escritas a mano en
// `helpers/dataImagenesHome.js`. No estaban en la base de datos, así
// que no las tocó la migración de imágenes: había que rescatarlas
// aparte. Están en el respaldo, dentro de `home-img/`, y ahora las
// sirve el backend desde `uploads/home/`.
// Se mantiene el orden original.
const ARCHIVOS = [
  'Nauyacas.jpg',
  'Nauyacas2.jpg',
  'Nauyacas3.jpg',
  'SanGabriel0.jpg',
  'SanGabriel1.jpg',
  'ecochontales0.jpg',
  'ecochontales1.jpg',
  'Namu0.jpg',
  'DJI_0013.jpg',
  'DJI_0030.jpg',
  'DJI_0201.jpg',
  'DJI_0204.jpg',
  'DJI_0568.jpg',
  'DSC_0642.jpg',
  'DSC_0959.jpg',
];

export const imagenesHome = ARCHIVOS.map((archivo) => ({
  archivo,
  url: urlImagen(`/uploads/home/${archivo}`),
}));
