'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIdioma } from '../../context/IdiomaContext';
import type { Sitio } from '../../lib/tipos';

// Accessibility block of the detail page.
// Each active badge shows its description on mouse hover. The
// previous site repeated the same twenty-line block seven times, one
// per badge, with seven React states and the react-tiny-popover
// library —which is no longer maintained and does not work with React
// 19—. Here the badges are a table and the bubble is our own CSS.

interface Distintivo {
  // Boolean column in the database.
  campo: string;
  // File in public/img
  imagen: string;
  // Translation key of the label.
  etiqueta: string;
  // Translation key of the bubble title.
  titulo: string;
  // false for the types that do not have that column (rental companies).
  soloConMascotas?: boolean;
}

const DISTINTIVOS: Distintivo[] = [
  {
    campo: 'permitenNinos',
    imagen: '/img/kids.png',
    etiqueta: 'accessibility.kids_friendly',
    titulo: 'accessibility.kids_friendly',
    soloConMascotas: true,
  },
  {
    campo: 'permitenMascotas',
    imagen: '/img/mascota.png',
    etiqueta: 'accessibility.pet_friendly',
    titulo: 'accessibility.pet_friendly',
    soloConMascotas: true,
  },
  {
    campo: 'discapacidadVisual',
    imagen: '/img/vista.png',
    etiqueta: 'accessibility.visual',
    titulo: 'accessibility.visualTitle',
  },
  {
    campo: 'discapacidadAuditiva',
    imagen: '/img/auditiva.png',
    etiqueta: 'accessibility.auditory',
    titulo: 'accessibility.auditoryTitle',
  },
  {
    campo: 'discapacidadFisica',
    imagen: '/img/fisica.png',
    etiqueta: 'accessibility.physical',
    titulo: 'accessibility.physicalTitle',
  },
  {
    campo: 'discapacidadCognitiva',
    imagen: '/img/congnitiva.png',
    etiqueta: 'accessibility.cognitive',
    titulo: 'accessibility.cognitiveTitle',
  },
  {
    campo: 'discapacidadSicosocial',
    imagen: '/img/sicosocial.png',
    etiqueta: 'accessibility.psychosocial',
    titulo: 'accessibility.psychosocialTitle',
  },
];

export default function Accesibilidades({
  sitio,
  tipoClave,
}: {
  sitio: Sitio;
  tipoClave: string;
}) {
  const { t } = useTranslation('global');
  const { esEspanol } = useIdioma();
  const [abierto, setAbierto] = useState<string | null>(null);

  // The rental companies table has no pets, children or declaration.
  const esRentadora = tipoClave === 'rentacars';

  const activos = DISTINTIVOS.filter((d) => {
    if (d.soloConMascotas && esRentadora) return false;
    return sitio[d.campo] === true;
  });

  const conDeclaracion = !esRentadora && sitio.declaracionTuristica === true;

  if (activos.length === 0 && !conDeclaracion) return null;

  const descripcion = (campo: string): string => {
    const es = sitio[`${campo}Descripcion`];
    const en = sitio[`${campo}DescripcionIngles`];
    const preferida = esEspanol ? es : en;
    const alterna = esEspanol ? en : es;
    return String(preferida || alterna || '');
  };

  return (
    <>
      {conDeclaracion && (
        <div className="mb-30" style={{ alignItems: 'center' }}>
          <img
            style={{ width: '45px' }}
            alt={t('accessibility.tourist_declaration')}
            src="/img/declaracionTuristica.png"
          />
          <p style={{ display: 'inline', marginLeft: '5px' }}>
            {t('accessibility.tourist_declaration')}
          </p>
        </div>
      )}

      {activos.length > 0 && (
        <div className="post_tag">
          <div className="post-nam">{t('accessibility.accessibilities')}: </div>
          <div>
            {activos.map((d) => (
              <span
                key={d.campo}
                className="rt_distintivo"
                onMouseEnter={() => setAbierto(d.campo)}
                onMouseLeave={() => setAbierto(null)}
                onFocus={() => setAbierto(d.campo)}
                onBlur={() => setAbierto(null)}
                tabIndex={0}
              >
                <img style={{ width: '45px', marginRight: '5px' }} alt={t(d.etiqueta)} src={d.imagen} />
                {t(d.etiqueta)}
                {abierto === d.campo && (
                  <span className="rt_globo card">
                    <span className="card-body">
                      <h6 className="card-title">{t(d.titulo)}</h6>
                      <span style={{ fontSize: '0.9rem' }} className="card-text">
                        {descripcion(d.campo)}
                      </span>
                    </span>
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .rt_distintivo {
          position: relative;
          display: inline-block;
          padding: 5px 10px 5px 0;
          cursor: pointer;
        }
        .rt_globo {
          position: absolute;
          bottom: 100%;
          left: 0;
          z-index: 20;
          display: block;
          width: 260px;
          padding: 0;
          background: #fff;
          border-radius: 4px;
          box-shadow: 0 10px 30px rgba(0,0,0,.15);
        }
        .rt_globo .card-body { display: block; padding: 12px 15px; }
        .rt_globo .card-title { margin-bottom: 6px; }
        .rt_globo .card-text { display: block; color: #677294; }
      `}</style>
    </>
  );
}
