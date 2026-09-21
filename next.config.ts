import path from 'node:path';
import type { NextConfig } from 'next';

/**
 * El sitio anterior era una SPA de create-react-app servida como
 * estáticos. Aquí se mantiene el mismo comportamiento visual, pero
 * sobre Next, que es lo que se va a dockerizar y servir desde el
 * servidor de la Universidad junto con el backend.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Las imágenes van en public/ y se sirven tal cual, sin el
  // optimizador de Next: son las mismas que traía el proyecto viejo y
  // en esta etapa la idea es que el sitio se vea idéntico, no
  // cambiarle el pipeline de imágenes.
  images: { unoptimized: true },

  // Sin esto, Turbopack sube buscando un package-lock.json y termina
  // tomando la carpeta personal del usuario como raíz del proyecto.
  turbopack: { root: path.resolve(__dirname) },

  // Empaqueta el servidor y sólo las dependencias que realmente usa,
  // en .next/standalone. Es lo que copia el Dockerfile: sin esto
  // habría que meter node_modules completo en la imagen.
  output: 'standalone',
};

export default nextConfig;
