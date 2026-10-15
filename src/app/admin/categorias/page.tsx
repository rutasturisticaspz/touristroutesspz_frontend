'use client';

import { useCallback, useEffect, useState } from 'react';
import Panel from '../../../components/Admin/Panel';
import Modal from '../../../components/Admin/Modal';
import Confirmacion from '../../../components/Admin/Confirmacion';
import Paginacion from '../../../components/Admin/Paginacion';
import { pedirAdmin } from '../../../lib/apiAdmin';
import type { Categoria, Pagina } from '../../../lib/tipos';

// /admin/categorias — the categories assigned to attractions and
// lodging.
// Replaces Categorias.jsx + CategoriasTableRow.jsx (425 lines).
// Fundamental change: the form asks for all four fields —name and
// description in both languages—, which is what the backend requires.
// The previous panel allowed creating a category with only the Spanish
// name, and afterwards the public site's search box showed the
// category blank when the visitor was in English.

const POR_PAGINA = 10;

const CAMPOS = [
  { nombre: 'nombre', rotulo: 'Nombre', area: false },
  { nombre: 'nombreIngles', rotulo: 'Nombre en inglés', area: false },
  { nombre: 'descripcion', rotulo: 'Descripción', area: true },
  { nombre: 'descripcionIngles', rotulo: 'Descripción en inglés', area: true },
] as const;

type Formulario = Record<string, string>;

const VACIO: Formulario = {
  nombre: '',
  nombreIngles: '',
  descripcion: '',
  descripcionIngles: '',
};

export default function Pagina_() {
  const [filas, setFilas] = useState<Categoria[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [texto, setTexto] = useState('');
  const [filtro, setFiltro] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // null = closed; an object = editing; VACIO = creating.
  const [editando, setEditando] = useState<Categoria | 'nueva' | null>(null);
  const [formulario, setFormulario] = useState<Formulario>(VACIO);
  const [guardando, setGuardando] = useState(false);
  const [errorForm, setErrorForm] = useState<string | null>(null);

  const [aBorrar, setABorrar] = useState<Categoria | null>(null);
  const [borrando, setBorrando] = useState(false);

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
      const resultado = await pedirAdmin<Pagina<Categoria>>('/categorias', {
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
      setError(problema instanceof Error ? problema.message : 'No se pudieron cargar las categorías');
    } finally {
      setCargando(false);
    }
  }, [filtro, pagina]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const abrirNueva = () => {
    setFormulario(VACIO);
    setErrorForm(null);
    setEditando('nueva');
  };

  const abrirEdicion = (categoria: Categoria) => {
    setFormulario({
      nombre: categoria.nombre ?? '',
      nombreIngles: categoria.nombreIngles ?? '',
      descripcion: categoria.descripcion ?? '',
      descripcionIngles: categoria.descripcionIngles ?? '',
    });
    setErrorForm(null);
    setEditando(categoria);
  };

  const completo = CAMPOS.every((campo) => (formulario[campo.nombre] ?? '').trim() !== '');

  const guardar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (!completo || guardando || editando === null) return;

    setGuardando(true);
    setErrorForm(null);
    try {
      const cuerpo: Formulario = {};
      for (const campo of CAMPOS) cuerpo[campo.nombre] = formulario[campo.nombre].trim();

      if (editando === 'nueva') {
        await pedirAdmin('/categorias', { metodo: 'POST', cuerpo });
      } else {
        await pedirAdmin(`/categorias/${editando.id}`, { metodo: 'PUT', cuerpo });
      }

      setEditando(null);
      await cargar();
    } catch (problema) {
      setErrorForm(problema instanceof Error ? problema.message : 'No se pudo guardar');
    } finally {
      setGuardando(false);
    }
  };

  const borrar = async () => {
    if (!aBorrar) return;
    setBorrando(true);
    try {
      await pedirAdmin(`/categorias/${aBorrar.id}`, { metodo: 'DELETE' });
      setABorrar(null);
      await cargar();
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : 'No se pudo eliminar');
    } finally {
      setBorrando(false);
    }
  };

  return (
    <Panel
      titulo="Categorías"
      acciones={
        <button type="button" className="rt_boton" onClick={abrirNueva}>
          Agregar categoría
        </button>
      }
    >
      <div className="rt_admin_titulo">
        <div className="rt_admin_busqueda">
          <input
            type="text"
            value={texto}
            placeholder="Buscar por nombre o descripción"
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

      <div className="rt_admin_tarjeta rt_admin_card_table">
        <table className="rt_admin_tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Nombre en inglés</th>
              <th>Descripción</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr>
                <td colSpan={4} className="rt_admin_vacio">
                  Cargando…
                </td>
              </tr>
            )}

            {!cargando && filas.length === 0 && (
              <tr>
                <td colSpan={4} className="rt_admin_vacio">
                  {filtro ? 'No hay resultados para esa búsqueda.' : 'Todavía no hay categorías.'}
                </td>
              </tr>
            )}

            {!cargando &&
              filas.map((categoria) => (
                <tr key={categoria.id}>
                  <td>{categoria.nombre}</td>
                  <td>{categoria.nombreIngles}</td>
                  <td>{categoria.descripcion}</td>
                  <td className="acciones">
                    <button
                      type="button"
                      className="rt_boton rt_boton_secundario rt_boton_chico"
                      onClick={() => abrirEdicion(categoria)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="rt_boton rt_boton_peligro rt_boton_chico"
                      onClick={() => setABorrar(categoria)}
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
        titulo={editando === 'nueva' ? 'Agregar categoría' : 'Editar categoría'}
        abierto={editando !== null}
        alCerrar={() => setEditando(null)}
        acciones={
          <>
            <button
              type="button"
              className="rt_boton rt_boton_secundario"
              onClick={() => setEditando(null)}
              disabled={guardando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="form-categoria"
              className="rt_boton"
              disabled={!completo || guardando}
            >
              {guardando ? 'Guardando…' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="form-categoria" onSubmit={guardar}>
          {CAMPOS.map((campo) => (
            <div className="rt_admin_campo" key={campo.nombre}>
              <label htmlFor={`cat-${campo.nombre}`}>{campo.rotulo}</label>
              {campo.area ? (
                <textarea
                  id={`cat-${campo.nombre}`}
                  className="rt_field_short"
                  value={formulario[campo.nombre] ?? ''}
                  onChange={(evento) =>
                    setFormulario({ ...formulario, [campo.nombre]: evento.target.value })
                  }
                />
              ) : (
                <input
                  id={`cat-${campo.nombre}`}
                  type="text"
                  value={formulario[campo.nombre] ?? ''}
                  onChange={(evento) =>
                    setFormulario({ ...formulario, [campo.nombre]: evento.target.value })
                  }
                />
              )}
            </div>
          ))}

          {errorForm && <div className="rt_aviso rt_aviso_error">{errorForm}</div>}
        </form>
      </Modal>

      <Confirmacion
        abierto={aBorrar !== null}
        titulo="¿Eliminar esta categoría?"
        detalle={
          aBorrar
            ? `${aBorrar.nombre}. Los sitios que la tienen asignada no se borran, pero dejan de mostrarla.`
            : undefined
        }
        trabajando={borrando}
        alConfirmar={borrar}
        alCerrar={() => setABorrar(null)}
      />
    </Panel>
  );
}
