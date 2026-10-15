import { API_URL } from './config';
import { ErrorApi } from './api';

// API client for the panel.
// The previous admin had a services file per entity —thirteen files—
// and each function repeated the same Authorization header, the same
// axios and the same handling (or lack of handling) of errors.
// It also dragged along Apollo/GraphQL pointing at a /graphql endpoint
// that the backend never exposed.
// Here there is a single function and the session is resolved in one
// place.

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
    // Without storage the session lasts as long as the tab does.
  }
}

export function borrarToken(): void {
  try {
    window.localStorage.removeItem(CLAVE_TOKEN);
  } catch {
    // Nothing to do.
  }
}

type Metodo = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface Opciones {
  metodo?: Metodo;
  cuerpo?: unknown;
  parametros?: Record<string, string | number | boolean | undefined | null>;
  // For uploading files: it is sent as is, without Content-Type.
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

// Authenticated call. Throws ErrorApi with the message the backend
// sends, which is what the screen shows to the user.
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
      // The response was not JSON.
    }
    throw new ErrorApi(respuesta.status, mensaje);
  }

  // DELETE may respond without a body.
  const texto = await respuesta.text();
  return (texto ? JSON.parse(texto) : null) as T;
}

// Roles, with the value as the database stores it.
export const ROLES = {
  ADMIN: 'ADMIN',
  // Note: in the database it says MODERATOR, in English.
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

  // Renews the token by reading the user from the database, not from
  // the token.
  renovarToken: () => pedirAdmin<RespuestaSesion>('/usuarios/renovar-token', { metodo: 'POST' }),

  // Password links. The three calls are public: whoever holds the link
  // (or the email address) is who is asking.
  requestPasswordLink: (email: string) =>
    pedirAdmin<{ ok: boolean; message: string }>('/usuarios/forgot-password', {
      metodo: 'POST',
      cuerpo: { email },
    }),

  validatePasswordLink: (token: string) =>
    pedirAdmin<{ nombre: string | null; email: string | null }>('/usuarios/validate-link', {
      metodo: 'POST',
      cuerpo: { token },
    }),

  choosePassword: (token: string, password: string) =>
    pedirAdmin<{ ok: boolean }>('/usuarios/reset-with-link', {
      metodo: 'POST',
      cuerpo: { token, password },
    }),
};
