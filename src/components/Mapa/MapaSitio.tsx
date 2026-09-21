'use client';

import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';
import { GOOGLE_MAPS_KEY } from '../../lib/config';
import { aPunto } from '../../lib/coordenadas';
import type { Ubicacion } from '../../lib/tipos';

// Mapa de un sitio.
// Sólo aparece si la fila tiene coordenadas legibles y si hay llave de
// Google Maps configurada. Sin llave no revienta: simplemente no
// dibuja el mapa, porque la llave es institucional y puede no estar
// puesta en un ambiente de prueba.
export default function MapaSitio({
  ubicacion,
  nombre,
}: {
  ubicacion: Ubicacion | null | undefined;
  nombre: string;
}) {
  const { t } = useTranslation('global');
  const punto = aPunto(ubicacion?.latitud, ubicacion?.longitud);

  const { isLoaded } = useJsApiLoader({
    id: 'google-maps',
    googleMapsApiKey: GOOGLE_MAPS_KEY,
  });

  if (!punto) return null;

  if (!GOOGLE_MAPS_KEY) {
    // Sin llave, al menos se ofrece el enlace a Google Maps.
    return (
      <p className="f_400 mt_05">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${punto.lat},${punto.lng}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="ti-map-alt" /> {t('global.location')}
        </a>
      </p>
    );
  }

  if (!isLoaded) return null;

  return (
    <div style={{ height: '320px', width: '100%', marginBottom: '30px' }}>
      <GoogleMap
        mapContainerStyle={{ height: '100%', width: '100%' }}
        center={punto}
        zoom={15}
        options={{ streetViewControl: false, mapTypeControl: false }}
      >
        <MarkerF position={punto} title={nombre} />
      </GoogleMap>
    </div>
  );
}
