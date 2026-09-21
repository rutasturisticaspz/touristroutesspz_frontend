'use client';

import Reveal from '../Reveal';

// Un hito de la línea de tiempo de la historia del cantón.
export default function HitoHistorico({
  claseFila,
  claseTexto,
  imagen,
  icono,
  titulo,
  descripcion,
}: {
  claseFila: string;
  claseTexto: string;
  imagen: string;
  icono: string;
  titulo: string;
  descripcion: string;
}) {
  return (
    <div className={`agency_featured_item ${claseFila}`}>
      <div className="col-lg-6">
        <Reveal effect="fadeInLeft">
          <div className="agency_featured_img text-center">
            <img src={`/img/distritos/${imagen}`} alt="" />
          </div>
        </Reveal>
      </div>
      <div className="col-lg-6">
        <div className={`agency_featured_content wow fadeInLeft ${claseTexto}`} data-wow-delay="0.6s">
          <Reveal effect="fadeInRight">
            <img className="number" src={`/img/resources/${icono}`} alt="" />
            <h3>{titulo}</h3>
            <p className="text-justify">{descripcion}</p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
