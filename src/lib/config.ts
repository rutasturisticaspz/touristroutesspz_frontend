// Configuración del sitio público.
// El proyecto anterior tenía esto:
//   export const API_URL =
//     process.env.REACT_APP_API_URL || 'https://api.quehacerenperez.com/api'
// Ese respaldo significaba que cualquier copia del código, en la
// máquina de cualquier persona, hablaba con producción sin que nadie
// lo notara. Aquí no hay respaldo: si falta la variable, el sitio lo
// dice.

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

// Llave de Google Maps: va a ser una llave institucional. Puede venir
// vacía: los mapas muestran un aviso en vez de reventar la página.
export const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? '';

export const IDIOMA_POR_DEFECTO = 'es';
