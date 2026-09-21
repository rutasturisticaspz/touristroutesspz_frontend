'use client';

import type { ReactNode } from 'react';
import { SesionProvider } from '../../context/SesionContext';
import '../../styles/admin.css';

// Todo lo que cuelga de /admin comparte la sesión.
// El panel vive dentro de la misma aplicación que el sitio público
// —una sola aplicación, como quedamos— pero es la única zona que pide
// credenciales. El sitio público no monta este proveedor y por lo
// tanto nunca toca el token.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <SesionProvider>{children}</SesionProvider>;
}
