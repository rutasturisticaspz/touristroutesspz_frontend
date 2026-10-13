import { API_URL } from './config';
import type { Mapa, Pagina, Sitio, TipoSitio } from './tipos';

// API client.
// The previous site had a services file for each site type
// —atracciones.js, hospedaje.js, restaurantes.js…— with the same six
// functions copied into each one, and every call built the URL by hand
// with templates. Since the new backend exposes the same shape for all
// seven types, a single parameterized function is enough here.

export class ErrorApi extends Error {
  constructor(
    public readonly status: number,
    mensaje: string,
  ) {
    super(mensaje);
    this.name = 'ErrorApi';
  }
}

type Parametros = Record<string, string | number | boolean | string[] | undefined | null>;

function armarQuery(parametros: Parametros = {}): string {
  const query = new URLSearchParams();
  for (const [clave, valor] of Object.entries(parametros)) {
    if (valor === undefined || valor === null || valor === '') continue;
    query.set(clave, Array.isArray(valor) ? valor.join(',') : String(valor));
  }
  const texto = query.toString();
  return texto ? `?${texto}` : '';
}

export async function pedir<T>(ruta: string, parametros?: Parametros): Promise<T> {
  const respuesta = await fetch(`${API_URL}${ruta}${armarQuery(parametros)}`, {
    headers: { Accept: 'application/json' },
  });

  if (!respuesta.ok) {
    let mensaje = `Error ${respuesta.status}`;
    try {
      const cuerpo = await respuesta.json();
      if (cuerpo?.error) mensaje = cuerpo.error;
    } catch {
      // The response was not JSON; the generic message stays.
    }
    throw new ErrorApi(respuesta.status, mensaje);
  }

  return respuesta.json() as Promise<T>;
}

// POST with a JSON body, with the same error handling as `pedir`.
export async function enviar<T>(ruta: string, cuerpo: unknown): Promise<T> {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(cuerpo),
  });

  if (!respuesta.ok) {
    let mensaje = `Error ${respuesta.status}`;
    try {
      const datos = await respuesta.json();
      if (datos?.error) mensaje = datos.error;
    } catch {
      // The response was not JSON.
    }
    throw new ErrorApi(respuesta.status, mensaje);
  }

  return respuesta.json() as Promise<T>;
}

// Filters accepted by the list of any site type.
export interface FiltrosSitio {
  filtro?: string;
  provincia?: string;
  canton?: string;
  distrito?: string;
  categorias?: string[];
  accesibilidad?: string[];
  // Only events that have not ended yet (today's and future events).
  proximos?: boolean;
  // Days back that count as "new": those come first in /con-imagenes.
  nuevos?: number;
  skip?: number;
  take?: number;
  ordenarPor?: string;
  direccion?: 'asc' | 'desc';
}

export const api = {
  listar: (tipo: TipoSitio, filtros: FiltrosSitio = {}) =>
    pedir<Pagina<Sitio>>(`/${tipo}`, filtros as Parametros),

  obtener: (tipo: TipoSitio, id: number) => pedir<Sitio>(`/${tipo}/${id}`),

  conImagenes: (tipo: TipoSitio, filtros: FiltrosSitio = {}) =>
    pedir<Pagina<Sitio>>(`/${tipo}/con-imagenes`, filtros as Parametros),

  // Other similar sites, for the detail sidebar.
  relacionados: (tipo: TipoSitio, id: number, take = 3) =>
    pedir<Pagina<Sitio>>(`/${tipo}/${id}/relacionados`, { take }),

  // Global count by type, for the home page.
  conteo: () =>
    pedir<Record<string, number>>('/atracciones/conteo'),

  mapas: () => pedir<Pagina<Mapa>>('/mapas'),

  categorias: (take = 100) => pedir<Pagina<unknown>>('/categorias', { take }),

  // Public contact form. The email field is called `correo`, not
  // `email`: that is its name in the table and how the backend
  // validates it.
  enviarMensaje: (datos: { nombre: string; correo: string; asunto: string; mensaje: string }) =>
    enviar<{ ok: boolean; mensaje: string }>('/mensajes', datos),
};

// Images come from the backend as relative paths (/uploads/...).
// They used to be full Firebase URLs with a token inside.
export function urlImagen(url: string | null | undefined): string {
  if (!url) return '/img/logoRT.png';
  if (url.startsWith('http')) return url;
  return `${API_URL.replace(/\/api$/, '')}${url}`;
}
