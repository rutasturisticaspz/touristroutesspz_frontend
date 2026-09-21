'use client';

import CustomNavbar from '../components/CustomNavbar';
import FooterRutas from '../components/Footer/FooterRutas';
import BannerInicio from '../components/Banner/BannerInicio';
import SitiosCount from '../components/Home/SitiosCount';
import HomeSearch from '../components/Home/HomeSearch';
import HomeEventos from '../components/Home/HomeEventos';
import HomeBienvenida from '../components/Home/HomeBienvenida';
import DistritosShowCase from '../components/DistritosShowCase';
import Contactanos from '../components/Home/Contactanos';
import HomeAtraccionesImagenes from '../components/Home/HomeAtraccionesImagenes';
import VeniAPerez from '../components/Home/VeniAPerez';
import HomeMapa from '../components/Home/HomeMapa';
import AtraccionesActionThree from '../components/Atracciones/AtraccionesActionThree';

// Portada. Mismas secciones y en el mismo orden que el sitio actual.
export default function Inicio() {
  return (
    <div className="body_wrapper">
      <CustomNavbar mClass="menu_four" slogo="sticky_logo" nClass="w_menu custom_container p0" />
      <BannerInicio />
      <SitiosCount />
      <HomeSearch />
      <HomeEventos />
      <HomeBienvenida />
      <DistritosShowCase />
      <Contactanos />
      <HomeAtraccionesImagenes />
      <VeniAPerez />
      <HomeMapa />
      <AtraccionesActionThree />
      <FooterRutas />
    </div>
  );
}
