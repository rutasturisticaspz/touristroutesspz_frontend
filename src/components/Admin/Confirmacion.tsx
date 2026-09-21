'use client';

import Modal from './Modal';

// Confirmación antes de una acción que no se puede deshacer.
// El admin anterior lo hacía con sweetalert2 y, al cancelar, mostraba
// un segundo recuadro con icono de error diciendo "La atracción está a
// salvo :)". Cancelar no es un error: acá simplemente se cierra.
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
