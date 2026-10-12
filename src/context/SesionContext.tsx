'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  apiAdmin,
  borrarToken,
  guardarToken,
  leerToken,
  ROLES,
  type UsuarioSesion,
} from '../lib/apiAdmin';

// Panel session.
// Replaces the previous AuthContext, which had three problems:
//  1. It decoded the token in the browser with react-jwt to get the
//     user id and request the renewal. A token is text the browser
//     cannot verify; the new backend gets the id from the token it
//     signed itself, so nothing needs to be decoded here.
//  2. The state started with `checking: true` but nobody called
//     verificaToken on mount: it had to be done by hand on every
//     page.
//  3. It saved the token under the key 'token', the same one any
//     other application on localhost uses. Now it is 'rt_token'.

interface ValorSesion {
  usuario: UsuarioSesion | null;
  // true while checking whether there is a saved session.
  verificando: boolean;
  esAdmin: boolean;
  iniciarSesion: (email: string, password: string) => Promise<void>;
  cerrarSesion: () => void;
}

const SesionContext = createContext<ValorSesion | null>(null);

export function useSesion(): ValorSesion {
  const contexto = useContext(SesionContext);
  if (!contexto) throw new Error('useSesion debe usarse dentro de <SesionProvider>');
  return contexto;
}

export function SesionProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [verificando, setVerificando] = useState(true);

  // When the panel loads, it tries to renew the saved token. If the user
  // was deactivated or had their role changed, the renewal fails and
  // the session is closed: the old token is not enough to continue.
  useEffect(() => {
    let vigente = true;

    if (!leerToken()) {
      setVerificando(false);
      return;
    }

    apiAdmin
      .renovarToken()
      .then((respuesta) => {
        if (!vigente) return;
        guardarToken(respuesta.accessToken);
        setUsuario(respuesta.usuario);
      })
      .catch(() => {
        if (!vigente) return;
        borrarToken();
        setUsuario(null);
      })
      .finally(() => {
        if (vigente) setVerificando(false);
      });

    return () => {
      vigente = false;
    };
  }, []);

  const iniciarSesion = useCallback(async (email: string, password: string) => {
    const respuesta = await apiAdmin.iniciarSesion(email, password);
    guardarToken(respuesta.accessToken);
    setUsuario(respuesta.usuario);
  }, []);

  const cerrarSesion = useCallback(() => {
    borrarToken();
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({
      usuario,
      verificando,
      esAdmin: usuario?.rol === ROLES.ADMIN,
      iniciarSesion,
      cerrarSesion,
    }),
    [usuario, verificando, iniciarSesion, cerrarSesion],
  );

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}
