import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Providers from './providers';
import AccesibilidadWidget from '../components/Accesibilidad/AccesibilidadWidget';

// The inherited styles, in the same order the previous site loaded
// them. Order matters: main.css and responsive.css override Bootstrap
// on purpose.
import '../styles/themify-icon/themify-icons.css';
import '../styles/simple-line-icon/simple-line-icons.css';
import '../styles/font-awesome/css/all.css';
import '../styles/elagent/style.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.css';
import '../styles/responsive.css';
import '../styles/index.css';
import '../styles/App.css';

export const metadata: Metadata = {
  title: 'Qué hacer en Pérez — Rutas Turísticas Pérez Zeledón',
  description:
    'Atracciones, hospedaje, restaurantes, eventos y operadores turísticos del cantón de Pérez Zeledón.',
};

// Poppins used to be pulled in with an @import inside main.css, which
// made the browser wait for that whole file before it even asked for the
// font. A <link> lets it start right away, and `display=swap` shows the
// text in a system font until Poppins arrives.
const POPPINS_URL =
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;900&display=swap';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={POPPINS_URL} />
      </head>
      <body>
        <Providers>
          {children}
          <AccesibilidadWidget />
        </Providers>
      </body>
    </html>
  );
}
