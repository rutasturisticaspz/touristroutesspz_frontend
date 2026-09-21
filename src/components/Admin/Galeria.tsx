'use client';

import { useRef, useState } from 'react';
import { urlImagen } from '../../lib/api';
import { pedirAdmin } from '../../lib/apiAdmin';
import Confirmacion from './Confirmacion';
import type { TipoAdmin } from '../../lib/tiposAdmin';
import type { Imagen, Sitio } from '../../lib/tipos';

// Galería de fotos del sitio.
// Reemplaza a los siete archivos Galeria*.jsx del panel anterior
// —309 líneas cada uno— y, sobre todo, cambia a dónde van las fotos:
// antes se subían a Firebase Storage con la cuenta personal de quien
// hizo el sistema, y la base guardaba una URL con un token adentro.
// Ahora el archivo queda en el disco del servidor y la base guarda una
// ruta relativa, que es lo que pedía la U.
// "Quitar" da de baja el registro pero no borra el archivo del disco,
// igual que antes: si alguien se equivoca, la foto se puede recuperar.

// Lo que acepta el backend.
const TAMANO_MAXIMO = 8 * 1024 * 1024;

export default function Galeria({
  tipo,
  sitio,
  alGuardar,
}: {
  tipo: TipoAdmin;
  sitio: Sitio;
  alGuardar: () => Promise<void> | void;
}) {
  const imagenes = sitio.imagenes ?? [];
  const campoArchivo = useRef<HTMLInputElement>(null);

  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aQuitar, setAQuitar] = useState<Imagen | null>(null);
  const [quitando, setQuitando] = useState(false);

  const subir = async (archivos: FileList | null) => {
    if (!archivos || archivos.length === 0) return;

    setSubiendo(true);
    setError(null);

    // El backend acepta un archivo por llamada; si el usuario elige
    // varios se suben uno tras otro.
    try {
      for (const archivo of Array.from(archivos)) {
        if (!archivo.type.startsWith('image/')) {
          throw new Error(`"${archivo.name}" no es una imagen.`);
        }
        if (archivo.size > TAMANO_MAXIMO) {
          throw new Error(
            `"${archivo.name}" pesa más de lo permitido. Reducila antes de subirla.`,
          );
        }

        const formulario = new FormData();
        formulario.append('archivo', archivo);
        formulario.append('nombre', archivo.name);

        await pedirAdmin(`/imagenes/${tipo.tipoImagen}/${sitio.id}`, {
          metodo: 'POST',
          formulario,
        });
      }

      await alGuardar();
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : 'No se pudo subir la foto');
    } finally {
      setSubiendo(false);
      if (campoArchivo.current) campoArchivo.current.value = '';
    }
  };

  const quitar = async () => {
    if (!aQuitar) return;
    setQuitando(true);
    try {
      await pedirAdmin(`/imagenes/${tipo.tipoImagen}/${aQuitar.id}`, { metodo: 'DELETE' });
      setAQuitar(null);
      await alGuardar();
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : 'No se pudo quitar la foto');
    } finally {
      setQuitando(false);
    }
  };

  return (
    <div className="rt_admin_tarjeta">
      <h2>Fotos</h2>

      <p style={{ fontSize: 13, color: '#6b7684' }}>
        La primera foto es la que sale de portada en el sitio público y de fondo en la ficha.
      </p>

      {imagenes.length === 0 ? (
        <p style={{ color: '#6b7684' }}>Todavía no hay fotos.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 14,
            marginBottom: 20,
          }}
        >
          {imagenes.map((imagen, indice) => (
            <div
              key={imagen.id}
              style={{ border: '1px solid #e3e8ef', borderRadius: 8, overflow: 'hidden' }}
            >
              <a href={urlImagen(imagen.url)} target="_blank" rel="noopener noreferrer">
                <img
                  src={urlImagen(imagen.url)}
                  alt={imagen.nombre || sitio.nombre}
                  style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }}
                />
              </a>
              <div style={{ padding: '8px 10px' }}>
                {indice === 0 && (
                  <span style={{ fontSize: 12, color: '#00868f', fontWeight: 600 }}>Portada</span>
                )}
                <button
                  type="button"
                  className="rt_boton rt_boton_peligro rt_boton_chico"
                  style={{ width: '100%', marginTop: 6 }}
                  onClick={() => setAQuitar(imagen)}
                >
                  Quitar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <div className="rt_aviso rt_aviso_error">{error}</div>}

      <div className="rt_admin_campo">
        <label htmlFor="archivo">Agregar fotos</label>
        <input
          id="archivo"
          ref={campoArchivo}
          type="file"
          accept="image/*"
          multiple
          disabled={subiendo}
          onChange={(evento) => subir(evento.target.files)}
        />
      </div>

      {subiendo && <p style={{ color: '#6b7684' }}>Subiendo…</p>}

      <Confirmacion
        abierto={aQuitar !== null}
        titulo="¿Quitar esta foto?"
        detalle="Deja de verse en el sitio, pero el archivo no se borra del servidor."
        textoConfirmar="Quitar"
        trabajando={quitando}
        alConfirmar={quitar}
        alCerrar={() => setAQuitar(null)}
      />
    </div>
  );
}
