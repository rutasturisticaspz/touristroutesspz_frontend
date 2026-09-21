'use client';

import Link from 'next/link';
import { useIdioma } from '../context/IdiomaContext';
import CustomNavbar from '../components/CustomNavbar';
import FooterRutas from '../components/Footer/FooterRutas';

export default function NoEncontrado() {
  const { esEspanol } = useIdioma();

  return (
    <>
      <CustomNavbar mClass="menu_four" nClass="ml-auto mr-auto" />
      <section className="error_two_area">
        <div className="container flex">
          <div className="error_content_two text-center">
            <img src="/img/new/error1.png" alt="" />
            <h2>{esEspanol
                ? 'No podemos encontrar la página que estás buscando'
                : 'We could not find the page you are looking for'}</h2>
            <Link href="/" className="about_btn btn_hover">
              {esEspanol ? 'Ir a la página de inicio' : 'Go to the home page'}
            </Link>
          </div>
        </div>
      </section>
      <FooterRutas />
    </>
  );
}
