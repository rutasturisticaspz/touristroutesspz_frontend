import type { Contacto, Sitio } from './tipos';
import { urlImagen } from './api';

// Utilidades compartidas, portadas de src/helpers/helpers.js.

// Ícono de themify según el tipo de contacto.
export function iconoContacto(tipo: string): string {
  switch (tipo) {
    case 'Página web':
      return 'ti-world';
    case 'Email':
      return 'ti-email';
    case 'Teléfono':
      return 'ti-mobile';
    case 'Facebook':
      return 'ti-facebook';
    case 'Instagram':
      return 'ti-instagram';
    default:
      return 'ti-link';
  }
}

// Convierte un teléfono a un enlace tel: usable.
export function hrefLlamada(telefono: string): string {
  return `tel:+506${telefono.replace(/[^0-9]/g, '')}`;
}

// Destino del enlace según el tipo de contacto.
export function hrefContacto(contacto: Contacto): string {
  switch (contacto.tipo) {
    case 'Email':
      return `mailto:${contacto.valor.trim()}`;
    case 'Teléfono':
      return hrefLlamada(contacto.valor);
    default:
      return contacto.valor.trim();
  }
}

// Primer teléfono de la lista, con el rótulo, o cadena vacía.
export function primerTelefono(contactos: Contacto[] | undefined): string {
  const encontrado = contactos?.find((c) => c.tipo === 'Teléfono');
  return encontrado ? `Tel: ${encontrado.valor}` : '';
}

// Primera imagen del sitio, o el marcador de posición.
export function primeraImagen(sitio: Pick<Sitio, 'imagenes'> | undefined): string {
  const url = sitio?.imagenes?.[0]?.url;
  return url ? urlImagen(url) : '/img/sinimagen.png';
}

// Bloquea teclas que no pasen la expresión regular.
export function validarTexto(evento: { key: string; preventDefault: () => void }, regex: RegExp) {
  if (regex.test(evento.key)) evento.preventDefault();
}

// Configuración de react-slick, igual que la del sitio anterior.
export function opcionesSlider(
  aMostrar: number,
  en1024: number,
  en768: number,
  en480: number,
) {
  return {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: aMostrar,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: en1024, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: en768, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: en480, slidesToScroll: 1 } },
    ],
  };
}

// Fecha o rango de fechas de un evento, en formato dd/mm/aaaa.
export function rangoFechas(inicio: string | null, fin: string | null): string {
  const formatear = (valor: string | null) => {
    if (!valor) return '';
    const [anio, mes, dia] = valor.slice(0, 10).split('-');
    return `${dia}/${mes}/${anio}`;
  };
  const desde = formatear(inicio);
  const hasta = formatear(fin);
  if (!desde) return hasta;
  if (!hasta || desde === hasta) return desde;
  return `${desde} - ${hasta}`;
}
