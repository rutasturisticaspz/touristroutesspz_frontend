// Conversión de coordenadas.
// En la base de datos latitud y longitud son texto libre, y conviven
// dos formatos: decimal ("9.3612") y grados/minutos/segundos
// ("9°25'25.6\"N"). El sitio anterior nunca las usó para pintar un
// mapa, así que nadie las normalizó. Aquí se aceptan ambos.

// Grados decimales a partir del texto guardado, o null si no se entiende.
export function aDecimal(valor: string | null | undefined): number | null {
  if (!valor) return null;
  const texto = valor.trim();
  if (texto === '') return null;

  // Formato decimal, con punto o coma y posible letra de rumbo.
  const decimal = texto.match(/^(-?\d+(?:[.,]\d+)?)\s*([NSEWOnsewo])?$/);
  if (decimal) {
    const numero = Number(decimal[1].replace(',', '.'));
    if (!Number.isFinite(numero)) return null;
    return aplicarRumbo(numero, decimal[2]);
  }

  // Formato grados/minutos/segundos: 9°25'25.6"N
  const gms = texto.match(
    /^(-?\d+(?:[.,]\d+)?)\s*°\s*(?:(\d+(?:[.,]\d+)?)\s*['′]\s*)?(?:(\d+(?:[.,]\d+)?)\s*["″]?\s*)?([NSEWOnsewo])?$/,
  );
  if (!gms) return null;

  const grados = Number(gms[1].replace(',', '.'));
  const minutos = gms[2] ? Number(gms[2].replace(',', '.')) : 0;
  const segundos = gms[3] ? Number(gms[3].replace(',', '.')) : 0;
  if (![grados, minutos, segundos].every(Number.isFinite)) return null;

  const signo = grados < 0 ? -1 : 1;
  const absoluto = Math.abs(grados) + minutos / 60 + segundos / 3600;
  return aplicarRumbo(signo * absoluto, gms[4]);
}

// S y W (u O, de Oeste) son negativos.
function aplicarRumbo(numero: number, rumbo?: string): number {
  if (!rumbo) return numero;
  const letra = rumbo.toUpperCase();
  const negativo = letra === 'S' || letra === 'W' || letra === 'O';
  return negativo ? -Math.abs(numero) : Math.abs(numero);
}

// Punto listo para el mapa, o null si falta o no se entiende alguna de
// las dos coordenadas. Se descartan las que caen fuera de Costa Rica:
// en la base hay filas con la longitud sin el signo negativo, que
// ubicarían el sitio en la India.
export function aPunto(
  latitud: string | null | undefined,
  longitud: string | null | undefined,
): { lat: number; lng: number } | null {
  const lat = aDecimal(latitud);
  let lng = aDecimal(longitud);
  if (lat === null || lng === null) return null;

  // Costa Rica está entre 8 y 11.3 de latitud y entre -86 y -82.5 de
  // longitud. Si la longitud vino positiva dentro de ese rango, es que
  // le falta el signo.
  if (lng > 82 && lng < 86) lng = -lng;

  if (lat < 7 || lat > 12) return null;
  if (lng < -87 || lng > -82) return null;

  return { lat, lng };
}
