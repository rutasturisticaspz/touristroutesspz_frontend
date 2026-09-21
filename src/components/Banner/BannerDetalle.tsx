'use client';

// Banner de las páginas de detalle y del buscador: la foto de fondo
// con el nombre encima. Uno solo en vez de los tres del sitio
// anterior (SitioIndividualBanner, EventoIndividualBanner y el que
// usaba el buscador), que eran el mismo archivo con distinto título.
export default function BannerDetalle({
  imagen,
  titulo,
  descripcion,
}: {
  imagen?: string | null;
  titulo?: string;
  descripcion?: string | null;
}) {
  const fondo = imagen || '/img/home/Chirripo1.jpg';

  return (
    <section className="sitio_single_banner_area">
      <div
        className="parallax-effect"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)), url(${fondo}) center center/cover no-repeat`,
        }}
      />
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="sitio_single_banner_content">
              <h2 className="wow fadeInUp" data-wow-delay="0.8s">
                <span />
                {titulo}
                <span />
              </h2>
              {descripcion && descripcion.length > 1 && (
                <p className="f_400 w_color f_size_16 l_height26">{descripcion}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
