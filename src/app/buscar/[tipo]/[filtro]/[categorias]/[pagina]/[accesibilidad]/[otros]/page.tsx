'use client';

import { notFound, useParams } from 'next/navigation';
import PaginaBusqueda from '../../../../../../../../components/Buscador/PaginaBusqueda';
import { buscarTipo } from '../../../../../../../../lib/tiposSitio';
import { leerLista } from '../../../../../../../../lib/filtrosBusqueda';

// /buscar/:tipo/:filtro/:categorias/:pagina/:accesibilidad/:otros
// The shape of the URL is the previous site's, so shared links keep
// working. "Todos" in any of the segments means "without that
// filter".
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
