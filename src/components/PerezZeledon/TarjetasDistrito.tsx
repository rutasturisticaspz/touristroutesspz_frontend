'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Sectitle from '../Title/Sectitle';
import { FICHAS_DISTRITO } from '../../lib/datosDistritos';

// La cuadrícula de los doce distritos.
export default function TarjetasDistrito({ id }: { id?: string }) {
  const { t } = useTranslation('global');

  return (
    <section className="experts_team_area sec_pad" id={id}>
      <div className="container">
        <Sectitle
          sClass="sec_title text-center mb_70"
          Title={t('perez_zeledon.distritos')}
          tClass="t_color3"
          TitleP={t('perez_zeledon.districts_description')}
        />
        <div className="row">
          {FICHAS_DISTRITO.map((ficha) => (
            <div className="col-lg-3 col-sm-6" key={ficha.id}>
              <div className="distritos_item">
                <img src={ficha.imagen} alt={ficha.nombre} />
                <div className="team_content">
                  <h3 className="f_p f_size_16 f_600 t_color3">{ficha.nombre}</h3>
                </div>
                <div className="hover_content">
                  <div className="n_hover_content">
                    <Link href={`/distritos/${ficha.id}`}>
                      <h3 className="f_p f_size_16 f_600 w_color">{ficha.nombre}</h3>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
