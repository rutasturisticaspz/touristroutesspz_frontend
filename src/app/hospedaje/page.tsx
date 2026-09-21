'use client';

import ListadoSitios from '../../components/Sitios/ListadoSitios';
import { TIPOS } from '../../lib/tiposSitio';

export default function Pagina() {
  return <ListadoSitios tipo={TIPOS.hospedaje} />;
}
