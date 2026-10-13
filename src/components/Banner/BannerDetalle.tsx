'use client';

// Banner of the detail and search pages: the background photo with
// the name on top. A single one instead of the three of the previous
// site (SitioIndividualBanner, EventoIndividualBanner and the one the
// search page used), which were the same file with a different title.
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
