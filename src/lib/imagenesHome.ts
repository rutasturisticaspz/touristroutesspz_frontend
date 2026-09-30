import { urlImagen } from './api';

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
  url: urlImagen(`/uploads/${archivo}`),
}));
