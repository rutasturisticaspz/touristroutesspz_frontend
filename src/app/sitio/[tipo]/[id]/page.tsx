'use client';

import { notFound, useParams } from 'next/navigation';
import DetalleSitio from '../../../../components/Sitios/DetalleSitio';
import { buscarTipo } from '../../../../lib/tiposSitio';

// /sitio/:tipo/:id — el detalle de cualquiera de los seis tipos.
// Los segmentos de tipo son los mismos del sitio anterior (incluidos
// los que van en camello) para que los enlaces ya publicados sigan
// funcionando.
export default function Pagina() {
  const parametros = useParams<{ tipo: string; id: string }>();
  const tipo = buscarTipo(parametros?.tipo);
  const id = Number(parametros?.id);

  if (!tipo || !Number.isInteger(id) || id <= 0) notFound();

  return <DetalleSitio tipo={tipo} id={id} />;
}
