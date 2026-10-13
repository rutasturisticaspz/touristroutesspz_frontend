// Coordinate conversion.
// In the database latitude and longitude are free text, and two
// formats coexist: decimal ("9.3612") and degrees/minutes/seconds
// ("9°25'25.6\"N"). The previous site never used them to draw a map,
// so nobody normalized them. Here both are accepted.

// Decimal degrees from the saved text, or null if it is not understood.
export function aDecimal(valor: string | null | undefined): number | null {
  if (!valor) return null;
  const texto = valor.trim();
  if (texto === '') return null;

  // Decimal format, with a dot or a comma and a possible hemisphere
  // letter.
  const decimal = texto.match(/^(-?\d+(?:[.,]\d+)?)\s*([NSEWOnsewo])?$/);
  if (decimal) {
    const numero = Number(decimal[1].replace(',', '.'));
    if (!Number.isFinite(numero)) return null;
    return aplicarRumbo(numero, decimal[2]);
  }

  // Degrees/minutes/seconds format: 9°25'25.6"N
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

// S and W (or O, for Oeste) are negative.
function aplicarRumbo(numero: number, rumbo?: string): number {
  if (!rumbo) return numero;
  const letra = rumbo.toUpperCase();
  const negativo = letra === 'S' || letra === 'W' || letra === 'O';
  return negativo ? -Math.abs(numero) : Math.abs(numero);
}

// Point ready for the map, or null if either coordinate is missing or
// not understood. Those that fall outside Costa Rica are discarded:
// in the database there are rows with the longitude missing its
// negative sign, which would place the site in India.
export function aPunto(
  latitud: string | null | undefined,
  longitud: string | null | undefined,
): { lat: number; lng: number } | null {
  const lat = aDecimal(latitud);
  let lng = aDecimal(longitud);
  if (lat === null || lng === null) return null;

  // Costa Rica lies between 8 and 11.3 latitude and between -86 and
  // -82.5 longitude. If the longitude came positive within that range,
  // it is missing the sign.
  if (lng > 82 && lng < 86) lng = -lng;

  if (lat < 7 || lat > 12) return null;
  if (lng < -87 || lng > -82) return null;

  return { lat, lng };
}
