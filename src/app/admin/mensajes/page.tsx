'use client';

import { useCallback, useEffect, useState } from 'react';
import Panel from '../../../components/Admin/Panel';
import Modal from '../../../components/Admin/Modal';
import Confirmacion from '../../../components/Admin/Confirmacion';
import Paginacion from '../../../components/Admin/Paginacion';
import { pedirAdmin } from '../../../lib/apiAdmin';
import type { Pagina } from '../../../lib/tipos';

// /admin/mensajes — lo que llega del formulario de contacto.
// Reemplaza a Mensajes.jsx (274 líneas).
// Sobre el estado: los mensajes nuevos entran como 'PENDIENTE'. Los
// que ya estaban en la base traen el texto viejo, 'Sin responder'.
// Acá se considera atendido únicamente lo marcado como tal, así que
// los viejos siguen apareciendo como pendientes sin necesidad de
// tocar la base.
// Arreglo de camino: la fecha se armaba con `getMonth()` sin sumarle
// uno, así que todo el panel mostraba el mes anterior al real —un
// mensaje de marzo aparecía como de febrero, y los de enero como del
// mes 0.
//
// "Responder por correo" ya no es un mailto: (que abría el cliente de
// correo de quien estuviera en el panel, con la cuenta que tuviera
// activa en ese momento). Ahora el backend manda el correo de verdad
// por SMTP (ver backend/src/lib/mailer.ts), así que siempre sale de
// la misma cuenta institucional, y el mensaje queda marcado como
// atendido automáticamente al enviarse.

const POR_PAGINA = 10;
const ATENDIDO = 'ATENDIDO';

interface Mensaje {
  id: number;
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
  estado: string;
  createdAt: string;
}

function estaAtendido(mensaje: Mensaje): boolean {
  return mensaje.estado === ATENDIDO;
}

// dd/mm/aaaa hh:mm, con el mes que corresponde.
function conFecha(valor: string): string {
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return '';
  const dosDigitos = (n: number) => String(n).padStart(2, '0');
  return (
    `${dosDigitos(fecha.getDate())}/${dosDigitos(fecha.getMonth() + 1)}/${fecha.getFullYear()} ` +
    `${dosDigitos(fecha.getHours())}:${dosDigitos(fecha.getMinutes())}`
  );
}

function recortar(texto: string, largo = 90): string {
  return texto.length > largo + 5 ? `${texto.slice(0, largo)}…` : texto;
}

function plantillaRespuesta(mensaje: Mensaje): string {
  return `Hola ${mensaje.nombre},\n\nGracias por escribirnos.\n\n\n\nSaludos,\nRutas Turísticas Pérez Zeledón`;
}

export default function Pagina_() {
  const [filas, setFilas] = useState<Mensaje[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [texto, setTexto] = useState('');
  const [filtro, setFiltro] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [abierto, setAbierto] = useState<Mensaje | null>(null);
  const [trabajando, setTrabajando] = useState(false);

  const [aBorrar, setABorrar] = useState<Mensaje | null>(null);
  const [borrando, setBorrando] = useState(false);

  // Respuesta por correo, dentro del mismo modal de "Ver".
  const [respondiendo, setRespondiendo] = useState(false);
  const [cuerpoRespuesta, setCuerpoRespuesta] = useState('');
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(false);
  const [errorRespuesta, setErrorRespuesta] = useState<string | null>(null);

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
      const resultado = await pedirAdmin<Pagina<Mensaje>>('/mensajes', {
        parametros: {
          filtro: filtro || undefined,
          skip: (pagina - 1) * POR_PAGINA,
          take: POR_PAGINA,
          ordenarPor: 'createdAt',
          direccion: 'desc',
        },
      });
      setFilas(resultado.datos);
      setTotal(resultado.total);
      if (resultado.datos.length === 0 && pagina > 1) setPagina(pagina - 1);
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : 'No se pudieron cargar los mensajes');
    } finally {
      setCargando(false);
    }
  }, [filtro, pagina]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const cambiarEstado = async (mensaje: Mensaje, atendido: boolean) => {
    setTrabajando(true);
    setError(null);
    try {
      await pedirAdmin(`/mensajes/${mensaje.id}/estado`, {
        metodo: 'PUT',
        cuerpo: { estado: atendido ? ATENDIDO : 'PENDIENTE' },
      });
      setAbierto(null);
      await cargar();
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : 'No se pudo cambiar el estado');
    } finally {
      setTrabajando(false);
    }
  };

  const borrar = async () => {
    if (!aBorrar) return;
    setBorrando(true);
    try {
      await pedirAdmin(`/mensajes/${aBorrar.id}`, { metodo: 'DELETE' });
      setABorrar(null);
      await cargar();
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : 'No se pudo eliminar');
    } finally {
      setBorrando(false);
    }
  };

  const cerrarModal = () => {
    setAbierto(null);
    setRespondiendo(false);
    setCuerpoRespuesta('');
    setErrorRespuesta(null);
  };

  const empezarRespuesta = (mensaje: Mensaje) => {
    setRespondiendo(true);
    setErrorRespuesta(null);
    setCuerpoRespuesta(plantillaRespuesta(mensaje));
  };

  const enviarRespuesta = async () => {
    if (!abierto || !cuerpoRespuesta.trim()) return;
    setEnviandoRespuesta(true);
    setErrorRespuesta(null);
    try {
      await pedirAdmin(`/mensajes/${abierto.id}/responder`, {
        metodo: 'POST',
        cuerpo: { cuerpo: cuerpoRespuesta },
      });
      cerrarModal();
      await cargar();
    } catch (problema) {
      setErrorRespuesta(
        problema instanceof Error ? problema.message : 'No se pudo enviar la respuesta',
      );
    } finally {
      setEnviandoRespuesta(false);
    }
  };

  return (
    <Panel titulo="Mensajes">
      <div className="rt_admin_titulo">
        <div className="rt_admin_busqueda">
          <input
            type="text"
            value={texto}
            placeholder="Buscar por nombre, correo, asunto o contenido"
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

      <div className="rt_admin_tarjeta" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="rt_admin_tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>De</th>
              <th>Asunto</th>
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
                  {filtro ? 'No hay resultados para esa búsqueda.' : 'No hay mensajes.'}
                </td>
              </tr>
            )}

            {!cargando &&
              filas.map((mensaje) => (
                <tr key={mensaje.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{conFecha(mensaje.createdAt)}</td>
                  <td>
                    {mensaje.nombre}
                    <br />
                    <a href={`mailto:${mensaje.correo}`} style={{ fontSize: 13 }}>
                      {mensaje.correo}
                    </a>
                  </td>
                  <td>{recortar(mensaje.asunto)}</td>
                  <td>
                    <span className={estaAtendido(mensaje) ? 'rt_estado_ok' : 'rt_estado_pendiente'}>
                      {estaAtendido(mensaje) ? 'Atendido' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="acciones">
                    <button
                      type="button"
                      className="rt_boton rt_boton_secundario rt_boton_chico"
                      onClick={() => setAbierto(mensaje)}
                    >
                      Ver
                    </button>{' '}
                    <button
                      type="button"
                      className="rt_boton rt_boton_peligro rt_boton_chico"
                      onClick={() => setABorrar(mensaje)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Paginacion pagina={pagina} total={total} porPagina={POR_PAGINA} alCambiar={setPagina} />

      <Modal
        titulo={abierto?.asunto ?? 'Mensaje'}
        abierto={abierto !== null}
        alCerrar={cerrarModal}
        acciones={
          abierto && (
            <>
              <button type="button" className="rt_boton rt_boton_secundario" onClick={cerrarModal}>
                Cerrar
              </button>
              {respondiendo ? (
                <button
                  type="button"
                  className="rt_boton"
                  onClick={enviarRespuesta}
                  disabled={enviandoRespuesta || !cuerpoRespuesta.trim()}
                >
                  {enviandoRespuesta ? 'Enviando…' : 'Enviar respuesta'}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="rt_boton rt_boton_secundario"
                    onClick={() => empezarRespuesta(abierto)}
                  >
                    Responder por correo
                  </button>
                  <button
                    type="button"
                    className="rt_boton"
                    onClick={() => cambiarEstado(abierto, !estaAtendido(abierto))}
                    disabled={trabajando}
                  >
                    {estaAtendido(abierto) ? 'Marcar como pendiente' : 'Marcar como atendido'}
                  </button>
                </>
              )}
            </>
          )
        }
      >
        {abierto && (
          <>
            <p style={{ fontSize: 13, color: '#6b7684' }}>
              {abierto.nombre} · <a href={`mailto:${abierto.correo}`}>{abierto.correo}</a>
              <br />
              {conFecha(abierto.createdAt)}
            </p>
            <p style={{ whiteSpace: 'pre-wrap' }}>{abierto.mensaje}</p>

            {respondiendo && (
              <div className="rt_admin_campo" style={{ marginTop: 16 }}>
                <label htmlFor="cuerpoRespuesta">
                  Respuesta para {abierto.correo}
                </label>
                <textarea
                  id="cuerpoRespuesta"
                  rows={8}
                  value={cuerpoRespuesta}
                  onChange={(evento) => setCuerpoRespuesta(evento.target.value)}
                  disabled={enviandoRespuesta}
                />
                <p style={{ fontSize: 12, color: '#6b7684', marginTop: 4 }}>
                  El mensaje original se agrega automáticamente al final del correo, como
                  referencia para quien lo reciba.
                </p>
                {errorRespuesta && <div className="rt_aviso rt_aviso_error">{errorRespuesta}</div>}
              </div>
            )}
          </>
        )}
      </Modal>

      <Confirmacion
        abierto={aBorrar !== null}
        titulo="¿Eliminar este mensaje?"
        detalle={aBorrar ? `De ${aBorrar.nombre}: ${recortar(aBorrar.asunto, 60)}` : undefined}
        trabajando={borrando}
        alConfirmar={borrar}
        alCerrar={() => setABorrar(null)}
      />
    </Panel>
  );
}
