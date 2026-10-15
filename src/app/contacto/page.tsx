'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomNavbar from '../../components/CustomNavbar';
import Toast from '../../components/Toast';
import FooterRutas from '../../components/Footer/FooterRutas';
import BannerDetalle from '../../components/Banner/BannerDetalle';
import { api } from '../../lib/api';
import { validarTexto } from '../../lib/helpers';
import { CONTACTOS } from '../../lib/contactos';
import '../../styles/contacto.css';

// /contacto — the public form.
// Changes from the previous one:
//  - The "sent" notice is a message on the same page, not sweetalert2
//    (an entire dependency to show a box).
//  - The email is validated before sending; before, any text was
//    accepted and the error came afterwards.
//  - When something is missing or invalid, the form says what and where
//    instead of leaving a disabled button with no explanation.
//  - The contact details in the corner are the page's; they are here
//    so the University can change them in a single place.

type Estado = 'listo' | 'enviando' | 'enviado' | 'error';
type Campo = 'nombre' | 'correo' | 'motivo' | 'asunto' | 'mensaje';

const ORDEN_CAMPOS: Campo[] = ['nombre', 'correo', 'motivo', 'asunto', 'mensaje'];
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Pagina() {
  const { t } = useTranslation('global');

  const [motivo, setMotivo] = useState('0');
  const [asunto, setAsunto] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [estado, setEstado] = useState<Estado>('listo');
  const [intentoEnviar, setIntentoEnviar] = useState(false);
  const [avisoFaltantes, setAvisoFaltantes] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cambiarMotivo = (valor: string) => {
    setMotivo(valor);
    if (valor === '1') setAsunto(t('contact.reason_one'));
    else if (valor === '2') setAsunto(t('contact.reason_two'));
    else setAsunto('');
  };

  const calcularErrores = () => {
    const errores: Partial<Record<Campo, string>> = {};
    if (nombre.trim() === '') errores.nombre = 'contact.name_required';
    if (correo.trim() === '') errores.correo = 'contact.email_required';
    else if (!CORREO_VALIDO.test(correo.trim())) errores.correo = 'contact.email_invalid';
    if (motivo === '0') errores.motivo = 'contact.reason_required';
    else {
      if (asunto.trim() === '') errores.asunto = 'contact.subject_required';
      if (mensaje.trim() === '') errores.mensaje = 'contact.message_required';
    }
    return errores;
  };

  const errores = intentoEnviar ? calcularErrores() : {};

  const propiedadesCampo = (campo: Campo) => ({
    id: `contacto-${campo}`,
    'aria-invalid': errores[campo] ? true : undefined,
    'aria-describedby': errores[campo] ? `contacto-${campo}-error` : undefined,
    className: errores[campo] ? 'rt_contacto_invalido' : undefined,
  });

  const mensajeError = (campo: Campo) =>
    errores[campo] && (
      <p id={`contacto-${campo}-error`} className="rt_contacto_error" role="alert">
        {t(errores[campo])}
      </p>
    );

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (estado === 'enviando') return;

    setIntentoEnviar(true);
    const pendientes = calcularErrores();
    const primero = ORDEN_CAMPOS.find((campo) => pendientes[campo]);
    if (primero) {
      setAvisoFaltantes(true);
      document.getElementById(`contacto-${primero}`)?.focus();
      return;
    }

    setAvisoFaltantes(false);
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
      setIntentoEnviar(false);
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
                        {...propiedadesCampo('nombre')}
                        type="text"
                        maxLength={60}
                        placeholder={t('contact.your_name')}
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key !== 'Enter') validarTexto(e, /[^a-zA-ZñáéíóúÁÉÍÓÚ' ]/g);
                        }}
                      />
                      {mensajeError('nombre')}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group text_box">
                      <input
                        {...propiedadesCampo('correo')}
                        type="email"
                        maxLength={60}
                        placeholder={t('contact.your_email')}
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                      />
                      {mensajeError('correo')}
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="form-group text_box">
                      <select
                        {...propiedadesCampo('motivo')}
                        className={`form-control selectpickers${errores.motivo ? ' rt_contacto_invalido' : ''}`}
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
                      {mensajeError('motivo')}
                    </div>
                  </div>

                  {motivo === '3' && (
                    <div className="col-lg-12">
                      <div className="form-group text_box">
                        <input
                          {...propiedadesCampo('asunto')}
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
                        {mensajeError('asunto')}
                      </div>
                    </div>
                  )}

                  {motivo !== '0' && (
                    <div className="col-lg-12">
                      <div className="form-group text_box">
                        <textarea
                          {...propiedadesCampo('mensaje')}
                          maxLength={250}
                          cols={30}
                          rows={10}
                          placeholder={t('contact.write_the_message_here')}
                          value={mensaje}
                          onChange={(e) => setMensaje(e.target.value)}
                        />
                        {mensajeError('mensaje')}
                      </div>
                    </div>
                  )}
                </div>

                <button className="btn_three" type="submit" disabled={estado === 'enviando'}>
                  {t('contact.send_message')}
                </button>
              </form>

            </div>
          </div>
        </div>
      </section>

      {avisoFaltantes && (
        <Toast tipo="error" alCerrar={() => setAvisoFaltantes(false)}>
          {t('contact.required_fields_warning')}
        </Toast>
      )}

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
