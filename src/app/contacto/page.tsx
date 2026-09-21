'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomNavbar from '../../components/CustomNavbar';
import Toast from '../../components/Toast';
import FooterRutas from '../../components/Footer/FooterRutas';
import BannerDetalle from '../../components/Banner/BannerDetalle';
import { api } from '../../lib/api';
import { validarTexto } from '../../lib/helpers';

// /contacto — el formulario público.
// Cambios respecto al anterior:
//  - El aviso de "enviado" es un mensaje en la misma página, no
//    sweetalert2 (una dependencia entera para mostrar un recuadro).
//  - El correo se valida antes de mandarlo; antes se aceptaba
//    cualquier texto y el error salía después.
//  - Los datos de contacto de la esquina son los de la página; están
//    aquí para que la U los pueda cambiar en un solo lugar.

const CONTACTOS = {
  telefono: '(+506) 88388535',
  telefonoLlamada: 'tel:+50688388535',
  correo: 'erick.madrigal.villanueva@una.ac.cr',
  facebook: 'https://www.facebook.com/rutasturisticaspz',
  facebookRotulo: 'rutasturisticaspz',
};

type Estado = 'listo' | 'enviando' | 'enviado' | 'error';

export default function Pagina() {
  const { t } = useTranslation('global');

  const [motivo, setMotivo] = useState('0');
  const [asunto, setAsunto] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [estado, setEstado] = useState<Estado>('listo');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cambiarMotivo = (valor: string) => {
    setMotivo(valor);
    if (valor === '1') setAsunto(t('contact.reason_one'));
    else if (valor === '2') setAsunto(t('contact.reason_two'));
    else setAsunto('');
  };

  const completo =
    nombre.trim() !== '' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim()) &&
    asunto.trim() !== '' &&
    mensaje.trim() !== '';

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (!completo || estado === 'enviando') return;

    setEstado('enviando');
    try {
      await api.enviarMensaje({
        nombre: nombre.trim(),
        correo: correo.trim(),
        asunto: asunto.trim(),
        mensaje: mensaje.trim(),
      });
      setEstado('enviado');
      setNombre('');
      setCorreo('');
      setAsunto('');
      setMensaje('');
      setMotivo('0');
    } catch (error) {
      console.error('No se pudo enviar el mensaje:', error);
      setEstado('error');
    }
  };

  return (
    <div className="body_wrapper">
      <CustomNavbar mClass="menu_four" slogo="sticky_logo" nClass="w_menu custom_container p0" />
      <BannerDetalle
        titulo={t('contact.contact_title')}
        descripcion={t('contact.contact_description')}
      />

      <section className="contact_info_area sec_pad bg_color">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <div className="contact_info_item">
                <h6 className="f_p f_size_20 t_color3 f_500 mb_20">+ Info</h6>
                <p className="f_400 f_size_15">
                  <span className="f_400 t_color3">{t('contact.phone')}:</span>{' '}
                  <a href={CONTACTOS.telefonoLlamada}>{CONTACTOS.telefono}</a>
                </p>
                <p className="f_400 f_size_15">
                  <span className="f_400 t_color3">Email:</span>{' '}
                  <a href={`mailto:${CONTACTOS.correo}`}>{CONTACTOS.correo}</a>
                </p>
                <p className="f_400 f_size_15">
                  <span className="f_400 t_color3">Facebook:</span>{' '}
                  <a href={CONTACTOS.facebook} target="_blank" rel="noopener noreferrer">
                    {CONTACTOS.facebookRotulo}
                  </a>
                </p>
              </div>
            </div>

            <div className="contact_form col-lg-9">
              <h2 className="f_p f_size_22 t_color3 f_600 l_height28 mb_40">
                {t('contact.leave_us_a_message')}
              </h2>

              <form className="contact_form_box" onSubmit={enviar}>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="form-group text_box">
                      <input
                        type="text"
                        maxLength={60}
                        placeholder={t('contact.your_name')}
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key !== 'Enter') validarTexto(e, /[^a-zA-ZñáéíóúÁÉÍÓÚ' ]/g);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group text_box">
                      <input
                        type="email"
                        maxLength={60}
                        placeholder={t('contact.your_email')}
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="form-group text_box">
                      <select
                        className="form-control selectpickers"
                        value={motivo}
                        onChange={(e) => cambiarMotivo(e.target.value)}
                      >
                        <option value="0" hidden>
                          {t('contact.reason_for_the_message')}
                        </option>
                        <option value="1">{t('contact.reason_one')}</option>
                        <option value="2">{t('contact.reason_two')}</option>
                        <option value="3">{t('contact.reason_three')}</option>
                      </select>
                    </div>
                  </div>

                  {motivo === '3' && (
                    <div className="col-lg-12">
                      <div className="form-group text_box">
                        <input
                          type="text"
                          maxLength={100}
                          placeholder="Asunto"
                          value={asunto}
                          onChange={(e) => setAsunto(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key !== 'Enter')
                              validarTexto(e, /[^a-zA-Z0-9, ñáéíóúÁÉÍÓÚ]/g);
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {motivo !== '0' && (
                    <div className="col-lg-12">
                      <div className="form-group text_box">
                        <textarea
                          maxLength={250}
                          cols={30}
                          rows={10}
                          placeholder={t('contact.write_the_message_here')}
                          value={mensaje}
                          onChange={(e) => setMensaje(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button className="btn_three" type="submit" disabled={!completo || estado === 'enviando'}>
                  {t('contact.send_message')}
                </button>
              </form>

            </div>
          </div>
        </div>
      </section>

      {estado === 'enviado' && (
        <Toast tipo="ok" alCerrar={() => setEstado('listo')}>
          <strong>{t('contact.very_good')}</strong> {t('contact.very_good_message')}
        </Toast>
      )}

      {estado === 'error' && (
        <Toast tipo="error" alCerrar={() => setEstado('listo')}>
          {t('contact.bad_message')}
        </Toast>
      )}

      <FooterRutas />
    </div>
  );
}
