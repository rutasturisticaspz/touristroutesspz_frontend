// What counts as "new": created within the last month (30 days) in the
// system. After that the ribbon and the menu badge go away on their own.
// The same number goes to the backend (?nuevos=) so the lists put those
// first.
export const DIAS_COMO_NUEVO = 30;

const MS_POR_DIA = 24 * 60 * 60 * 1000;

export function esNuevo(creadoEn: string | null | undefined): boolean {
  if (!creadoEn) return false;
  const creado = Date.parse(creadoEn);
  return Number.isFinite(creado) && Date.now() - creado < DIAS_COMO_NUEVO * MS_POR_DIA;
}
