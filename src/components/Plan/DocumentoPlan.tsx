'use client';

import { urlImagen } from '../../lib/api';
import { aPunto } from '../../lib/coordenadas';
import type { ItemPlan } from '../../context/PlanContext';

// El itinerario como documento imprimible.
// En pantalla no se ve: existe sólo para que el navegador lo imprima.
// Al darle Imprimir, cualquier navegador ofrece "Guardar como PDF", y
// eso es lo que baja el visitante.
// El sitio anterior hacía esto abriendo una ventana nueva y
// escribiéndole el HTML y el CSS a mano —unas 150 líneas de plantilla
// dentro de una cadena—. Cualquier bloqueador de ventanas emergentes
// lo dejaba sin hacer nada, que es el estado en que está hoy para la
// mayoría de los visitantes.

const ICONOS: Record<string, string> = {
  'Teléfono': 'Tel.',
  Email: 'Correo',
  Facebook: 'Facebook',
  Instagram: 'Instagram',
  'Página web': 'Web',
};

// Cómo se llama cada tipo en el documento.
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

                {/* Espacio para que quien lleve el papel escriba. */}
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
