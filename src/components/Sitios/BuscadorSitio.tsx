'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { pedir } from '../../lib/api';
import { validarTexto } from '../../lib/helpers';
import { useIdioma } from '../../context/IdiomaContext';
import type { Categoria, Pagina } from '../../lib/tipos';
import type { ConfigTipo } from '../../lib/tiposSitio';

// Buscador de las páginas de listado.
// Cuando el tipo tiene categorías propias (atracciones, hospedaje)
// aparece además el desplegable de categorías.
export default function BuscadorSitio({ tipo }: { tipo: ConfigTipo }) {
  const { t } = useTranslation('global');
  const { esEspanol } = useIdioma();
  const router = useRouter();

  const [filtro, setFiltro] = useState('');
  const [categoria, setCategoria] = useState('Todos');
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    if (!tipo.conCategorias) return;
    let vigente = true;
    pedir<Pagina<Categoria>>('/categorias', { take: 100 })
      .then((pagina) => {
        if (vigente) setCategorias(pagina.datos);
      })
      .catch((error) => console.error('No se pudieron leer las categorías:', error));
    return () => {
      vigente = false;
    };
  }, [tipo.conCategorias]);

  const buscar = () => {
    const texto = filtro.trim().length > 1 ? encodeURIComponent(filtro.trim()) : 'Todos';
    const cat = categoria && categoria !== 'Todos' ? encodeURIComponent(categoria) : 'Todos';
    router.push(`/buscar/${tipo.clave}/${texto}/${cat}/1/Todos/Todos`);
  };

  const nombreCategoria = (c: Categoria) =>
    (esEspanol ? c.nombre : c.nombreIngles || c.nombre) || c.nombre;

  return (
    <section className="atracciones-search_search_area sec_pad">
      <div className="map_bg" />
      <div className="container">
        <div className="atracciones-search_box_info">
          <h3 className="wow fadeInUp" data-wow-delay="0.3s">
            {t('attractions.what_are_you_looking_for')}
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
                placeholder={t('attractions.write_here')}
                value={filtro}
                maxLength={60}
                onChange={(evento) => setFiltro(evento.target.value)}
                onKeyDown={(evento) => {
                  if (evento.key !== 'Enter') validarTexto(evento, /[^a-zA-Z0-9, ñáéíóúÁÉÍÓÚ]/g);
                }}
              />
              {tipo.conCategorias && (
                <div className="atracciones-search_select">
                  <select
                    className="form-control selectpickers"
                    value={categoria}
                    onChange={(evento) => setCategoria(evento.target.value)}
                  >
                    <option value="Todos">{esEspanol ? 'Todos' : 'All'}</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.nombre}>
                        {nombreCategoria(c)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <button type="submit" className="hosting_btn">
                {t('attractions.search')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
