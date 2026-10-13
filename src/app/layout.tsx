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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          {children}
          <AccesibilidadWidget />
        </Providers>
      </body>
    </html>
  );
}
