'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Panel from './Panel';
import Galeria from './Galeria';
import EditorUbicacion from './EditorUbicacion';
import EditorContactos from './EditorContactos';
import { pedirAdmin } from '../../lib/apiAdmin';
import {
  ROTULOS_ACCESIBILIDAD,
  SIN_DESCRIPCION,
  type TipoAdmin,
} from '../../lib/tiposAdmin';
import type { Categoria, Pagina, Sitio } from '../../lib/tipos';

// Edit page, common to the seven types.
// Replaces the six *Editar.jsx files of the previous panel, of about
// 600 lines each. Those declared one `useState` per field —up to 25
// in the attractions one, counting the accessibility descriptions in
// two languages— and then compared them one by one against the
// original to know whether to enable the save button. Here the
// fields are an object and the comparison is against that object.
// The idea of saving by blocks is kept: general information, location,
// contacts and photos are saved separately, as before.

// String for the <input type="date"> from what the API sends.
function aFecha(valor: unknown): string {
  if (typeof valor !== 'string' || valor === '') return '';
  return valor.slice(0, 10);
}

export default function FichaSitio({ tipo, id }: { tipo: TipoAdmin; id: number }) {
  const [sitio, setSitio] = useState<Sitio | null>(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  const [campos, setCampos] = useState<Record<string, unknown>>({});
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [elegidas, setElegidas] = useState<number[]>([]);

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listo, setListo] = useState(false);

  // Takes the editable fields of the general block from the site.
  const desdeSitio = useCallback(
    (datos: Sitio): Record<string, unknown> => {
      const valores: Record<string, unknown> = {
        nombre: datos.nombre ?? '',
        descripcion: datos.descripcion ?? '',
        descripcionIngles: datos.descripcionIngles ?? '',
      };

      for (const extra of tipo.extras) {
        valores[extra.nombre] =
          extra.tipo === 'fecha' ? aFecha(datos[extra.nombre]) : (datos[extra.nombre] ?? '');
      }

      for (const campo of tipo.accesibilidad) {
        valores[campo] = datos[campo] === true;
        if (SIN_DESCRIPCION.has(campo)) continue;
        valores[`${campo}Descripcion`] = datos[`${campo}Descripcion`] ?? '';
        valores[`${campo}DescripcionIngles`] = datos[`${campo}DescripcionIngles`] ?? '';
      }

      return valores;
    },
    [tipo.extras, tipo.accesibilidad],
  );

  const cargar = useCallback(async () => {
    setErrorCarga(null);
    try {
      const datos = await pedirAdmin<Sitio>(`${tipo.api}/${id}`);
      setSitio(datos);
      setCampos(desdeSitio(datos));
      setElegidas((datos.categorias ?? []).map((c) => c.id));
    } catch (problema) {
      setErrorCarga(problema instanceof Error ? problema.message : 'No se pudo cargar el registro');
    } finally {
      setCargando(false);
    }
  }, [tipo.api, id, desdeSitio]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  useEffect(() => {
    if (!tipo.conCategorias) return;
    let vigente = true;
    pedirAdmin<Pagina<Categoria>>('/categorias', { parametros: { take: 200 } })
      .then((resultado) => vigente && setCategorias(resultado.datos))
      .catch(() => {
        // The page works the same without the list of categories.
      });
    return () => {
      vigente = false;
    };
  }, [tipo.conCategorias]);

  // Is anything different from what is saved?
  const hayCambios = useMemo(() => {
    if (!sitio) return false;

    const original = desdeSitio(sitio);
    const generalCambio = Object.keys(original).some(
      (clave) => String(original[clave] ?? '') !== String(campos[clave] ?? ''),
    );
    if (generalCambio) return true;

    if (tipo.conCategorias) {
      const guardadas = (sitio.categorias ?? []).map((c) => c.id).sort();
      const actuales = [...elegidas].sort();
      if (guardadas.length !== actuales.length) return true;
      if (guardadas.some((valor, indice) => valor !== actuales[indice])) return true;
    }

    return false;
  }, [sitio, campos, elegidas, desdeSitio, tipo.conCategorias]);

  const nombreVacio = String(campos.nombre ?? '').trim() === '';

  const cambiar = (nombre: string, valor: unknown) => {
    setCampos((previo) => ({ ...previo, [nombre]: valor }));
    setListo(false);
  };

  const guardar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (!sitio || nombreVacio || !hayCambios || guardando) return;

    setGuardando(true);
    setError(null);
    try {
      const cuerpo: Record<string, unknown> = {};

      for (const [clave, valor] of Object.entries(campos)) {
        const extra = tipo.extras.find((e) => e.nombre === clave);
        if (extra?.tipo === 'fecha') {
          // A blank date is sent as null, which is what the table accepts;
          // sending "" would make validation fail.
          cuerpo[clave] = valor === '' ? null : valor;
          continue;
        }
        cuerpo[clave] = typeof valor === 'string' ? valor.trim() : valor;
      }

      await pedirAdmin(`${tipo.api}/${sitio.id}`, { metodo: 'PUT', cuerpo });

      if (tipo.conCategorias) {
        await pedirAdmin(`${tipo.api}/${sitio.id}/categorias`, {
          metodo: 'PUT',
          cuerpo: { ids: elegidas },
        });
      }

      await cargar();
      setListo(true);
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : 'No se pudo guardar');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return <Panel titulo={tipo.rotulo}>…</Panel>;
  }

  if (errorCarga || !sitio) {
    return (
      <Panel titulo={tipo.rotulo}>
        <div className="rt_aviso rt_aviso_error">{errorCarga ?? 'No se encontró el registro.'}</div>
        <Link href={`/admin/${tipo.clave}`} className="rt_boton rt_boton_secundario">
          Volver a la lista
        </Link>
      </Panel>
    );
  }

  return (
    <Panel
      titulo={sitio.nombre}
      acciones={
        <>
          <Link href={`/admin/${tipo.clave}`} className="rt_boton rt_boton_secundario">
            Volver a la lista
          </Link>
          <Link
            href={
              tipo.claveSitio ? `/sitio/${tipo.claveSitio}/${sitio.id}` : `/evento/${sitio.id}`
            }
            className="rt_boton rt_boton_secundario"
            target="_blank"
          >
            Ver en el sitio
          </Link>
        </>
      }
    >
      <form onSubmit={guardar}>
        <div className="rt_admin_tarjeta">
          <h2>Información general</h2>

          <div className="rt_admin_campo">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              type="text"
              value={String(campos.nombre ?? '')}
              onChange={(e) => cambiar('nombre', e.target.value)}
            />
          </div>

          {tipo.extras
            .filter((extra) => extra.tipo !== 'fecha')
            .map((extra) => (
              <div className="rt_admin_campo" key={extra.nombre}>
                <label htmlFor={extra.nombre}>{extra.rotulo}</label>
                <input
                  id={extra.nombre}
                  type="text"
                  value={String(campos[extra.nombre] ?? '')}
                  onChange={(e) => cambiar(extra.nombre, e.target.value)}
                />
              </div>
            ))}

          <div className="rt_admin_campo">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              value={String(campos.descripcion ?? '')}
              onChange={(e) => cambiar('descripcion', e.target.value)}
            />
          </div>

          <div className="rt_admin_campo">
            <label htmlFor="descripcionIngles">Descripción en inglés</label>
            <textarea
              id="descripcionIngles"
              value={String(campos.descripcionIngles ?? '')}
              onChange={(e) => cambiar('descripcionIngles', e.target.value)}
            />
          </div>

          {tipo.extras.some((extra) => extra.tipo === 'fecha') && (
            <div className="rt_admin_fila">
              {tipo.extras
                .filter((extra) => extra.tipo === 'fecha')
                .map((extra) => (
                  <div className="rt_admin_campo" key={extra.nombre}>
                    <label htmlFor={extra.nombre}>{extra.rotulo}</label>
                    <input
                      id={extra.nombre}
                      type="date"
                      value={String(campos[extra.nombre] ?? '')}
                      onChange={(e) => cambiar(extra.nombre, e.target.value)}
                    />
                  </div>
                ))}
            </div>
          )}

          {tipo.clave === 'eventos' && (
            <p className="rt_note">
              Las dos primeras fechas son cuándo ocurre el evento; las dos de publicación son
              cuándo aparece en el sitio. El sistema anterior las mezclaba.
            </p>
          )}
        </div>

        {tipo.conCategorias && (
          <div className="rt_admin_tarjeta">
            <h2>Categorías</h2>
            {categorias.length === 0 ? (
              <p className="rt_text_muted">No se pudo cargar la lista de categorías.</p>
            ) : (
              <div className="rt_check_list">
                {categorias.map((categoria) => (
                  <label key={categoria.id} className="rt_check">
                    <input
                      type="checkbox"
                      checked={elegidas.includes(categoria.id)}
                      onChange={(e) => {
                        setElegidas((previo) =>
                          e.target.checked
                            ? [...previo, categoria.id]
                            : previo.filter((valor) => valor !== categoria.id),
                        );
                        setListo(false);
                      }}
                    />
                    {categoria.nombre}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {tipo.accesibilidad.length > 0 && (
          <div className="rt_admin_tarjeta">
            <h2>Accesibilidad</h2>
            <p className="rt_note">
              Lo que se escriba en cada descripción es lo que el visitante ve al pasar el mouse
              sobre el distintivo en la ficha del sitio.
            </p>

            {tipo.accesibilidad.map((campo) => (
              <div key={campo} className="rt_admin_block">
                <label className="rt_check rt_check_title">
                  <input
                    type="checkbox"
                    checked={campos[campo] === true}
                    onChange={(e) => cambiar(campo, e.target.checked)}
                  />
                  {ROTULOS_ACCESIBILIDAD[campo] ?? campo}
                </label>

                {!SIN_DESCRIPCION.has(campo) && campos[campo] === true && (
                  <div className="rt_admin_fila rt_admin_row_sub">
                    <div className="rt_admin_campo">
                      <label htmlFor={`${campo}-es`}>Descripción</label>
                      <textarea
                        id={`${campo}-es`}
                        className="rt_field_short"
                        value={String(campos[`${campo}Descripcion`] ?? '')}
                        onChange={(e) => cambiar(`${campo}Descripcion`, e.target.value)}
                      />
                    </div>
                    <div className="rt_admin_campo">
                      <label htmlFor={`${campo}-en`}>Descripción en inglés</label>
                      <textarea
                        id={`${campo}-en`}
                        className="rt_field_short"
                        value={String(campos[`${campo}DescripcionIngles`] ?? '')}
                        onChange={(e) => cambiar(`${campo}DescripcionIngles`, e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {error && <div className="rt_aviso rt_aviso_error">{error}</div>}
        {listo && <div className="rt_aviso rt_aviso_ok">Cambios guardados.</div>}

        <button
          type="submit"
          className="rt_boton"
          disabled={nombreVacio || !hayCambios || guardando}
        >
          {guardando ? 'Guardando…' : 'Guardar cambios'}
        </button>
        {!hayCambios && !guardando && (
          <span className="rt_note rt_note_inline">
            No hay cambios sin guardar.
          </span>
        )}
      </form>

      <div className="rt_admin_section">
        <Galeria tipo={tipo} sitio={sitio} alGuardar={cargar} />
        <EditorUbicacion tipo={tipo} sitio={sitio} alGuardar={cargar} />
        {tipo.conContactos && <EditorContactos tipo={tipo} sitio={sitio} alGuardar={cargar} />}
      </div>
    </Panel>
  );
}
