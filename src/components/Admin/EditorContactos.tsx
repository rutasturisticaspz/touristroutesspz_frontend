'use client';

import { useState } from 'react';
import { pedirAdmin } from '../../lib/apiAdmin';
import type { TipoAdmin } from '../../lib/tiposAdmin';
import type { Contacto, Sitio } from '../../lib/tipos';

// Contactos del sitio.
// Reemplaza a los siete archivos Contactos*.jsx del panel anterior.
// Los tipos son los cinco que el sitio público sabe dibujar: si acá se
// escribiera cualquier otra cosa, la ficha mostraría un ícono genérico
// y el enlace no funcionaría. Por eso es una lista y no texto libre.

const TIPOS_CONTACTO = ['Teléfono', 'Email', 'Página web', 'Facebook', 'Instagram'] as const;

type TipoContacto = (typeof TIPOS_CONTACTO)[number];

// Comprobación mínima por tipo, para no guardar basura.
function revisar(tipo: TipoContacto, valor: string): string | null {
  const limpio = valor.trim();
  if (limpio === '') return 'Escribí el valor del contacto.';

  if (tipo === 'Email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio)) {
    return 'Ese correo no parece válido.';
  }
  if (tipo === 'Teléfono' && limpio.replace(/\D/g, '').length < 8) {
    return 'Un teléfono de Costa Rica tiene al menos 8 dígitos.';
  }
  if (
    (tipo === 'Página web' || tipo === 'Facebook' || tipo === 'Instagram') &&
    !/^https?:\/\//i.test(limpio)
  ) {
    return 'El enlace tiene que empezar con http:// o https://';
  }
  return null;
}

export default function EditorContactos({
  tipo,
  sitio,
  alGuardar,
}: {
  tipo: TipoAdmin;
  sitio: Sitio;
  alGuardar: () => Promise<void> | void;
}) {
  const contactos = sitio.contactos ?? [];

  const [tipoNuevo, setTipoNuevo] = useState<TipoContacto>('Teléfono');
  const [valor, setValor] = useState('');
  const [trabajando, setTrabajando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agregar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (trabajando) return;

    const problema = revisar(tipoNuevo, valor);
    if (problema) {
      setError(problema);
      return;
    }

    setTrabajando(true);
    setError(null);
    try {
      // El contacto se crea suelto y después se enlaza al sitio; la
      // tabla intermedia se define con la lista completa de ids.
      const creado = await pedirAdmin<Contacto>('/contactos', {
        metodo: 'POST',
        cuerpo: { tipo: tipoNuevo, valor: valor.trim() },
      });

      await pedirAdmin(`${tipo.api}/${sitio.id}/contactos`, {
        metodo: 'PUT',
        cuerpo: { ids: [...contactos.map((c) => c.id), creado.id] },
      });

      setValor('');
      await alGuardar();
    } catch (fallo) {
      setError(fallo instanceof Error ? fallo.message : 'No se pudo agregar el contacto');
    } finally {
      setTrabajando(false);
    }
  };

  const quitar = async (contacto: Contacto) => {
    setTrabajando(true);
    setError(null);
    try {
      await pedirAdmin(`${tipo.api}/${sitio.id}/contactos/${contacto.id}`, { metodo: 'DELETE' });
      await alGuardar();
    } catch (fallo) {
      setError(fallo instanceof Error ? fallo.message : 'No se pudo quitar el contacto');
    } finally {
      setTrabajando(false);
    }
  };

  return (
    <div className="rt_admin_tarjeta">
      <h2>Contactos</h2>

      {contactos.length === 0 ? (
        <p style={{ color: '#6b7684' }}>Todavía no hay contactos.</p>
      ) : (
        <table className="rt_admin_tabla" style={{ marginBottom: 20 }}>
          <tbody>
            {contactos.map((contacto) => (
              <tr key={contacto.id}>
                <td style={{ width: 140 }}>{contacto.tipo}</td>
                <td style={{ wordBreak: 'break-all' }}>{contacto.valor}</td>
                <td className="acciones">
                  <button
                    type="button"
                    className="rt_boton rt_boton_peligro rt_boton_chico"
                    onClick={() => quitar(contacto)}
                    disabled={trabajando}
                  >
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <form onSubmit={agregar}>
        <div className="rt_admin_fila">
          <div className="rt_admin_campo">
            <label htmlFor="tipo-contacto">Tipo</label>
            <select
              id="tipo-contacto"
              value={tipoNuevo}
              onChange={(e) => {
                setTipoNuevo(e.target.value as TipoContacto);
                setError(null);
              }}
            >
              {TIPOS_CONTACTO.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          </div>

          <div className="rt_admin_campo">
            <label htmlFor="valor-contacto">
              {tipoNuevo === 'Teléfono'
                ? 'Número'
                : tipoNuevo === 'Email'
                  ? 'Correo'
                  : 'Enlace completo'}
            </label>
            <input
              id="valor-contacto"
              type="text"
              value={valor}
              placeholder={
                tipoNuevo === 'Teléfono'
                  ? '8888-8888'
                  : tipoNuevo === 'Email'
                    ? 'nombre@dominio.com'
                    : 'https://…'
              }
              onChange={(e) => {
                setValor(e.target.value);
                setError(null);
              }}
            />
          </div>
        </div>

        {error && <div className="rt_aviso rt_aviso_error">{error}</div>}

        <button type="submit" className="rt_boton" disabled={trabajando}>
          {trabajando ? 'Guardando…' : 'Agregar contacto'}
        </button>
      </form>
    </div>
  );
}
