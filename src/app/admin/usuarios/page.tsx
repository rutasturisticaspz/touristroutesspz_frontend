'use client';

import { useCallback, useEffect, useState } from 'react';
import Panel from '../../../components/Admin/Panel';
import Modal from '../../../components/Admin/Modal';
import Confirmacion from '../../../components/Admin/Confirmacion';
import Paginacion from '../../../components/Admin/Paginacion';
import { pedirAdmin, ROLES, type Rol } from '../../../lib/apiAdmin';
import { useSesion } from '../../../context/SesionContext';
import type { Pagina } from '../../../lib/tipos';

// /admin/usuarios — who gets into the panel and with what permissions.
// Replaces Permisos.jsx + PermisosTableRow.jsx (330 lines).
// About the password: nobody types, sees or hands over a password here.
// Creating an account, or resetting one, makes the backend email the
// person a link to choose their own.
// The list includes inactive accounts on purpose: they are the ones to
// review. In the database there are several accounts with an
// administrator role that have gone unused for years.

const POR_PAGINA = 10;

interface Notice {
  type: 'ok' | 'error';
  text: string;
}

interface Usuario {
  id: number;
  nombre: string | null;
  email: string | null;
  rol: Rol;
  state: string;
  createdAt: string;
}

const ROTULO_ROL: Record<string, string> = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.MODERADOR]: 'Moderador',
  [ROLES.PARTICULAR]: 'Particular',
};

export default function Pagina_() {
  const { usuario: yo } = useSesion();

  const [filas, setFilas] = useState<Usuario[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [texto, setTexto] = useState('');
  const [filtro, setFiltro] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trabajando, setTrabajando] = useState(false);

  const [creando, setCreando] = useState(false);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [rol, setRol] = useState<Rol>(ROLES.MODERADOR);
  const [guardando, setGuardando] = useState(false);
  const [errorCrear, setErrorCrear] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const [aCambiar, setACambiar] = useState<Usuario | null>(null);
  const [aEliminar, setAEliminar] = useState<Usuario | null>(null);
  const [aRestablecer, setARestablecer] = useState<Usuario | null>(null);

  useEffect(() => {
    const temporizador = setTimeout(() => {
      setFiltro(texto.trim());
      setPagina(1);
    }, 400);
    return () => clearTimeout(temporizador);
  }, [texto]);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await pedirAdmin<Pagina<Usuario>>('/usuarios', {
        parametros: {
          filtro: filtro || undefined,
          skip: (pagina - 1) * POR_PAGINA,
          take: POR_PAGINA,
        },
      });
      setFilas(resultado.datos);
      setTotal(resultado.total);
      if (resultado.datos.length === 0 && pagina > 1) setPagina(pagina - 1);
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : 'No se pudieron cargar los usuarios');
    } finally {
      setCargando(false);
    }
  }, [filtro, pagina]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
  const puedeCrear = nombre.trim() !== '' && correoValido;

  const crear = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (!puedeCrear || guardando) return;

    setGuardando(true);
    setErrorCrear(null);
    setNotice(null);
    try {
      const response = await pedirAdmin<{
        usuario: Usuario;
        emailSent: boolean;
      }>('/usuarios/moderadores', {
        metodo: 'POST',
        cuerpo: { nombre: nombre.trim(), email: correo.trim(), rol },
      });

      const destination = response.usuario.email ?? correo.trim();
      setCreando(false);
      setNombre('');
      setCorreo('');
      setRol(ROLES.MODERADOR);
      setNotice(
        response.emailSent
          ? {
              type: 'ok',
              text: `Cuenta creada. Enviamos un enlace a ${destination} para que elija su contraseña; vence en 72 horas.`,
            }
          : {
              type: 'error',
              text: `La cuenta de ${destination} se creó, pero no se pudo enviar el correo. Usá «Restablecer contraseña» para intentarlo de nuevo.`,
            },
      );
      await cargar();
    } catch (problema) {
      setErrorCrear(problema instanceof Error ? problema.message : 'No se pudo crear el usuario');
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (usuario: Usuario, activo: boolean) => {
    setTrabajando(true);
    setError(null);
    try {
      await pedirAdmin(`/usuarios/${usuario.id}/estado`, { metodo: 'PUT', cuerpo: { activo } });
      setACambiar(null);
      await cargar();
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : 'No se pudo cambiar el estado');
    } finally {
      setTrabajando(false);
    }
  };

  const restablecerContrasena = async (usuario: Usuario) => {
    setTrabajando(true);
    setError(null);
    setNotice(null);
    try {
      const response = await pedirAdmin<{ email: string }>(
        `/usuarios/${usuario.id}/restablecer-contrasena`,
        { metodo: 'POST' },
      );
      setARestablecer(null);
      setNotice({
        type: 'ok',
        text: `Enviamos un enlace a ${response.email} para que elija una contraseña nueva; vence en 24 horas.`,
      });
    } catch (problema) {
      setARestablecer(null);
      setError(
        problema instanceof Error ? problema.message : 'No se pudo enviar el enlace al correo',
      );
    } finally {
      setTrabajando(false);
    }
  };

  const eliminarUsuario = async (usuario: Usuario) => {
    setTrabajando(true);
    setError(null);
    try {
      await pedirAdmin(`/usuarios/${usuario.id}`, { metodo: 'DELETE' });
      setAEliminar(null);
      await cargar();
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : 'No se pudo eliminar el usuario');
    } finally {
      setTrabajando(false);
    }
  };

  const cambiarRol = async (usuario: Usuario, nuevo: Rol) => {
    setTrabajando(true);
    setError(null);
    try {
      await pedirAdmin(`/usuarios/${usuario.id}/rol`, { metodo: 'PUT', cuerpo: { rol: nuevo } });
      await cargar();
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : 'No se pudo cambiar el rol');
      await cargar();
    } finally {
      setTrabajando(false);
    }
  };

  return (
    <Panel
      titulo="Usuarios y permisos"
      soloAdmin
      acciones={
        <button type="button" className="rt_boton" onClick={() => setCreando(true)}>
          Agregar usuario
        </button>
      }
    >
      <div className="rt_admin_titulo">
        <div className="rt_admin_busqueda">
          <input
            type="text"
            value={texto}
            placeholder="Buscar por nombre o correo"
            onChange={(evento) => setTexto(evento.target.value)}
          />
          {texto && (
            <button
              type="button"
              className="rt_boton rt_boton_secundario rt_boton_chico"
              onClick={() => setTexto('')}
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {error && <div className="rt_aviso rt_aviso_error">{error}</div>}
      {notice && (
        <div className={notice.type === 'ok' ? 'rt_aviso rt_aviso_ok' : 'rt_aviso rt_aviso_error'}>
          {notice.text}
        </div>
      )}

      <div className="rt_admin_tarjeta rt_admin_card_table">
        <table className="rt_admin_tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr>
                <td colSpan={5} className="rt_admin_vacio">
                  Cargando…
                </td>
              </tr>
            )}

            {!cargando && filas.length === 0 && (
              <tr>
                <td colSpan={5} className="rt_admin_vacio">
                  {filtro ? 'No hay resultados para esa búsqueda.' : 'No hay usuarios.'}
                </td>
              </tr>
            )}

            {!cargando &&
              filas.map((usuario) => {
                const activo = usuario.state === 'Active';
                const soyYo = yo?.id === usuario.id;

                return (
                  <tr key={usuario.id}>
                    <td>
                      {usuario.nombre || '—'}
                      {soyYo && (
                        <span className="rt_label_muted"> · es tu cuenta</span>
                      )}
                    </td>
                    <td className="rt_cell_wrap">{usuario.email}</td>
                    <td>
                      <select
                        value={usuario.rol}
                        disabled={trabajando || soyYo}
                        onChange={(evento) => cambiarRol(usuario, evento.target.value as Rol)}
                      >
                        {Object.values(ROLES).map((valor) => (
                          <option key={valor} value={valor}>
                            {ROTULO_ROL[valor]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span className={activo ? 'rt_estado_ok' : 'rt_estado_pendiente'}>
                        {activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="acciones">
                      <button
                        type="button"
                        className="rt_boton rt_boton_secundario rt_boton_chico"
                        onClick={() => setARestablecer(usuario)}
                        disabled={trabajando}
                      >
                        Restablecer contraseña
                      </button>
                      {activo ? (
                        <button
                          type="button"
                          className="rt_boton rt_boton_peligro rt_boton_chico"
                          onClick={() => setACambiar(usuario)}
                          disabled={trabajando || soyYo}
                          title={soyYo ? 'No podés desactivar tu propia cuenta' : undefined}
                        >
                          Desactivar
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="rt_boton rt_boton_chico"
                          onClick={() => cambiarEstado(usuario, true)}
                          disabled={trabajando}
                        >
                          Activar
                        </button>
                      )}
                      <button
                        type="button"
                        className="rt_boton rt_boton_peligro rt_boton_chico"
                        onClick={() => setAEliminar(usuario)}
                        disabled={trabajando || soyYo}
                        title={soyYo ? 'No podés eliminar tu propia cuenta' : undefined}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <Paginacion pagina={pagina} total={total} porPagina={POR_PAGINA} alCambiar={setPagina} />

      <Modal
        titulo="Agregar usuario"
        abierto={creando}
        alCerrar={() => setCreando(false)}
        acciones={
          <>
            <button
              type="button"
              className="rt_boton rt_boton_secundario"
              onClick={() => setCreando(false)}
              disabled={guardando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="form-usuario"
              className="rt_boton"
              disabled={!puedeCrear || guardando}
            >
              {guardando ? 'Creando…' : 'Crear'}
            </button>
          </>
        }
      >
        <form id="form-usuario" onSubmit={crear}>
          <div className="rt_admin_campo">
            <label htmlFor="usuario-nombre">Nombre</label>
            <input
              id="usuario-nombre"
              type="text"
              value={nombre}
              onChange={(evento) => setNombre(evento.target.value)}
            />
          </div>

          <div className="rt_admin_campo">
            <label htmlFor="usuario-correo">Correo electrónico</label>
            <input
              id="usuario-correo"
              type="email"
              value={correo}
              onChange={(evento) => setCorreo(evento.target.value)}
            />
            {correo !== '' && !correoValido && (
              <p className="rt_note rt_note_error">
                Ese correo no parece válido.
              </p>
            )}
          </div>

          <div className="rt_admin_campo">
            <label htmlFor="usuario-rol">Rol</label>
            <select
              id="usuario-rol"
              value={rol}
              onChange={(evento) => setRol(evento.target.value as Rol)}
            >
              <option value={ROLES.MODERADOR}>Moderador — edita contenido</option>
              <option value={ROLES.ADMIN}>Administrador — además maneja usuarios</option>
            </select>
          </div>

          {errorCrear && <div className="rt_aviso rt_aviso_error">{errorCrear}</div>}

          <p className="rt_note rt_note_last">
            La persona recibe un correo con un enlace para elegir su contraseña. El enlace vence
            en 72 horas.
          </p>
        </form>
      </Modal>

      <Confirmacion
        abierto={aCambiar !== null}
        titulo="¿Desactivar esta cuenta?"
        detalle={
          aCambiar
            ? `${aCambiar.nombre || aCambiar.email}. No va a poder entrar al panel hasta que la vuelvan a activar.`
            : undefined
        }
        textoConfirmar="Desactivar"
        trabajando={trabajando}
        alConfirmar={() => aCambiar && cambiarEstado(aCambiar, false)}
        alCerrar={() => setACambiar(null)}
      />

      <Confirmacion
        abierto={aRestablecer !== null}
        titulo="¿Restablecer la contraseña?"
        detalle={
          aRestablecer
            ? `${aRestablecer.nombre || aRestablecer.email}. Le enviamos un enlace a ${aRestablecer.email} para que elija una contraseña nueva. La contraseña actual sigue funcionando hasta que la cambie.`
            : undefined
        }
        textoConfirmar="Enviar enlace"
        trabajando={trabajando}
        alConfirmar={() => aRestablecer && restablecerContrasena(aRestablecer)}
        alCerrar={() => setARestablecer(null)}
      />

      <Confirmacion
        abierto={aEliminar !== null}
        titulo="¿Eliminar esta cuenta?"
        detalle={
          aEliminar
            ? `${aEliminar.nombre || aEliminar.email}. Esto no se puede deshacer. Si tiene calificaciones o rutas asociadas, no se va a poder eliminar: hay que desactivarla en su lugar.`
            : undefined
        }
        textoConfirmar="Eliminar"
        trabajando={trabajando}
        alConfirmar={() => aEliminar && eliminarUsuario(aEliminar)}
        alCerrar={() => setAEliminar(null)}
      />
    </Panel>
  );
}
