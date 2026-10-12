'use client';

import { useEffect } from 'react';
import CustomNavbar from '../../components/CustomNavbar';
import FooterRutas from '../../components/Footer/FooterRutas';
import VistaPlan from '../../components/Plan/VistaPlan';
import '../../styles/plan.css';

// /planLugares — the itinerary the visitor has been building.
// The bar goes without the `w_menu` class, which paints the links
// white. That class is used by the pages that open with a dark photo
// background; here the background is light and the links were
// invisible.
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
