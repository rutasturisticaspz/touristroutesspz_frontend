'use client';

import { notFound, useParams } from 'next/navigation';
import PaginaBusqueda from '../../../../../../../../components/Buscador/PaginaBusqueda';
import { buscarTipo } from '../../../../../../../../lib/tiposSitio';
import { leerLista } from '../../../../../../../../lib/filtrosBusqueda';

// /buscar/:tipo/:filtro/:categorias/:pagina/:accesibilidad/:otros
// La forma de la URL es la del sitio anterior, para que los enlaces
// compartidos sigan sirviendo. "Todos" en cualquiera de los segmentos
// significa "sin ese filtro".
export default function Pagina() {
  const p = useParams<{
    tipo: string;
    filtro: string;
    categorias: string;
    pagina: string;
    accesibilidad: string;
    otros: string;
  }>();

  const tipo = buscarTipo(p?.tipo);
  if (!tipo) notFound();

  const pagina = Number(p?.pagina);

  return (
    <PaginaBusqueda
      estado={{
        tipo,
        filtro: p?.filtro && p.filtro !== 'Todos' ? decodeURIComponent(p.filtro) : '',
        categorias: leerLista(p?.categorias),
        pagina: Number.isInteger(pagina) && pagina > 0 ? pagina : 1,
        accesibilidad: leerLista(p?.accesibilidad),
        otros: leerLista(p?.otros),
      }}
    />
  );
}
