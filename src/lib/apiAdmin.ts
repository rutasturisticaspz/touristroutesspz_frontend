import { API_URL } from './config';
import { ErrorApi } from './api';

// Cliente del API para el panel.
// El admin anterior tenía un archivo de servicios por entidad —trece
// archivos— y cada función repetía la misma cabecera Authorization,
// el mismo axios y el mismo manejo (o falta de manejo) de errores.
// Además arrastraba Apollo/GraphQL apuntando a un endpoint
// /graphql que el backend nunca expuso.
// Aquí hay una sola función y la sesión se resuelve en un lugar.

const CLAVE_TOKEN = 'rt_token';

export function leerToken(): string | null {
  try {
    return window.localStorage.getItem(CLAVE_TOKEN);
  } catch {
    return null;
  }
}

export function guardarToken(token: string): void {
  try {
    window.localStorage.setItem(CLAVE_TOKEN, token);
  } catch {
    // Sin almacenamiento la sesión dura lo que dure la pestaña.
  }
}

export function borrarToken(): void {
  try {
    window.localStorage.removeItem(CLAVE_TOKEN);
  } catch {
    // Nada que hacer.
  }
}

type Metodo = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface Opciones {
  metodo?: Metodo;
  cuerpo?: unknown;
  parametros?: Record<string, string | number | boolean | undefined | null>;
  // Para subir archivos: se manda tal cual, sin Content-Type.
  formulario?: FormData;
}

function armarQuery(parametros: Opciones['parametros']): string {
  if (!parametros) return '';
  const query = new URLSearchParams();
  for (const [clave, valor] of Object.entries(parametros)) {
    if (valor === undefined || valor === null || valor === '') continue;
    query.set(clave, String(valor));
  }
  const texto = query.toString();
  return texto ? `?${texto}` : '';
}

// Llamada autenticada. Lanza ErrorApi con el mensaje que mande el
// backend, que es lo que la pantalla muestra al usuario.
export async function pedirAdmin<T>(ruta: string, opciones: Opciones = {}): Promise<T> {
  const { metodo = 'GET', cuerpo, parametros, formulario } = opciones;
  const token = leerToken();

  const cabeceras: Record<string, string> = { Accept: 'application/json' };
  if (token) cabeceras.Authorization = `Bearer ${token}`;
  if (cuerpo !== undefined) cabeceras['Content-Type'] = 'application/json';

  const respuesta = await fetch(`${API_URL}${ruta}${armarQuery(parametros)}`, {
    method: metodo,
    headers: cabeceras,
    body: formulario ?? (cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined),
  });

  if (!respuesta.ok) {
    let mensaje = `Error ${respuesta.status}`;
    try {
      const datos = await respuesta.json();
      if (datos?.error) mensaje = datos.error;
      if (datos?.detalles) {
        const detalles = Object.values(datos.detalles as Record<string, string[]>)
          .flat()
          .filter(Boolean);
        if (detalles.length > 0) mensaje = `${mensaje}: ${detalles.join(', ')}`;
      }
    } catch {
      // La respuesta no era JSON.
    }
    throw new ErrorApi(respuesta.status, mensaje);
  }

  // DELETE puede responder sin cuerpo.
  const texto = await respuesta.text();
  return (texto ? JSON.parse(texto) : null) as T;
}

// Roles, con el valor tal como lo guarda la base.
export const ROLES = {
  ADMIN: 'ADMIN',
  // Ojo: en la base dice MODERATOR, en inglés.
  MODERADOR: 'MODERATOR',
  PARTICULAR: 'PARTICULAR',
} as const;

export type Rol = (typeof ROLES)[keyof typeof ROLES];

export interface UsuarioSesion {
  id: number;
  nombre: string | null;
  email: string | null;
  rol: Rol;
}

export interface RespuestaSesion {
  accessToken: string;
  usuario: UsuarioSesion;
}

export const apiAdmin = {
  iniciarSesion: (email: string, password: string) =>
    pedirAdmin<RespuestaSesion>('/usuarios/login', {
      metodo: 'POST',
      cuerpo: { email, password },
    }),

  // Renueva el token leyendo el usuario de la base, no del token.
  renovarToken: () => pedirAdmin<RespuestaSesion>('/usuarios/renovar-token', { metodo: 'POST' }),
};
