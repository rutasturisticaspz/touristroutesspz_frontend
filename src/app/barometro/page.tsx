'use client';

import { useEffect, useMemo, useState } from 'react';
import CustomNavbar from '../../components/CustomNavbar';
import FooterRutas from '../../components/Footer/FooterRutas';
import BannerDetalle from '../../components/Banner/BannerDetalle';
import Instrumento from '../../components/Barometro/Instrumento';
import Resultados from '../../components/Barometro/Resultados';
import {
  calcular,
  respuestasVacias,
  type DatosNegocio,
  type Respuesta,
  type Respuestas,
} from '../../lib/barometro';
import '../../styles/barometro.css';

const NEGOCIO_VACIO: DatosNegocio = { nombre: '', actividad: '', ubicacion: '' };

// /barometro — sustainability self-assessment for businesses.
// Nothing that is typed leaves the browser: the result is computed on
// screen and the PDF is generated locally.
export default function Pagina() {
  const [negocio, setNegocio] = useState<DatosNegocio>(NEGOCIO_VACIO);
  const [respuestas, setRespuestas] = useState<Respuestas>(respuestasVacias);
  const [generandoPdf, setGenerandoPdf] = useState(false);
  const [errorPdf, setErrorPdf] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const resultado = useMemo(() => calcular(respuestas), [respuestas]);

  const responder = (dimension: number, indicador: number, respuesta: Respuesta) => {
    setRespuestas((previas) =>
      previas.map((fila, d) =>
        d === dimension ? fila.map((actual, i) => (i === indicador ? respuesta : actual)) : fila,
      ),
    );
  };

  const limpiar = () => {
    setRespuestas(respuestasVacias());
  };

  const descargar = async () => {
    setGenerandoPdf(true);
    setErrorPdf(false);
    try {
      // The PDF library is heavy: it is only downloaded when the PDF is
      // requested.
      const { descargarPdfBarometro } = await import('../../lib/barometroPdf');
      await descargarPdfBarometro(negocio, resultado);
    } catch (error) {
      console.error('No se pudo generar el PDF:', error);
      setErrorPdf(true);
    } finally {
      setGenerandoPdf(false);
    }
  };

  return (
    <div className="body_wrapper">
      <CustomNavbar mClass="menu_four" slogo="sticky_logo" nClass="w_menu custom_container p0" />
      <BannerDetalle
        titulo="Barómetro de Sostenibilidad Turística"
        descripcion="Autodiagnóstico para empresas y emprendimientos turísticos. Registre sus prácticas y obtenga una lectura inmediata de su desempeño, avances y prioridades de mejora."
      />

      <section className="rt_baro mb_60">
        <div className="container">
          <Instrumento
            negocio={negocio}
            respuestas={respuestas}
            alCambiarNegocio={(cambios) => setNegocio((previo) => ({ ...previo, ...cambios }))}
            alResponder={responder}
          />
          <Resultados
            resultado={resultado}
            generandoPdf={generandoPdf}
            errorPdf={errorPdf}
            alDescargar={descargar}
            alLimpiar={limpiar}
          />
        </div>
      </section>

      <FooterRutas />
    </div>
  );
}
