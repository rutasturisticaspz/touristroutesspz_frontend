'use client';

import Modal from './Modal';

// Confirmation before an action that cannot be undone.
// The previous admin did it with sweetalert2 and, on cancel, showed a
// second box with an error icon saying "The attraction is safe :)".
// Cancelling is not an error: here it simply closes.
export default function Confirmacion({
  abierto,
  titulo,
  detalle,
  textoConfirmar = 'Eliminar',
  trabajando = false,
  alConfirmar,
  alCerrar,
}: {
  abierto: boolean;
  titulo: string;
  detalle?: string;
  textoConfirmar?: string;
  trabajando?: boolean;
  alConfirmar: () => void;
  alCerrar: () => void;
}) {
  return (
    <Modal
      titulo={titulo}
      abierto={abierto}
      alCerrar={alCerrar}
      acciones={
        <>
          <button
            type="button"
            className="rt_boton rt_boton_secundario"
            onClick={alCerrar}
            disabled={trabajando}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="rt_boton rt_boton_peligro"
            onClick={alConfirmar}
            disabled={trabajando}
          >
            {trabajando ? 'Trabajando…' : textoConfirmar}
          </button>
        </>
      }
    >
      {detalle && <p style={{ marginBottom: 0 }}>{detalle}</p>}
    </Modal>
  );
}
