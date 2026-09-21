'use client';

import { useState } from 'react';
import Panel from '../../../components/Admin/Panel';
import { pedirAdmin } from '../../../lib/apiAdmin';
import { crearXlsx, descargar, type Celda } from '../../../lib/excel';
import { TIPOS_ADMIN, type TipoAdmin } from '../../../lib/tiposAdmin';
import type { Pagina, Sitio } from '../../../lib/tipos';

// /admin/exportar — reportes en Excel.
// Reemplaza a exportExcel.jsx (200 líneas), que tenía tres funciones
// casi iguales para armar las filas y seis botones escritos a mano.
// Tres diferencias:
//  - El anterior pedía los datos sin paginar (`getXByFilter('', '', '')`),
//    y el backend viejo devolvía todo. El nuevo tiene tope por página,
//    así que acá se pide por tandas hasta traer el total. Si mañana hay
//    500 atracciones, el reporte las trae igual.
//  - Se puede bajar todo junto en un solo archivo con una pestaña por
//    tipo, que es lo que la U termina queriendo para un informe.
//  - Las columnas se arman según lo que ese tipo realmente tiene: la
//    de categorías sólo aparece en atracciones y hospedaje, y la de
//    declaración turística no aparece en rentadoras, cuya tabla no la
//    tiene. Antes salía la columna con "No" para todas.

const POR_TANDA = 200;

// Trae todos los registros de un tipo, tanda por tanda.
async function traerTodo(tipo: TipoAdmin): Promise<Sitio[]> {
  const todos: Sitio[] = [];
  let skip = 0;

  for (;;) {
    const pagina = await pedirAdmin<Pagina<Sitio>>(tipo.api, {
      parametros: { skip, take: POR_TANDA, ordenarPor: 'nombre', direccion: 'asc' },
    });

    todos.push(...pagina.datos);
    skip += POR_TANDA;

    if (todos.length >= pagina.total || pagina.datos.length === 0) break;
  }

  return todos;
}

// Encabezados y filas de un tipo.
function armarHoja(tipo: TipoAdmin, filas: Sitio[]): Celda[][] {
  const conDeclaracion = tipo.accesibilidad.includes('declaracionTuristica');

  const encabezados: string[] = ['Nombre', 'Descripción', 'Descripción en inglés'];
  if (tipo.conCategorias) encabezados.push('Categorías');
  if (conDeclaracion) encabezados.push('Declaración turística');
  encabezados.push('Accesibilidad', 'Contactos', 'Ubicación', 'Fotos');

  const datos = filas.map((fila) => {
    const salida: Celda[] = [fila.nombre, fila.descripcion, fila.descripcionIngles];

    if (tipo.conCategorias) {
      salida.push((fila.categorias ?? []).map((c) => c.nombre).join(', '));
    }

    if (conDeclaracion) {
      salida.push(fila.declaracionTuristica ? 'Sí' : 'No');
    }

    // Sólo los distintivos que ese tipo admite y que están activos.
    const distintivos = tipo.accesibilidad
      .filter((campo) => campo !== 'declaracionTuristica' && fila[campo] === true)
      .map((campo) => campo.replace(/^discapacidad/, 'Discapacidad ').replace(/^permiten/, 'Permite '));
    salida.push(distintivos.join(', '));

    salida.push((fila.contactos ?? []).map((c) => `${c.tipo}: ${c.valor}`).join(' · '));

    salida.push(
      fila.ubicacion
        ? [
            fila.ubicacion.provincia,
            fila.ubicacion.canton,
            fila.ubicacion.distrito,
            fila.ubicacion.detalle,
          ]
            .filter(Boolean)
            .join(', ')
        : '',
    );

    salida.push(fila.imagenes?.length ?? 0);

    return salida;
  });

  return [encabezados, ...datos];
}

// aaaa-mm-dd, para el nombre del archivo.
function hoy(): string {
  const fecha = new Date();
  const dosDigitos = (n: number) => String(n).padStart(2, '0');
  return `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())}`;
}

const TIPOS = Object.values(TIPOS_ADMIN);

export default function Pagina_() {
  const [trabajando, setTrabajando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [listo, setListo] = useState<string | null>(null);

  const exportar = async (tipos: TipoAdmin[], nombreArchivo: string, etiqueta: string) => {
    if (trabajando) return;

    setTrabajando(etiqueta);
    setError(null);
    setListo(null);
    try {
      const hojas = [];
      for (const tipo of tipos) {
        const filas = await traerTodo(tipo);
        hojas.push({ nombre: tipo.rotulo, filas: armarHoja(tipo, filas) });
      }

      descargar(crearXlsx(hojas), `${nombreArchivo}_${hoy()}.xlsx`);
      setListo(etiqueta);
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : 'No se pudo armar el archivo');
    } finally {
      setTrabajando(null);
    }
  };

  return (
    <Panel titulo="Exportar a Excel">
      {error && <div className="rt_aviso rt_aviso_error">{error}</div>}
      {listo && <div className="rt_aviso rt_aviso_ok">Se descargó el archivo de {listo}.</div>}

      <div className="rt_admin_tarjeta">
        <h2>Todo junto</h2>
        <p style={{ color: '#6b7684' }}>
          Un solo archivo con una pestaña por cada tipo. Es lo que conviene para un informe.
        </p>
        <button
          type="button"
          className="rt_boton"
          disabled={trabajando !== null}
          onClick={() => exportar(TIPOS, 'rutas_turisticas', 'todo')}
        >
          {trabajando === 'todo' ? 'Armando el archivo…' : 'Descargar todo'}
        </button>
      </div>

      <div className="rt_admin_tarjeta">
        <h2>Por tipo</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 12,
          }}
        >
          {TIPOS.map((tipo) => (
            <button
              key={tipo.clave}
              type="button"
              className="rt_boton rt_boton_secundario"
              disabled={trabajando !== null}
              onClick={() => exportar([tipo], tipo.clave, tipo.rotulo)}
            >
              {trabajando === tipo.rotulo ? 'Armando…' : tipo.rotulo}
            </button>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 13, color: '#6b7684' }}>
        Los archivos se arman en el navegador con los datos que devuelve el API, así que reflejan
        lo que hay en ese momento. No se guarda ninguna copia en el servidor.
      </p>
    </Panel>
  );
}
