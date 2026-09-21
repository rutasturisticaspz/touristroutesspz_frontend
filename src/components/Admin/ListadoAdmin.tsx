'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Panel from './Panel';
import Modal from './Modal';
import Confirmacion from './Confirmacion';
import Paginacion from './Paginacion';
import { pedirAdmin } from '../../lib/apiAdmin';
import type { TipoAdmin } from '../../lib/tiposAdmin';
import type { Pagina, Sitio } from '../../lib/tipos';

// Listado del panel, común a los siete tipos.
// Reemplaza a Atracciones.jsx, Hoteles.jsx, Restaurantes.jsx,
// Oficinas.jsx, Operadores.jsx, Rentadoras.jsx y Eventos.jsx: siete
// archivos de unas 230 líneas, idénticos salvo el nombre del servicio
// y los rótulos.
// Diferencias de comportamiento, todas a propósito:
//  - La búsqueda espera 400 ms antes de consultar. Antes se disparaba
//    sólo al presionar Enter porque cada tecla habría sido una consulta.
//  - Al crear se piden las dos descripciones. El backend exige
//    `descripcion` y `descripcionIngles`; el modal anterior mandaba
//    sólo el nombre y una descripción, así que el alta fallaba y el
//    aviso decía "intenta luego" sin explicar por qué.
//  - Si la última página queda vacía tras borrar, retrocede sola.

const POR_PAGINA = 10;

function recortar(texto: string | null | undefined, largo = 80): string {
  if (!texto) return '';
  return texto.length > largo + 5 ? `${texto.slice(0, largo)}…` : texto;
}

export default function ListadoAdmin({ tipo }: { tipo: TipoAdmin }) {
  const router = useRouter();

  const [filas, setFilas] = useState<Sitio[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [texto, setTexto] = useState('');
  const [filtro, setFiltro] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [creando, setCreando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorCrear, setErrorCrear] = useState<string | null>(null);
  const [nuevo, setNuevo] = useState<Record<string, string>>({});

  const [aBorrar, setABorrar] = useState<Sitio | null>(null);
  const [borrando, setBorrando] = useState(false);

  // La búsqueda no consulta en cada tecla.
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
      const resultado = await pedirAdmin<Pagina<Sitio>>(tipo.api, {
        parametros: {
          filtro: filtro || undefined,
          skip: (pagina - 1) * POR_PAGINA,
          take: POR_PAGINA,
        },
      });
      setFilas(resultado.datos);
      setTotal(resultado.total);

      // Si se borró el último de la página, no dejar la vista vacía.
      if (resultado.datos.length === 0 && pagina > 1) setPagina(pagina - 1);
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : 'No se pudo cargar la lista');
      setFilas([]);
      setTotal(0);
    } finally {
      setCargando(false);
    }
  }, [tipo.api, filtro, pagina]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  // Campos que pide el modal de alta: los que el backend exige.
  const camposAlta = [
    { nombre: 'nombre', rotulo: `Nombre`, tipo: 'texto' as const },
    ...tipo.extras.filter((extra) => extra.obligatorio).map((extra) => ({
      nombre: extra.nombre,
      rotulo: extra.rotulo,
      tipo: 'texto' as const,
    })),
    { nombre: 'descripcion', rotulo: 'Descripción', tipo: 'area' as const },
    { nombre: 'descripcionIngles', rotulo: 'Descripción en inglés', tipo: 'area' as const },
  ];

  const altaCompleta = camposAlta.every((campo) => (nuevo[campo.nombre] ?? '').trim() !== '');

  const crear = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (!altaCompleta || guardando) return;

    setGuardando(true);
    setErrorCrear(null);
    try {
      const cuerpo: Record<string, string> = {};
      for (const campo of camposAlta) cuerpo[campo.nombre] = nuevo[campo.nombre].trim();

      const creado = await pedirAdmin<Sitio>(tipo.api, { metodo: 'POST', cuerpo });
      setCreando(false);
      setNuevo({});
      // Se entra directo a la ficha: ahí van fotos, ubicación y contactos.
      router.push(`/admin/${tipo.clave}/${creado.id}`);
    } catch (problema) {
      setErrorCrear(problema instanceof Error ? problema.message : 'No se pudo crear');
      setGuardando(false);
    }
  };

  const borrar = async () => {
    if (!aBorrar) return;
    setBorrando(true);
    try {
      await pedirAdmin(`${tipo.api}/${aBorrar.id}`, { metodo: 'DELETE' });
      setABorrar(null);
      await cargar();
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : 'No se pudo eliminar');
    } finally {
      setBorrando(false);
    }
  };

  const nombresCategorias = (fila: Sitio) =>
    recortar((fila.categorias ?? []).map((c) => c.nombre).join(', '));

  const ubicacion = (fila: Sitio) =>
    fila.ubicacion ? [fila.ubicacion.canton, fila.ubicacion.distrito].filter(Boolean).join(', ') : '';

  return (
    <Panel
      titulo={tipo.rotulo}
      acciones={
        <button type="button" className="rt_boton" onClick={() => setCreando(true)}>
          Agregar {tipo.singular}
        </button>
      }
    >
      <div className="rt_admin_titulo">
        <div className="rt_admin_busqueda">
          <input
            type="text"
            value={texto}
            placeholder={`Buscar por nombre, descripción o ubicación`}
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
              <th>Nombre</th>
              <th>Descripción</th>
              {tipo.conCategorias && <th>Categorías</th>}
              <th>Ubicación</th>
              <th>Fotos</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr>
                <td colSpan={6} className="rt_admin_vacio">
                  Cargando…
                </td>
              </tr>
            )}

            {!cargando && filas.length === 0 && (
              <tr>
                <td colSpan={6} className="rt_admin_vacio">
                  {filtro ? 'No hay resultados para esa búsqueda.' : 'Todavía no hay registros.'}
                </td>
              </tr>
            )}

            {!cargando &&
              filas.map((fila) => (
                <tr key={fila.id}>
                  <td>{fila.nombre}</td>
                  <td>{recortar(fila.descripcion)}</td>
                  {tipo.conCategorias && <td>{nombresCategorias(fila)}</td>}
                  <td>{ubicacion(fila)}</td>
                  <td>{fila.imagenes?.length ?? 0}</td>
                  <td className="acciones">
                    <Link
                      href={`/admin/${tipo.clave}/${fila.id}`}
                      className="rt_boton rt_boton_secundario rt_boton_chico"
                    >
                      Editar
                    </Link>{' '}
                    <button
                      type="button"
                      className="rt_boton rt_boton_peligro rt_boton_chico"
                      onClick={() => setABorrar(fila)}
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
        titulo={`Agregar ${tipo.singular}`}
        abierto={creando}
        alCerrar={() => {
          setCreando(false);
          setErrorCrear(null);
        }}
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
              form="form-alta"
              className="rt_boton"
              disabled={!altaCompleta || guardando}
            >
              {guardando ? 'Creando…' : 'Crear'}
            </button>
          </>
        }
      >
        <form id="form-alta" onSubmit={crear}>
          {camposAlta.map((campo) => (
            <div className="rt_admin_campo" key={campo.nombre}>
              <label htmlFor={`alta-${campo.nombre}`}>{campo.rotulo}</label>
              {campo.tipo === 'area' ? (
                <textarea
                  id={`alta-${campo.nombre}`}
                  value={nuevo[campo.nombre] ?? ''}
                  onChange={(evento) =>
                    setNuevo({ ...nuevo, [campo.nombre]: evento.target.value })
                  }
                />
              ) : (
                <input
                  id={`alta-${campo.nombre}`}
                  type="text"
                  value={nuevo[campo.nombre] ?? ''}
                  onChange={(evento) =>
                    setNuevo({ ...nuevo, [campo.nombre]: evento.target.value })
                  }
                />
              )}
            </div>
          ))}

          {errorCrear && <div className="rt_aviso rt_aviso_error">{errorCrear}</div>}

          <p style={{ fontSize: 13, color: '#6b7684', marginBottom: 0 }}>
            Las fotos, la ubicación y los contactos se agregan en la ficha, después de crearlo.
          </p>
        </form>
      </Modal>

      <Confirmacion
        abierto={aBorrar !== null}
        titulo={`¿Eliminar esta ${tipo.singular}?`}
        detalle={
          aBorrar
            ? `${aBorrar.nombre}. Deja de verse en el sitio público, pero el registro y sus fotos quedan en la base.`
            : undefined
        }
        trabajando={borrando}
        alConfirmar={borrar}
        alCerrar={() => setABorrar(null)}
      />
    </Panel>
  );
}
