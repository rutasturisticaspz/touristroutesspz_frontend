import path from 'node:path';
import type { NextConfig } from 'next';

/**
 * The previous site was a create-react-app SPA served as static
 * files. Here the same visual behavior is kept, but on top of Next,
 * which is what will be dockerized and served from the University's
 * server together with the backend.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Images go in public/ and are served as is, without Next's
  // optimizer: they are the same ones the old project had and at this
  // stage the idea is for the site to look identical, not to change its
  // image pipeline.
  images: { unoptimized: true },

  // Without this, Turbopack walks up looking for a package-lock.json and
  // ends up taking the user's home folder as the project root.
  turbopack: { root: path.resolve(__dirname) },

  // Bundles the server and only the dependencies it actually uses, in
  // .next/standalone. It is what the Dockerfile copies: without this the
  // whole node_modules would have to go into the image.
  output: 'standalone',

  // The browser requests /api and /uploads from the same domain as the
  // site and Next forwards them to the backend over Docker's internal
  // network (the compose `backend` service). This way the backend needs
  // no published port and the code has no hardcoded domains or
  // localhost.
  // Note: with `output: standalone` this is resolved at build time.
  async rewrites() {
    const backend = process.env.BACKEND_INTERNAL_URL ?? 'http://backend:2999';
    return [
      { source: '/api/:ruta*', destination: `${backend}/api/:ruta*` },
      { source: '/uploads/:ruta*', destination: `${backend}/uploads/:ruta*` },
    ];
  },
};

export default nextConfig;
