'use client';

import Reveal from '../Reveal';

// Bloque de texto con foto: geología, geografía, flora y fauna.
// Reemplaza a PerezZeledonInfoItem y a Biodiversidad, que eran el
// mismo componente con la foto puesta o quitada.
export default function BloqueInformativo({
  id,
  imagen,
  titulo,
  parrafos,
  creditos,
  conRelleno = true,
}: {
  id?: string;
  imagen?: string;
  titulo: string;
  parrafos: string[];
  creditos?: string;
  conRelleno?: boolean;
}) {
  return (
    <section className={`seo_features_one${conRelleno ? ' sec_pad' : ''}`} id={id}>
      <div className="container">
        <div className="row flex-row-reverse">
          {imagen && (
            <div className="col-lg-6">
              <div className="seo_features_img">
                <img src={`/img/distritos/${imagen}`} alt="" />
              </div>
            </div>
          )}
          <div className={imagen ? 'col-lg-6' : 'col-lg-12 mt_70'}>
            <Reveal effect="fadeInUp">
              <div className="seo_features_content">
                <h2>{titulo}</h2>
                <p className="text-justify">
                  {parrafos.map((parrafo, indice) => (
                    <span key={indice}>
                      {indice > 0 && <br />}
                      {parrafo}
                    </span>
                  ))}
                </p>
                {creditos && <p className="creditos">{creditos}</p>}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
