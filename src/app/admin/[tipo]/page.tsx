'use client';

import { notFound, useParams } from 'next/navigation';
import ListadoAdmin from '../../../components/Admin/ListadoAdmin';
import { buscarTipoAdmin } from '../../../lib/tiposAdmin';

// /admin/:tipo — the list of any of the seven types.
// It replaces seven pages of the previous admin.
export default function Pagina() {
  const parametros = useParams<{ tipo: string }>();
  const tipo = buscarTipoAdmin(parametros?.tipo);
  if (!tipo) notFound();

  return <ListadoAdmin tipo={tipo} />;
}
