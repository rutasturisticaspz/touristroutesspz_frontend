'use client';

import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { pedir } from '../lib/api';
import { DIAS_COMO_NUEVO } from '../lib/nuevos';

// News: how many sites of each section were created within the last
// DIAS_COMO_NUEVO days, for the "x new" badges of the navigation bar.
// It depends only on the date, the same for every visitor, and it does
// not go away when the section is opened: it stays until the days run
// out. It is the same rule the cards use for their "New" ribbon.

export const SECCIONES = [
  'eventos',
  'atracciones',
  'restaurantes',
  'hoteles',
  'oficinas',
  'operadores',
  'rentadoras',
] as const;

export type Seccion = (typeof SECCIONES)[number];
type Conteos = Record<Seccion, number>;

const MS_ENTRE_ACTUALIZACIONES = 5 * 60 * 1000;

const SIN_NOVEDADES = Object.fromEntries(SECCIONES.map((s) => [s, 0])) as Conteos;

const NovedadesContext = createContext<Conteos>(SIN_NOVEDADES);

export function useNovedades(): Conteos {
  return useContext(NovedadesContext);
}

export function NovedadesProvider({ children }: { children: ReactNode }) {
  const enAdmin = (usePathname() ?? '').startsWith('/admin');
  const [conteos, setConteos] = useState<Conteos>(SIN_NOVEDADES);

  useEffect(() => {
    if (enAdmin) return;

    const actualizar = () =>
      pedir<{ conteos: Conteos }>('/novedades', { nuevos: DIAS_COMO_NUEVO })
        .then((respuesta) => setConteos(respuesta.conteos))
        // Badges are an extra: if the query fails, they are not shown.
        .catch(() => undefined);

    void actualizar();
    const temporizador = setInterval(actualizar, MS_ENTRE_ACTUALIZACIONES);
    return () => clearInterval(temporizador);
  }, [enAdmin]);

  return <NovedadesContext.Provider value={conteos}>{children}</NovedadesContext.Provider>;
}
