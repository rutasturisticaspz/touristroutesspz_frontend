'use client';

// Paginación.
// La del admin anterior calculaba `(cantidad / 10) + 1` sin redondear
// y armaba un `for` desde 1 hasta ese número: con 24 registros daba
// 3.4, o sea páginas 1, 2 y 3 —correcto de casualidad—, pero con 20
// daba 3 páginas cuando sólo hay 2, y la última salía vacía.
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
      <button type="button" disabled={pagina <= 1} onClick={() => alCambiar(pagina - 1)}>
        ‹
      </button>

      {numeros.map((n, indice) => (
        <span key={n} style={{ display: 'contents' }}>
          {indice > 0 && n - numeros[indice - 1] > 1 && <span>…</span>}
          <button
            type="button"
            className={n === pagina ? 'activo' : ''}
            onClick={() => alCambiar(n)}
          >
            {n}
          </button>
        </span>
      ))}

      <button type="button" disabled={pagina >= ultima} onClick={() => alCambiar(pagina + 1)}>
        ›
      </button>

      <span className="rt_admin_conteo">
        {total} {total === 1 ? 'registro' : 'registros'}
      </span>
    </div>
  );
}
