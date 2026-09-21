import { API_URL } from './config';
import type { Pagina, Sitio, TipoSitio } from './tipos';

// Cliente del API.
// El sitio anterior tenía un archivo de servicios por cada tipo de
// sitio —atracciones.js, hospedaje.js, restaurantes.js…— con las
// mismas seis funciones copiadas en cada uno, y cada llamada armaba la
// URL a mano con plantillas. Como el backend nuevo expone la misma
// forma para los siete tipos, aquí basta una función parametrizada.

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
      // La respuesta no era JSON; queda el mensaje genérico.
    }
    throw new ErrorApi(respuesta.status, mensaje);
  }

  return respuesta.json() as Promise<T>;
}

// POST con cuerpo JSON, con el mismo manejo de errores que `pedir`.
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
      // La respuesta no era JSON.
    }
    throw new ErrorApi(respuesta.status, mensaje);
  }

  return respuesta.json() as Promise<T>;
}

// Filtros que acepta el listado de cualquier tipo de sitio.
export interface FiltrosSitio {
  filtro?: string;
  provincia?: string;
  canton?: string;
  distrito?: string;
  categorias?: string[];
  accesibilidad?: string[];
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

  // Otros sitios parecidos, para la barra lateral del detalle.
  relacionados: (tipo: TipoSitio, id: number, take = 3) =>
    pedir<Pagina<Sitio>>(`/${tipo}/${id}/relacionados`, { take }),

  // Conteo global por tipo, para la portada.
  conteo: () =>
    pedir<Record<string, number>>('/atracciones/conteo'),

  categorias: (take = 100) => pedir<Pagina<unknown>>('/categorias', { take }),

  // Formulario público de contacto. El campo del correo se llama
  // `correo`, no `email`: así se llama en la tabla y así lo valida el backend.
  enviarMensaje: (datos: { nombre: string; correo: string; asunto: string; mensaje: string }) =>
    enviar<{ ok: boolean; mensaje: string }>('/mensajes', datos),
};

// Las imágenes vienen del backend como rutas relativas (/uploads/...).
// Antes eran URLs completas de Firebase con un token adentro.
export function urlImagen(url: string | null | undefined): string {
  if (!url) return '/img/logoRT.png';
  if (url.startsWith('http')) return url;
  return `${API_URL.replace(/\/api$/, '')}${url}`;
}
