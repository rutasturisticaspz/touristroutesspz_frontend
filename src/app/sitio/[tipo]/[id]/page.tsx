'use client';

import { notFound, useParams } from 'next/navigation';
import DetalleSitio from '../../../../components/Sitios/DetalleSitio';
import { buscarTipo } from '../../../../lib/tiposSitio';

// /sitio/:tipo/:id — the detail of any of the six types.
// The type segments are the same as the previous site's (including
// the camel case ones) so already published links keep working.
export default function Pagina() {
  const parametros = useParams<{ tipo: string; id: string }>();
  const tipo = buscarTipo(parametros?.tipo);
  const id = Number(parametros?.id);

  if (!tipo || !Number.isInteger(id) || id <= 0) notFound();

  return <DetalleSitio tipo={tipo} id={id} />;
}
