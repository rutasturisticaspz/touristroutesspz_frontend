'use client';

import { useEffect, useState } from 'react';
import { pedirAdmin } from '../../lib/apiAdmin';
import { aPunto } from '../../lib/coordenadas';
import { DISTRITOS } from '../../lib/distritos';
import type { TipoAdmin } from '../../lib/tiposAdmin';
import type { Sitio, Ubicacion } from '../../lib/tipos';

// Ubicación del sitio.
// Reemplaza a los siete archivos Ubicaciones*.jsx del panel anterior
// (unas 250 líneas cada uno, idénticos).
// Dos cosas que cambian:
//  - Provincia y cantón vienen fijos y el distrito es una lista. Antes
//    eran tres campos de texto libre, y por eso en la base conviven
//    "Pérez Zeledón", "Perez Zeledon" y "PEREZ ZELEDON", que rompen los
//    filtros por distrito del sitio público.
//  - Las coordenadas se comprueban al escribirlas: si no caen dentro de
//    Costa Rica, avisa. Así se detecta la longitud sin el signo menos,
//    que es el error que tienen varias filas hoy.

const PROVINCIA = 'San José';
const CANTON = 'Pérez Zeledón';

interface Campos {
  provincia: string;
  canton: string;
  distrito: string;
  detalle: string;
  latitud: string;
  longitud: string;
}

const VACIO: Campos = {
  provincia: PROVINCIA,
  canton: CANTON,
  distrito: '',
  detalle: '',
  latitud: '',
  longitud: '',
};

function desde(ubicacion: Ubicacion | null | undefined): Campos {
  if (!ubicacion) return VACIO;
  return {
    provincia: ubicacion.provincia || PROVINCIA,
    canton: ubicacion.canton || CANTON,
    distrito: ubicacion.distrito || '',
    detalle: ubicacion.detalle || '',
    latitud: ubicacion.latitud || '',
    longitud: ubicacion.longitud || '',
  };
}

export default function EditorUbicacion({
  tipo,
  sitio,
  alGuardar,
}: {
  tipo: TipoAdmin;
  sitio: Sitio;
  alGuardar: () => Promise<void> | void;
}) {
  const [campos, setCampos] = useState<Campos>(() => desde(sitio.ubicacion));
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setCampos(desde(sitio.ubicacion));
  }, [sitio.ubicacion]);

  const completo = Object.values(campos).every((valor) => valor.trim() !== '');
  const punto = aPunto(campos.latitud, campos.longitud);
  const coordenadasSospechosas =
    campos.latitud.trim() !== '' && campos.longitud.trim() !== '' && punto === null;

  const cambiar = (nombre: keyof Campos, valor: string) => {
    setCampos((previo) => ({ ...previo, [nombre]: valor }));
    setListo(false);
  };

  const guardar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (!completo || guardando) return;

    setGuardando(true);
    setError(null);
    try {
      const datos = {
        provincia: campos.provincia.trim(),
        canton: campos.canton.trim(),
        distrito: campos.distrito.trim(),
        detalle: campos.detalle.trim(),
        latitud: campos.latitud.trim(),
        longitud: campos.longitud.trim(),
      };

      if (sitio.ubicacion?.id) {
        await pedirAdmin(`/ubicaciones/${sitio.ubicacion.id}`, { metodo: 'PUT', cuerpo: datos });
      } else {
        // Primero se crea la ubicación y después se enlaza al sitio.
        const creada = await pedirAdmin<Ubicacion>('/ubicaciones', {
          metodo: 'POST',
          cuerpo: datos,
        });
        await pedirAdmin(`${tipo.api}/${sitio.id}`, {
          metodo: 'PUT',
          cuerpo: { ubicacionId: creada.id },
        });
      }

      await alGuardar();
      setListo(true);
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : 'No se pudo guardar la ubicación');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="rt_admin_tarjeta">
      <h2>Ubicación</h2>

      <form onSubmit={guardar}>
        <div className="rt_admin_fila">
          <div className="rt_admin_campo">
            <label htmlFor="provincia">Provincia</label>
            <input
              id="provincia"
              type="text"
              value={campos.provincia}
              onChange={(e) => cambiar('provincia', e.target.value)}
            />
          </div>

          <div className="rt_admin_campo">
            <label htmlFor="canton">Cantón</label>
            <input
              id="canton"
              type="text"
              value={campos.canton}
              onChange={(e) => cambiar('canton', e.target.value)}
            />
          </div>

          <div className="rt_admin_campo">
            <label htmlFor="distrito">Distrito</label>
            <select
              id="distrito"
              value={campos.distrito}
              onChange={(e) => cambiar('distrito', e.target.value)}
            >
              <option value="">Elegí un distrito</option>
              {DISTRITOS.map((distrito) => (
                <option key={distrito.slug} value={distrito.nombre}>
                  {distrito.nombre}
                </option>
              ))}
              {/* Si la fila trae un distrito escrito de otra forma, se
                  conserva como opción para no perderlo sin querer. */}
              {campos.distrito &&
                !DISTRITOS.some((d) => d.nombre === campos.distrito) && (
                  <option value={campos.distrito}>{campos.distrito} (como está en la base)</option>
                )}
            </select>
          </div>
        </div>

        <div className="rt_admin_campo">
          <label htmlFor="detalle">Señas</label>
          <input
            id="detalle"
            type="text"
            value={campos.detalle}
            placeholder="200 metros al sur de la escuela…"
            onChange={(e) => cambiar('detalle', e.target.value)}
          />
        </div>

        <div className="rt_admin_fila">
          <div className="rt_admin_campo">
            <label htmlFor="latitud">Latitud</label>
            <input
              id="latitud"
              type="text"
              value={campos.latitud}
              placeholder="9.3612 o 9°21'40&quot;N"
              onChange={(e) => cambiar('latitud', e.target.value)}
            />
          </div>

          <div className="rt_admin_campo">
            <label htmlFor="longitud">Longitud</label>
            <input
              id="longitud"
              type="text"
              value={campos.longitud}
              placeholder="-83.7034 (negativa en Costa Rica)"
              onChange={(e) => cambiar('longitud', e.target.value)}
            />
          </div>
        </div>

        {coordenadasSospechosas && (
          <div className="rt_aviso rt_aviso_error">
            Esas coordenadas no caen dentro de Costa Rica. Revisá que la longitud lleve el signo
            menos: acá va entre -86 y -82,5.
          </div>
        )}

        {punto && (
          <p style={{ fontSize: 13, color: '#6b7684' }}>
            En decimales: {punto.lat.toFixed(5)}, {punto.lng.toFixed(5)} ·{' '}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${punto.lat},${punto.lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              ver en el mapa
            </a>
          </p>
        )}

        {error && <div className="rt_aviso rt_aviso_error">{error}</div>}
        {listo && <div className="rt_aviso rt_aviso_ok">Ubicación guardada.</div>}

        <button type="submit" className="rt_boton" disabled={!completo || guardando}>
          {guardando ? 'Guardando…' : 'Guardar ubicación'}
        </button>
      </form>
    </div>
  );
}
