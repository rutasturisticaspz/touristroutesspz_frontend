'use client';

import { useMemo, useState } from 'react';
import { useIdioma } from '../../context/IdiomaContext';
import type { ItemPlan } from '../../context/PlanContext';
import { enlaceContacto, rotuloContacto } from './VistaPlan';

// Tabla final del itinerario, lista para imprimir.
// El original abría una ventana nueva y le escribía el HTML y el CSS a
// mano —unas 150 líneas de plantilla— para luego llamar a print(). Eso
// lo bloquea cualquier navegador con el bloqueador de ventanas
// emergentes activado, que es casi cualquiera. Aquí se imprime la
// página misma con una hoja de estilos de impresión: el resultado es
// el mismo y no depende de abrir ventanas.

const ICONOS: Record<string, string> = {
  'Teléfono': '📞',
  Email: '✉️',
  Facebook: '📘',
  Instagram: '📸',
};

type Direccion = 'asc' | 'desc';

export default function ConfirmacionPlan({
  items,
  alCerrar,
}: {
  items: ItemPlan[];
  alCerrar: () => void;
}) {
  const { esEspanol } = useIdioma();
  const [direccion, setDireccion] = useState<Direccion>('asc');

  const ordenados = useMemo(() => {
    const copia = [...items];
    copia.sort((a, b) =>
      a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }) *
      (direccion === 'asc' ? 1 : -1),
    );
    return copia;
  }, [items, direccion]);

  const texto = {
    titulo: esEspanol ? 'Confirmar itinerario' : 'Confirm plan',
    lugar: esEspanol ? 'Lugar' : 'Place',
    detalles: esEspanol ? 'Detalles' : 'Details',
    contactos: esEspanol ? 'Contactos' : 'Contacts',
    imprimir: esEspanol ? 'Imprimir' : 'Print',
    cancelar: esEspanol ? 'Cancelar' : 'Cancel',
    descripcion: esEspanol ? 'Descripción' : 'Description',
    ubicacion: esEspanol ? 'Ubicación' : 'Location',
    provincia: esEspanol ? 'Provincia' : 'Province',
    canton: esEspanol ? 'Cantón' : 'Canton',
    distrito: esEspanol ? 'Distrito' : 'District',
    sinContactos: esEspanol ? 'No hay contactos disponibles.' : 'No contacts available.',
    sinDescripcion: esEspanol ? 'Sin descripción disponible.' : 'No description available.',
    sinDato: esEspanol ? 'No disponible' : 'Not available',
    ordenar: esEspanol ? 'Ordenar por lugar' : 'Sort by place',
  };

  const descripcion = (item: ItemPlan) => {
    const preferida = esEspanol ? item.descripcion : item.descripcionIngles;
    const alterna = esEspanol ? item.descripcionIngles : item.descripcion;
    return preferida || alterna || texto.sinDescripcion;
  };

  return (
    <div className="rt_plan rt_plan_confirmacion">
      <h2 className="rt_plan_titulo">{texto.titulo}</h2>

      <table className="rt_plan_tabla">
        <thead>
          <tr>
            <th
              onClick={() => setDireccion(direccion === 'asc' ? 'desc' : 'asc')}
              title={texto.ordenar}
              style={{ cursor: 'pointer' }}
            >
              {texto.lugar} {direccion === 'asc' ? '▲' : '▼'}
            </th>
            <th>{texto.detalles}</th>
            <th>{texto.contactos}</th>
          </tr>
        </thead>
        <tbody>
          {ordenados.map((item) => (
            <tr key={item.id}>
              <td className="rt_plan_nombre">{item.nombre}</td>
              <td>
                <div className="rt_plan_descripcion">{descripcion(item)}</div>
                <div className="rt_plan_ubicacion">
                  <strong>{texto.ubicacion}</strong>
                  <br />
                  {texto.provincia}: {item.ubicacion?.provincia || texto.sinDato}
                  <br />
                  {texto.canton}: {item.ubicacion?.canton || texto.sinDato}
                  <br />
                  {texto.distrito}: {item.ubicacion?.distrito || texto.sinDato}
                </div>
              </td>
              <td>
                {(item.contactos ?? []).length === 0 ? (
                  <div>{texto.sinContactos}</div>
                ) : (
                  (item.contactos ?? []).map((contacto) => (
                    <div key={contacto.id}>
                      <span className="rt_plan_icono">{ICONOS[contacto.tipo] ?? '🔗'}</span>
                      <a
                        href={enlaceContacto(contacto.tipo, contacto.valor)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {rotuloContacto(contacto.tipo, contacto.valor)}
                      </a>
                    </div>
                  ))
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="rt_plan_acciones rt_no_imprimir">
        <button type="button" className="rt_plan_boton rt_plan_limpiar" onClick={alCerrar}>
          {texto.cancelar}
        </button>
        <button
          type="button"
          className="rt_plan_boton rt_plan_imprimir"
          onClick={() => window.print()}
        >
          {texto.imprimir}
        </button>
      </div>
    </div>
  );
}
