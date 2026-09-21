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

// Sesión del panel.
// Reemplaza al AuthContext anterior, que tenía tres problemas:
//  1. Decodificaba el token en el navegador con react-jwt para sacar
//     el id del usuario y pedir la renovación. Un token es texto que
//     el navegador no puede verificar; el backend nuevo saca el id del
//     token que él mismo firmó, así que aquí no hace falta decodificar
//     nada.
//  2. El estado arrancaba con `checking: true` pero nadie llamaba a
//     verificaToken al montar: había que hacerlo a mano en cada
//     página.
//  3. Guardaba el token bajo la llave 'token', la misma que usa
//     cualquier otra aplicación en localhost. Ahora es 'rt_token'.

interface ValorSesion {
  usuario: UsuarioSesion | null;
  // true mientras se comprueba si hay sesión guardada.
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

  // Al cargar el panel se intenta renovar el token guardado. Si el
  // usuario fue desactivado o le cambiaron el rol, la renovación falla
  // y la sesión se cierra: el token viejo no alcanza para seguir.
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
