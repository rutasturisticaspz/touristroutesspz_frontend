'use client';

import { useEffect } from 'react';
import CustomNavbar from '../../components/CustomNavbar';
import FooterRutas from '../../components/Footer/FooterRutas';
import VistaPlan from '../../components/Plan/VistaPlan';
import '../../styles/plan.css';

// /planLugares — el itinerario que el visitante fue armando.
// La barra va sin la clase `w_menu`, que pinta los enlaces de blanco.
// Esa clase la usan las páginas que abren con una foto oscura de
// fondo; acá el fondo es claro y los enlaces quedaban invisibles.
export default function Pagina() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="body_wrapper">
      <CustomNavbar cClass="custom_container p0" />
      <div className="rt_plan_fondo">
        <VistaPlan />
      </div>
      <FooterRutas />
    </div>
  );
}
