'use client';

import { useRef, useState } from 'react';
import { urlImagen } from '../../lib/api';
import { pedirAdmin } from '../../lib/apiAdmin';
import Confirmacion from './Confirmacion';
import type { TipoAdmin } from '../../lib/tiposAdmin';
import type { Imagen, Sitio } from '../../lib/tipos';

// Site photo gallery.
// Replaces the seven Galeria*.jsx files of the previous panel
// —309 lines each— and, above all, changes where the photos go:
// before, they were uploaded to Firebase Storage with the personal
// account of whoever built the system, and the database stored a URL
// with a token inside. Now the file stays on the server's disk and
// the database stores a relative path, which is what the University
// asked for.
// "Remove" deactivates the record but does not delete the file from
// disk, same as before: if someone makes a mistake, the photo can be
// recovered.

// What the backend accepts.
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

    // The backend accepts one file per call; if the user chooses several
    // they are uploaded one after another.
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

      <p className="rt_note">
        La primera foto es la que sale de portada en el sitio público y de fondo en la ficha.
      </p>

      {imagenes.length === 0 ? (
        <p className="rt_text_muted">Todavía no hay fotos.</p>
      ) : (
        <div className="rt_gallery">
          {imagenes.map((imagen, indice) => (
            <div key={imagen.id} className="rt_gallery_item">
              <a href={urlImagen(imagen.url)} target="_blank" rel="noopener noreferrer">
                <img
                  src={urlImagen(imagen.url)}
                  alt={imagen.nombre || sitio.nombre}
                  className="rt_gallery_img"
                />
              </a>
              <div className="rt_gallery_footer">
                {indice === 0 && (
                  <span className="rt_gallery_cover">Portada</span>
                )}
                <button
                  type="button"
                  className="rt_boton rt_boton_peligro rt_boton_chico rt_button_block"
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

      {subiendo && <p className="rt_text_muted">Subiendo…</p>}

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
