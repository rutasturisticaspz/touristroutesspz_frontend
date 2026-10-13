'use client';

import { urlImagen } from '../../lib/api';
import { aPunto } from '../../lib/coordenadas';
import type { ItemPlan } from '../../context/PlanContext';

// The itinerary as a printable document.
// It is not visible on screen: it exists only for the browser to print
// it. When Print is chosen, any browser offers "Save as PDF", and that
// is what the visitor downloads.
// The previous site did this by opening a new window and writing the
// HTML and CSS into it by hand —about 150 lines of template inside a
// string—. Any pop-up blocker left it doing nothing, which is the
// state it is in today for most visitors.

const ICONOS: Record<string, string> = {
  'Teléfono': 'Tel.',
  Email: 'Correo',
  Facebook: 'Facebook',
  Instagram: 'Instagram',
  'Página web': 'Web',
};

// What each type is called in the document.
const NOMBRE_TIPO: Record<string, { es: string; en: string }> = {
  atracciones: { es: 'Atracción', en: 'Attraction' },
  restaurantes: { es: 'Restaurante', en: 'Restaurant' },
  hospedaje: { es: 'Hospedaje', en: 'Lodging' },
  oficinasTuristicas: { es: 'Oficina turística', en: 'Tourist office' },
  operadoresTuristicos: { es: 'Operador turístico', en: 'Tour operator' },
  rentacars: { es: 'Rentadora de vehículos', en: 'Car rental' },
};

export default function DocumentoPlan({
  items,
  esEspanol,
}: {
  items: ItemPlan[];
  esEspanol: boolean;
}) {
  const fecha = new Date().toLocaleDateString(esEspanol ? 'es-CR' : 'en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const texto = {
    titulo: esEspanol ? 'Mi itinerario en Pérez Zeledón' : 'My itinerary in Pérez Zeledón',
    generado: esEspanol ? 'Generado el' : 'Generated on',
    lugares: esEspanol ? 'lugares' : 'places',
    lugar: esEspanol ? 'lugar' : 'place',
    ubicacion: esEspanol ? 'Ubicación' : 'Location',
    contactos: esEspanol ? 'Contactos' : 'Contacts',
    mapa: esEspanol ? 'Ver en el mapa' : 'View on the map',
    sinDato: esEspanol ? 'No indicada' : 'Not provided',
    pie: esEspanol
      ? 'quehacerenperez.com · Rutas Turísticas Pérez Zeledón · Universidad Nacional'
      : 'quehacerenperez.com · Pérez Zeledón Tourist Routes · Universidad Nacional',
  };

  const descripcion = (item: ItemPlan) => {
    const preferida = esEspanol ? item.descripcion : item.descripcionIngles;
    const alterna = esEspanol ? item.descripcionIngles : item.descripcion;
    return preferida || alterna || '';
  };

  const tipoDe = (item: ItemPlan) => {
    const nombres = NOMBRE_TIPO[item.tipo];
    if (!nombres) return '';
    return esEspanol ? nombres.es : nombres.en;
  };

  return (
    <div className="rt_documento" aria-hidden="true">
      <header className="rt_doc_encabezado">
        <div className="rt_doc_logos">
          <img src="/img/logoRTC.png" alt="" />
          <img src="/img/logoVPC.png" alt="" />
          <img src="/img/logoUNAC.png" alt="" />
        </div>
        <h1>{texto.titulo}</h1>
        <p>
          {texto.generado} {fecha} · {items.length}{' '}
          {items.length === 1 ? texto.lugar : texto.lugares}
        </p>
      </header>

      <ol className="rt_doc_lista">
        {items.map((item) => {
          const punto = aPunto(item.ubicacion?.latitud, item.ubicacion?.longitud);
          const foto = item.imagen || (item.imagenes?.[0] ? urlImagen(item.imagenes[0].url) : null);

          return (
            <li key={item.id} className="rt_doc_item">
              {foto && <img className="rt_doc_foto" src={foto} alt="" />}

              <div className="rt_doc_cuerpo">
                <h2>{item.nombre}</h2>
                {tipoDe(item) && <p className="rt_doc_tipo">{tipoDe(item)}</p>}

                {descripcion(item) && <p className="rt_doc_descripcion">{descripcion(item)}</p>}

                <p className="rt_doc_dato">
                  <strong>{texto.ubicacion}:</strong>{' '}
                  {[item.ubicacion?.provincia, item.ubicacion?.canton, item.ubicacion?.distrito]
                    .filter(Boolean)
                    .join(', ') || texto.sinDato}
                  {punto && (
                    <>
                      {' · '}
                      <span className="rt_doc_coordenadas">
                        {punto.lat.toFixed(5)}, {punto.lng.toFixed(5)}
                      </span>
                    </>
                  )}
                </p>

                {(item.contactos ?? []).length > 0 && (
                  <p className="rt_doc_dato">
                    <strong>{texto.contactos}:</strong>{' '}
                    {(item.contactos ?? [])
                      .map((c) => `${ICONOS[c.tipo] ?? c.tipo} ${c.valor}`)
                      .join('  ·  ')}
                  </p>
                )}

                {/* Space for whoever carries the paper to write. */}
                <div className="rt_doc_notas" />
              </div>
            </li>
          );
        })}
      </ol>

      <footer className="rt_doc_pie">{texto.pie}</footer>
    </div>
  );
}
