import path from 'node:path';
import type { NextConfig } from 'next';
import {
  DEVICE_WIDTHS,
  IMAGE_QUALITY,
  SMALL_WIDTHS,
} from './src/lib/optimizedImage';

const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

/**
 * The previous site was a create-react-app SPA served as static
 * files. Here the same visual behavior is kept, but on top of Next,
 * which is what will be dockerized and served from the University's
 * server together with the backend.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    // Resized copies of the photos are made on demand (see
    // src/lib/optimizedImage.ts). Only local images are allowed, and
    // WebP is used because AVIF costs far more CPU to produce.
    deviceSizes: [...DEVICE_WIDTHS],
    imageSizes: [...SMALL_WIDTHS],
    qualities: [IMAGE_QUALITY],
    formats: ['image/webp'],
    localPatterns: [{ pathname: '/uploads/**' }, { pathname: '/img/**' }],
    // Photos are replaced by uploading a new file, not by editing one,
    // so a resized copy can be kept for a month.
    minimumCacheTTL: THIRTY_DAYS_IN_SECONDS,
  },

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
  // The files in public/img keep their name when they change, so they
  // cannot be cached forever; a month with revalidation is a fair middle.
  async headers() {
    return [
      {
        source: '/img/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: `public, max-age=${THIRTY_DAYS_IN_SECONDS}, stale-while-revalidate=86400`,
          },
        ],
      },
    ];
  },

  async rewrites() {
    const backend = process.env.BACKEND_INTERNAL_URL ?? 'http://backend:2999';
    return [
      { source: '/api/:ruta*', destination: `${backend}/api/:ruta*` },
      { source: '/uploads/:ruta*', destination: `${backend}/uploads/:ruta*` },
    ];
  },
};

export default nextConfig;
