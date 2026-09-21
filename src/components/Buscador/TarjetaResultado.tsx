'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { primeraImagen } from '../../lib/helpers';
import { slugDistrito } from '../../lib/distritos';
import { itemDePlan, usePlan } from '../../context/PlanContext';
import { useIdioma } from '../../context/IdiomaContext';
import type { ConfigTipo } from '../../lib/tiposSitio';
import type { Sitio } from '../../lib/tipos';

// Una fila de resultados del buscador.
export default function TarjetaResultado({ sitio, tipo }: { sitio: Sitio; tipo: ConfigTipo }) {
  const { t } = useTranslation('global');
  const { esEspanol } = useIdioma();
  const { addToPlan } = usePlan();

  const destino = `/sitio/${tipo.clave}/${sitio.id}`;
  const slug = slugDistrito(sitio.ubicacion?.distrito);
  const telefono = sitio.contactos?.find((c) => c.tipo === 'Teléfono');

  const texto = (esEspanol ? sitio.descripcion : sitio.descripcionIngles) || sitio.descripcion || '';
  const resumen = texto.length > 85 ? `${texto.slice(0, 80)}...` : texto;

  return (
    <div className="col-lg-6">
      <div className="blog_list_item blog_list_item_two">
        <Link href={destino}>
          <img className="img-fluid" src={primeraImagen(sitio)} alt={sitio.nombre} />
        </Link>
        <div className="blog_content">
          <Link href={destino}>
            <h5 className="blog_title">{sitio.nombre}</h5>
          </Link>
          {resumen && <p>{resumen}</p>}
          <div className="post-info-bottom">
            {sitio.ubicacion?.distrito &&
              (slug ? (
                <Link href={`/distritos/${slug}`} className="learn_btn_two">
                  <i className="icon_pin_alt" /> {sitio.ubicacion.distrito}
                </Link>
              ) : (
                <span className="learn_btn_two">
                  <i className="icon_pin_alt" /> {sitio.ubicacion.distrito}
                </span>
              ))}
            {telefono && (
              <a className="post-info-comments" href={`tel:${telefono.valor}`}>
                <i className="ti-mobile" aria-hidden="true" />
                <span>{telefono.valor}</span>
              </a>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'left', marginTop: '16px' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                addToPlan(itemDePlan(sitio, tipo.clave, primeraImagen(sitio)))
              }
            >
              {t('global.addPlan')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
