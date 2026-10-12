'use client';

import { useCallback, useEffect, useState } from 'react';
import Panel from '../../../components/Admin/Panel';
import Modal from '../../../components/Admin/Modal';
import Confirmacion from '../../../components/Admin/Confirmacion';
import { pedirAdmin } from '../../../lib/apiAdmin';
import type { Mapa, Pagina } from '../../../lib/tipos';

// /admin/mapas — the maps shown at /mapas.
// Each map is a name and the link of the file on Google Drive. The
// file stays on Drive: here only where the "View map" button points
// is registered. For the link to work for visitors, the file has to
// be shared as "anyone with the link".

const ENLACE_DRIVE = /^https:\/\/(drive|docs)\.google\.com\//;

export default function Pagina_() {
  const [mapas, setMapas] = useState<Mapa[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trabajando, setTrabajando] = useState(false);

  // null = closed; with id = editing; without id = creating.
  const [editando, setEditando] = useState<{ id?: string } | null>(null);
  const [nombre, setNombre] = useState('');
  const [enlace, setEnlace] = useState('');
  const [errorFormulario, setErrorFormulario] = useState<string | null>(null);

  const [aEliminar, setAEliminar] = useState<Mapa | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const pagina = await pedirAdmin<Pagina<Mapa>>('/mapas');
      setMapas(pagina.datos);
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : 'No se pudieron cargar los mapas');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const abrirFormulario = (mapa?: Mapa) => {
    setEditando({ id: mapa?.id });
    setNombre(mapa?.nombre ?? '');
    setEnlace(mapa?.enlace ?? '');
    setErrorFormulario(null);
  };

  const enlaceValido = ENLACE_DRIVE.test(enlace.trim());
  const puedeGuardar = nombre.trim() !== '' && enlaceValido;

  const guardar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (!editando || !puedeGuardar || trabajando) return;

    setTrabajando(true);
    setErrorFormulario(null);
    try {
      const cuerpo = { nombre: nombre.trim(), enlace: enlace.trim() };
      await pedirAdmin(editando.id ? `/mapas/${editando.id}` : '/mapas', {
        metodo: editando.id ? 'PUT' : 'POST',
        cuerpo,
      });
      setEditando(null);
      await cargar();
    } catch (problema) {
      setErrorFormulario(
        problema instanceof Error ? problema.message : 'No se pudo guardar el mapa',
      );
    } finally {
      setTrabajando(false);
    }
  };

  const eliminar = async (mapa: Mapa) => {
    setTrabajando(true);
    setError(null);
    try {
      await pedirAdmin(`/mapas/${mapa.id}`, { metodo: 'DELETE' });
      setAEliminar(null);
      await cargar();
    } catch (problema) {
      setAEliminar(null);
      setError(problema instanceof Error ? problema.message : 'No se pudo eliminar el mapa');
    } finally {
      setTrabajando(false);
    }
  };

  return (
    <Panel
      titulo="Mapas"
      acciones={
        <button type="button" className="rt_boton" onClick={() => abrirFormulario()}>
          Agregar mapa
        </button>
      }
    >
      {error && <div className="rt_aviso rt_aviso_error">{error}</div>}

      <div className="rt_admin_tarjeta" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="rt_admin_tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Enlace de Drive</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr>
                <td colSpan={3} className="rt_admin_vacio">
                  Cargando…
                </td>
              </tr>
            )}

            {!cargando && mapas.length === 0 && (
              <tr>
                <td colSpan={3} className="rt_admin_vacio">
                  Todavía no hay mapas. Agregá el primero con “Agregar mapa”.
                </td>
              </tr>
            )}

            {!cargando &&
              mapas.map((mapa) => (
                <tr key={mapa.id}>
                  <td>{mapa.nombre}</td>
                  <td style={{ wordBreak: 'break-all' }}>
                    <a href={mapa.enlace} target="_blank" rel="noopener noreferrer">
                      {mapa.enlace}
                    </a>
                  </td>
                  <td className="acciones">
                    <button
                      type="button"
                      className="rt_boton rt_boton_secundario rt_boton_chico"
                      onClick={() => abrirFormulario(mapa)}
                      disabled={trabajando}
                    >
                      Editar
                    </button>{' '}
                    <button
                      type="button"
                      className="rt_boton rt_boton_peligro rt_boton_chico"
                      onClick={() => setAEliminar(mapa)}
                      disabled={trabajando}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal
        titulo={editando?.id ? 'Editar mapa' : 'Agregar mapa'}
        abierto={editando !== null}
        alCerrar={() => setEditando(null)}
        acciones={
          <>
            <button
              type="button"
              className="rt_boton rt_boton_secundario"
              onClick={() => setEditando(null)}
              disabled={trabajando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="form-mapa"
              className="rt_boton"
              disabled={!puedeGuardar || trabajando}
            >
              {trabajando ? 'Guardando…' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="form-mapa" onSubmit={guardar}>
          <div className="rt_admin_campo">
            <label htmlFor="mapa-nombre">Nombre del mapa</label>
            <input
              id="mapa-nombre"
              type="text"
              value={nombre}
              placeholder="Ej.: Cataratas y Pozas"
              onChange={(evento) => setNombre(evento.target.value)}
            />
          </div>

          <div className="rt_admin_campo">
            <label htmlFor="mapa-enlace">Enlace en Google Drive</label>
            <input
              id="mapa-enlace"
              type="text"
              value={enlace}
              placeholder="https://drive.google.com/file/d/…/view"
              onChange={(evento) => setEnlace(evento.target.value)}
            />
            {enlace !== '' && !enlaceValido && (
              <p style={{ fontSize: 13, color: '#a5352a', marginTop: 6 }}>
                El enlace debe empezar con https://drive.google.com/
              </p>
            )}
          </div>

          {errorFormulario && <div className="rt_aviso rt_aviso_error">{errorFormulario}</div>}

          <p style={{ fontSize: 13, color: '#6b7684', marginBottom: 0 }}>
            En Drive, compartí el archivo como “Cualquier persona con el enlace” para que los
            visitantes puedan abrirlo. La imagen de vista previa sale del propio archivo.
          </p>
        </form>
      </Modal>

      <Confirmacion
        abierto={aEliminar !== null}
        titulo="¿Quitar este mapa?"
        detalle={
          aEliminar
            ? `${aEliminar.nombre}. Deja de aparecer en la página de mapas; el archivo en Drive no se borra.`
            : undefined
        }
        textoConfirmar="Quitar"
        trabajando={trabajando}
        alConfirmar={() => aEliminar && eliminar(aEliminar)}
        alCerrar={() => setAEliminar(null)}
      />
    </Panel>
  );
}
