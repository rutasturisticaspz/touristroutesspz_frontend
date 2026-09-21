'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { urlImagen } from '../../lib/api';
import { usePlan, type ItemPlan } from '../../context/PlanContext';
import { useIdioma } from '../../context/IdiomaContext';
import DocumentoPlan from './DocumentoPlan';

// El itinerario que el visitante fue armando.
// Cambios respecto al original:
//  - Ya no imprime el contenido del plan en la consola en cada render.
//  - El texto fijo no pasa por `t()` con la frase completa como clave
//    —eso devolvía la frase tal cual porque esas claves no existen—.
//  - Imprimir ya no abre una ventana emergente. La página trae un
//    documento oculto que sólo aparece al imprimir, así que
//    "Guardar como PDF" del navegador produce el itinerario completo.
//  - Se quitó el paso intermedio de "Confirmar": era una pantalla más
//    para llegar al mismo botón. El orden alfabético, que era lo único
//    que aportaba, ahora está acá.

const ICONOS: Record<string, string> = {
  'Teléfono': '📞',
  Email: '✉️',
  Facebook: '📘',
  Instagram: '📸',
};

export function enlaceContacto(tipo: string, valor: string): string {
  if (tipo === 'Email') return `mailto:${valor}`;
  if (tipo === 'Teléfono') return `tel:${valor}`;
  return valor;
}

export function rotuloContacto(tipo: string, valor: string): string {
  return tipo === 'Teléfono' || tipo === 'Email' ? valor : tipo;
}

type Orden = 'agregado' | 'nombre';

export default function VistaPlan() {
  const { t } = useTranslation('global');
  const { esEspanol } = useIdioma();
  const { planItems, removeFromPlan, clearPlan, listo } = usePlan();
  const [orden, setOrden] = useState<Orden>('agregado');

  const ordenados = useMemo(() => {
    if (orden === 'agregado') return planItems;
    return [...planItems].sort((a, b) =>
      a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }),
    );
  }, [planItems, orden]);

  // Hasta que se lee localStorage no se sabe si hay itinerario; pintar
  // "está vacío" antes de saberlo hacía parpadear la página.
  if (!listo) return null;

  const descripcion = (item: ItemPlan) => {
    const preferida = esEspanol ? item.descripcion : item.descripcionIngles;
    const alterna = esEspanol ? item.descripcionIngles : item.descripcion;
    return (
      preferida ||
      alterna ||
      (esEspanol ? 'Sin descripción disponible.' : 'No description available.')
    );
  };

  const sinDato = esEspanol ? 'No disponible' : 'Not available';

  if (planItems.length === 0) {
    return (
      <div className="rt_plan rt_plan_vacio">
        <h1>{t('global.PlanificationScreenTitle')}</h1>
        <p>
          {esEspanol
            ? 'Todavía no agregaste ningún lugar. Buscá una atracción, un restaurante o un hospedaje y tocá "Agregar al itinerario".'
            : 'You have not added any place yet. Find an attraction, a restaurant or a lodging and tap "Add to plan".'}
        </p>
        <div className="rt_plan_acciones_vacio">
          <Link href="/atracciones" className="rt_plan_boton rt_plan_atajo">
            {t('global.attractions')}
          </Link>
          <Link href="/restaurantes" className="rt_plan_boton rt_plan_atajo">
            {t('global.restaurants')}
          </Link>
          <Link href="/hospedaje" className="rt_plan_boton rt_plan_atajo">
            {t('global.lodgings')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rt_plan">
        <div className="rt_plan_cabecera">
          <div>
            <h1>{t('global.PlanificationScreenTitle')}</h1>
            <p className="rt_plan_conteo">
              {planItems.length}{' '}
              {esEspanol
                ? planItems.length === 1
                  ? 'lugar'
                  : 'lugares'
                : planItems.length === 1
                  ? 'place'
                  : 'places'}
            </p>
          </div>

          <div className="rt_plan_controles">
            <label htmlFor="orden-plan">{esEspanol ? 'Orden' : 'Sort'}</label>
            <select
              id="orden-plan"
              value={orden}
              onChange={(evento) => setOrden(evento.target.value as Orden)}
            >
              <option value="agregado">
                {esEspanol ? 'Como los agregué' : 'As I added them'}
              </option>
              <option value="nombre">{esEspanol ? 'Por nombre' : 'By name'}</option>
            </select>

            <button
              type="button"
              className="rt_plan_boton rt_plan_imprimir"
              onClick={() => window.print()}
            >
              {esEspanol ? 'Imprimir o guardar PDF' : 'Print or save as PDF'}
            </button>
          </div>
        </div>

        <p className="rt_plan_ayuda">
          {esEspanol
            ? 'Al imprimir, elegí "Guardar como PDF" en el destino para llevarte el itinerario en el teléfono.'
            : 'When printing, choose "Save as PDF" as the destination to take the itinerary on your phone.'}
        </p>

        {ordenados.map((item) => (
          <div className="rt_plan_item" key={item.id}>
            <h3>
              <Link href={`/sitio/${item.tipo}/${item.id}`}>{item.nombre}</Link>
            </h3>
            <p className="rt_plan_descripcion">{descripcion(item)}</p>

            <div className="rt_plan_columnas">
              <div>
                <h4>{t('global.contact')}</h4>
                {(item.contactos ?? []).length === 0 && (
                  <p>{esEspanol ? 'No hay contactos disponibles.' : 'No contacts available.'}</p>
                )}
                <ul className="list-unstyled">
                  {(item.contactos ?? []).map((contacto) => (
                    <li key={contacto.id}>
                      <span className="rt_plan_icono">{ICONOS[contacto.tipo] ?? '🔗'}</span>
                      <a
                        href={enlaceContacto(contacto.tipo, contacto.valor)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {rotuloContacto(contacto.tipo, contacto.valor)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4>{t('global.location')}</h4>
                <p>
                  {item.ubicacion?.provincia || sinDato}
                  <br />
                  {item.ubicacion?.canton || sinDato}
                  <br />
                  {item.ubicacion?.distrito || sinDato}
                </p>
              </div>
            </div>

            {(item.imagenes ?? []).length > 0 && (
              <div className="rt_plan_fotos">
                {(item.imagenes ?? []).map((imagen) => (
                  <a
                    key={imagen.id}
                    href={urlImagen(imagen.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={urlImagen(imagen.url)} alt={imagen.nombre || item.nombre} />
                  </a>
                ))}
              </div>
            )}

            <button
              type="button"
              className="rt_plan_boton rt_plan_quitar"
              onClick={() => removeFromPlan(item.id)}
            >
              {t('global.deletePlan')}
            </button>
          </div>
        ))}

        <div className="rt_plan_acciones">
          <button type="button" className="rt_plan_boton rt_plan_limpiar" onClick={clearPlan}>
            {t('global.clearPlan')}
          </button>
          <button
            type="button"
            className="rt_plan_boton rt_plan_imprimir"
            onClick={() => window.print()}
          >
            {esEspanol ? 'Imprimir o guardar PDF' : 'Print or save as PDF'}
          </button>
        </div>
      </div>

      {/* Sólo aparece al imprimir. */}
      <DocumentoPlan items={ordenados} esEspanol={esEspanol} />
    </>
  );
}
