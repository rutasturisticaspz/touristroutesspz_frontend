// Public site configuration.
// The previous project had this:
//   export const API_URL =
//     process.env.REACT_APP_API_URL || 'https://api.quehacerenperez.com/api'
// That fallback meant that any copy of the code, on anyone's machine,
// talked to production without anybody noticing. Here there is no
// fallback: if the variable is missing, the site says so.

function requerido(nombre: string, valor: string | undefined): string {
  if (!valor || valor.trim() === '') {
    throw new Error(
      `Falta la variable de entorno ${nombre}. ` +
        `Copie .env.example como .env.local y complete los valores.`,
    );
  }
  return valor;
}

export const API_URL = requerido('NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URL);

// Google Maps key: it will be an institutional key. It may come empty:
// the maps show a notice instead of blowing up the page.
export const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? '';

export const IDIOMA_POR_DEFECTO = 'es';
