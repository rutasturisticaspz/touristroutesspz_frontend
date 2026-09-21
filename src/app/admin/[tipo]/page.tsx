'use client';

import { notFound, useParams } from 'next/navigation';
import ListadoAdmin from '../../../components/Admin/ListadoAdmin';
import { buscarTipoAdmin } from '../../../lib/tiposAdmin';

// /admin/:tipo — el listado de cualquiera de los siete tipos.
// Sustituye a siete páginas del admin anterior.
export default function Pagina() {
  const parametros = useParams<{ tipo: string }>();
  const tipo = buscarTipoAdmin(parametros?.tipo);
  if (!tipo) notFound();

  return <ListadoAdmin tipo={tipo} />;
}
