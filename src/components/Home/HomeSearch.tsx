'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { validarTexto } from '../../lib/helpers';

// Buscador de la portada.
// Manda a la misma ruta de búsqueda que el sitio anterior:
//   /buscar/:tipo/:filtro/:categorias/:pagina/:accesibilidad/:otros

const TIPOS = [
  { valor: 'atracciones', etiqueta: 'attractions' },
  { valor: 'restaurantes', etiqueta: 'restaurants' },
  { valor: 'hospedaje', etiqueta: 'lodgings' },
  { valor: 'oficinas', etiqueta: 'touristic_offices' },
  { valor: 'operadores', etiqueta: 'tour_operators' },
  { valor: 'rentacars', etiqueta: 'rental_cars' },
] as const;

export default function HomeSearch() {
  const { t } = useTranslation('global');
  const router = useRouter();
  const [filtro, setFiltro] = useState('');
  const [tipo, setTipo] = useState<string>('atracciones');

  const buscar = () => {
    const texto = filtro.trim().length > 1 ? encodeURIComponent(filtro.trim()) : 'Todos';
    router.push(`/buscar/${tipo}/${texto}/Todos/1/Todos/Todos`);
  };

  return (
    <section className="atracciones-search_search_area mt_40 mb_40">
      <div className="container">
        <div className="atracciones-search_box_info">
          <h3 className="wow fadeInUp" data-wow-delay="0.3s">
            {t('home.what_are_you_looking_for')}
          </h3>
          <form
            onSubmit={(evento) => {
              evento.preventDefault();
              buscar();
            }}
          >
            <div className="atracciones-search_form_inner">
              <input
                type="text"
                className="form-control"
                placeholder={t('home.write_here')}
                value={filtro}
                maxLength={60}
                onChange={(evento) => setFiltro(evento.target.value)}
                onKeyDown={(evento) => {
                  if (evento.key !== 'Enter') validarTexto(evento, /[^a-zA-Z0-9, ñáéíóúÁÉÍÓÚ]/g);
                }}
              />
              <div className="atracciones-search_select">
                <select
                  className="form-control selectpickers"
                  value={tipo}
                  onChange={(evento) => setTipo(evento.target.value)}
                >
                  {TIPOS.map((opcion) => (
                    <option key={opcion.valor} value={opcion.valor}>
                      {t(`global.${opcion.etiqueta}`)}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="hosting_btn">
                {t('home.search')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
