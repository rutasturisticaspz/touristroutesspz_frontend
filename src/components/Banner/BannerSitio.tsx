'use client';

import { useTranslation } from 'react-i18next';
import Reveal from '../Reveal';
import CollageInteractivo, { type FotoCollage } from './CollageInteractivo';
import type { ConfigTipo } from '../../lib/tiposSitio';

// Banner of the list pages.
// The six banners of the previous site were the same file copied with
// a different title and image. Here it is a single parameterized one,
// with an interactive photo collage instead of a flat image.
export default function BannerSitio({
  tipo,
  fotos = [],
}: {
  tipo: ConfigTipo;
  // Photos of the section for the collage; the flat image is used when
  // there are too few.
  fotos?: FotoCollage[];
}) {
  const { t } = useTranslation('global');
  const [linea1, linea2] = tipo.descripcion;

  return (
    <section className="seo_home_area">
      <div className="home_bubble">
        <div className="bubble b_one" />
        <div className="bubble b_two" />
        <div className="bubble b_three" />
        <div className="bubble b_four" />
        <div className="bubble b_five" />
        <div className="bubble b_six" />
        <div className="triangle b_seven" data-parallax='{"x": 20, "y": 150}'>
          <img src="/img/seo/triangle_one.png" alt="" />
        </div>
        <div className="triangle b_nine">
          <img src="/img/seo/triangle_three.png" alt="" />
        </div>
      </div>
      <div className="banner_top">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center seo_banner_content">
              <Reveal effect="fadeInUp" duration={500}>
                <h2>
                  {t(tipo.titulo)}
                  <br />
                </h2>
              </Reveal>
              <Reveal effect="fadeInUp" duration={1000}>
                <p className="wow fadeInUp" data-wow-delay="0.5s">
                  {t(linea1)}
                  {linea2 && (
                    <>
                      <br />
                      {t(linea2)}
                    </>
                  )}
                </p>
              </Reveal>
            </div>
          </div>
          <div className="saas_home_img">
            <Reveal effect="fadeInUp" duration={1400}>
              <CollageInteractivo fotos={fotos} imagenDeRespaldo={tipo.imagen} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
