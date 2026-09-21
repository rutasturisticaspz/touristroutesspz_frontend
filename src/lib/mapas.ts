// Los catorce mapas descargables.
// OJO: hoy los archivos viven en un Google Drive personal de quien
// armó el sitio original. Esa cuenta es una de las que se va a
// perder, así que estos enlaces tienen fecha de vencimiento.
// Cuando la U tenga los PDF, hay dos pasos y nada más:
//   1. Poner los archivos en frontend/public/mapas/ con el nombre que
//      dice `archivo`.
//   2. Cambiar ORIGEN a 'local' aquí abajo.
// Mientras tanto queda en 'drive' para que la página siga sirviendo.

const ORIGEN: 'drive' | 'local' = 'drive';

export interface Mapa {
  titulo: string;
  // Miniatura en public/img/mapas
  imagen: string;
  // Nombre que tendrá el PDF cuando lo sirva la U.
  archivo: string;
  // Enlace actual, en el Drive personal.
  drive: string;
}

export const MAPAS: Mapa[] = [
  {
    titulo: 'Cataratas y Pozas',
    imagen: 'cataratas.PNG',
    archivo: 'cataratas.pdf',
    drive: 'https://drive.google.com/file/d/1NuSq7ajp0I4N3emfvqs60_OQHcZYiTtO/view?usp=sharing',
  },
  {
    titulo: 'Agroturismo',
    imagen: 'agroturismo.PNG',
    archivo: 'agroturismo.pdf',
    drive: 'https://drive.google.com/file/d/1Wec5dK0GanaMXdvw8MlUZTvOTpP7djez/view?usp=sharing',
  },
  {
    titulo: 'Aventura',
    imagen: 'aventura.PNG',
    archivo: 'aventura.pdf',
    drive: 'https://drive.google.com/file/d/1NzvH2lIa1ywxRNc1DuCMLth8Mla4jD5f/view?usp=sharing',
  },
  {
    titulo: 'Trucheros y Tilaperos',
    imagen: 'trucheros.PNG',
    archivo: 'trucheros.pdf',
    drive: 'https://drive.google.com/file/d/1LAbSdsOweOT225ABOia1NCL9XLaB9RRi/view?usp=sharing',
  },
  {
    titulo: 'Cerros, Miradores y Reservas Naturales',
    imagen: 'CerrosMiradoresYReservas.PNG',
    archivo: 'cerros-miradores-reservas.pdf',
    drive: 'https://drive.google.com/file/d/1WjmCuSN_C2Vjrpk-CyA4Cem0EqmwNW15/view?usp=sharing',
  },
  {
    titulo: 'San Isidro',
    imagen: 'sanisidro.PNG',
    archivo: 'sanisidro.pdf',
    drive: 'https://drive.google.com/file/d/1lnrl7OIK98kSoxf_LpSqfnfPrXSQkue-/view?usp=sharing',
  },
  {
    titulo: 'Rivas',
    imagen: 'rivas.PNG',
    archivo: 'rivas.pdf',
    drive: 'https://drive.google.com/file/d/1QU8B30xAecYlHYZzAEn2fJifcbqTpbts/view?usp=sharing',
  },
  {
    titulo: 'Barú',
    imagen: 'baru.PNG',
    archivo: 'baru.pdf',
    drive: 'https://drive.google.com/file/d/1RjKvpuxiY3NQWGLs3srwCZN-Ui6gLp_o/view?usp=sharing',
  },
  {
    titulo: 'San Pedro',
    imagen: 'sanpedro.PNG',
    archivo: 'sanpedro.pdf',
    drive: 'https://drive.google.com/file/d/1NCLO5NFZU0zcH_BedjXmeTnYQ6lJBER0/view?usp=sharing',
  },
  {
    titulo: 'Río Nuevo',
    imagen: 'rionuevo.PNG',
    archivo: 'rionuevo.pdf',
    drive: 'https://drive.google.com/file/d/1yEcAoLgrw9-GqWhsNHVapbheFyBppZHN/view?usp=sharing',
  },
  {
    titulo: 'Páramo',
    imagen: 'paramo.PNG',
    archivo: 'paramo.pdf',
    drive: 'https://drive.google.com/file/d/1qvXC0mcNcTcYpoHdjSbdnaWTCpgtd0ni/view?usp=sharing',
  },
  {
    titulo: 'Pejibaye',
    imagen: 'pejibaye.PNG',
    archivo: 'pejibaye.pdf',
    drive: 'https://drive.google.com/file/d/1dKSqBtVK-ndWPj8RpiAmWybUc4KY7uuj/view?usp=sharing',
  },
  {
    titulo: 'Platanares',
    imagen: 'platanares.PNG',
    archivo: 'platanares.pdf',
    drive: 'https://drive.google.com/file/d/1mB-muNDBFNYcEPLs98djEp0ZKqatNYjd/view?usp=sharing',
  },
  {
    titulo: 'Cordillera de Talamanca',
    imagen: 'cordillera.PNG',
    archivo: 'cordillera-talamanca.pdf',
    drive: 'https://drive.google.com/file/d/1DGy9yDCCFeA4OYqFfTahUJBJ3YCQEfSM/view?usp=sharing',
  },
];

// A dónde apunta el botón "VER MAPA".
export function enlaceMapa(mapa: Mapa): string {
  return ORIGEN === 'local' ? `/mapas/${mapa.archivo}` : mapa.drive;
}

// true si el enlace todavía sale del sitio (Drive).
export const MAPAS_SON_EXTERNOS = ORIGEN === 'drive';
