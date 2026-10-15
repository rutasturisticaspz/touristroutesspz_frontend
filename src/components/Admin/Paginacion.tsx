'use client';

import { Fragment } from 'react';

// Pagination.
// The previous admin's computed `(count / 10) + 1` without rounding
// and built a `for` from 1 up to that number: with 24 records it gave
// 3.4, that is pages 1, 2 and 3 —correct by chance—, but with 20 it
// gave 3 pages when there are only 2, and the last one came out empty.
export default function Paginacion({
  pagina,
  total,
  porPagina,
  alCambiar,
}: {
  pagina: number;
  total: number;
  porPagina: number;
  alCambiar: (pagina: number) => void;
}) {
  const ultima = Math.max(1, Math.ceil(total / porPagina));
  if (total === 0) return null;

  const cerca = [pagina - 1, pagina, pagina + 1].filter((n) => n >= 1 && n <= ultima);
  const numeros = [...new Set([1, ...cerca, ultima])].sort((a, b) => a - b);

  return (
    <div className="rt_admin_paginacion">
      <button
        type="button"
        aria-label="Página anterior"
        disabled={pagina <= 1}
        onClick={() => alCambiar(pagina - 1)}
      >
        ‹
      </button>

      {numeros.map((n, indice) => (
        <Fragment key={n}>
          {indice > 0 && n - numeros[indice - 1] > 1 && <span>…</span>}
          <button
            type="button"
            className={n === pagina ? 'activo' : ''}
            aria-current={n === pagina ? 'page' : undefined}
            onClick={() => alCambiar(n)}
          >
            {n}
          </button>
        </Fragment>
      ))}

      <button
        type="button"
        aria-label="Página siguiente"
        disabled={pagina >= ultima}
        onClick={() => alCambiar(pagina + 1)}
      >
        ›
      </button>

      <span className="rt_admin_conteo">
        {total} {total === 1 ? 'registro' : 'registros'}
      </span>
    </div>
  );
}
