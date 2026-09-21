'use client';

import { notFound, useParams } from 'next/navigation';
import FichaSitio from '../../../../components/Admin/FichaSitio';
import { buscarTipoAdmin } from '../../../../lib/tiposAdmin';

// /admin/:tipo/:id — la ficha de edición.
export default function Pagina() {
  const parametros = useParams<{ tipo: string; id: string }>();
  const tipo = buscarTipoAdmin(parametros?.tipo);
  const id = Number(parametros?.id);

  if (!tipo || !Number.isInteger(id) || id <= 0) notFound();

  return <FichaSitio tipo={tipo} id={id} />;
}
