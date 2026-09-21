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

// Ficha de edición, común a los siete tipos.
// Reemplaza a los seis archivos *Editar.jsx del panel anterior, de
// unas 600 líneas cada uno. Aquellos declaraban un `useState` por
// campo —hasta 25 en el de atracciones, contando las descripciones de
// accesibilidad en dos idiomas— y después comparaban uno por uno
// contra el original para saber si habilitar el botón de guardar. Acá
// los campos son un objeto y la comparación es contra ese objeto.
// Se conserva la idea de guardar por bloques: información general,
// ubicación, contactos y fotos se guardan por separado, como antes.

// Cadena para el <input type="date"> a partir de lo que manda el API.
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

  // Toma del sitio los campos editables del bloque general.
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
        // La ficha sirve igual sin la lista de categorías.
      });
    return () => {
      vigente = false;
    };
  }, [tipo.conCategorias]);

  // ¿Hay algo distinto de lo que está guardado?
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
          // Una fecha en blanco se manda como null, que es lo que la
          // tabla admite; mandar "" haría fallar la validación.
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
          </Link>{' '}
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
            <p style={{ fontSize: 13, color: '#6b7684' }}>
              Las dos primeras fechas son cuándo ocurre el evento; las dos de publicación son
              cuándo aparece en el sitio. El sistema anterior las mezclaba.
            </p>
          )}
        </div>

        {tipo.conCategorias && (
          <div className="rt_admin_tarjeta">
            <h2>Categorías</h2>
            {categorias.length === 0 ? (
              <p style={{ color: '#6b7684' }}>No se pudo cargar la lista de categorías.</p>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: 8,
                }}
              >
                {categorias.map((categoria) => (
                  <label
                    key={categoria.id}
                    style={{ display: 'flex', gap: 8, fontSize: 14, fontWeight: 400 }}
                  >
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
            <p style={{ fontSize: 13, color: '#6b7684' }}>
              Lo que se escriba en cada descripción es lo que el visitante ve al pasar el mouse
              sobre el distintivo en la ficha del sitio.
            </p>

            {tipo.accesibilidad.map((campo) => (
              <div key={campo} style={{ marginBottom: 18 }}>
                <label style={{ display: 'flex', gap: 8, fontSize: 14, fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={campos[campo] === true}
                    onChange={(e) => cambiar(campo, e.target.checked)}
                  />
                  {ROTULOS_ACCESIBILIDAD[campo] ?? campo}
                </label>

                {!SIN_DESCRIPCION.has(campo) && campos[campo] === true && (
                  <div className="rt_admin_fila" style={{ marginTop: 10 }}>
                    <div className="rt_admin_campo">
                      <label htmlFor={`${campo}-es`}>Descripción</label>
                      <textarea
                        id={`${campo}-es`}
                        style={{ minHeight: 70 }}
                        value={String(campos[`${campo}Descripcion`] ?? '')}
                        onChange={(e) => cambiar(`${campo}Descripcion`, e.target.value)}
                      />
                    </div>
                    <div className="rt_admin_campo">
                      <label htmlFor={`${campo}-en`}>Descripción en inglés</label>
                      <textarea
                        id={`${campo}-en`}
                        style={{ minHeight: 70 }}
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
          <span style={{ marginLeft: 12, fontSize: 13, color: '#6b7684' }}>
            No hay cambios sin guardar.
          </span>
        )}
      </form>

      <div style={{ marginTop: 20 }}>
        <Galeria tipo={tipo} sitio={sitio} alGuardar={cargar} />
        <EditorUbicacion tipo={tipo} sitio={sitio} alGuardar={cargar} />
        {tipo.conContactos && <EditorContactos tipo={tipo} sitio={sitio} alGuardar={cargar} />}
      </div>
    </Panel>
  );
}
