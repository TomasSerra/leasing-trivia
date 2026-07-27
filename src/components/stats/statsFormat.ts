import { STATS_TIME_ZONE } from '@/domain/config';

/** 'YYYY-MM-DD' de hoy/ayer en hora AR, para etiquetar el historial. */
function localISO(offsetDays: number): string {
  const now = new Date();
  now.setDate(now.getDate() + offsetDays);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: STATS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/** Convierte 'YYYY-MM-DD' en una etiqueta legible: Hoy / Ayer / DD/MM/AAAA. */
export function formatDayLabel(iso: string): string {
  if (iso === localISO(0)) return 'Hoy';
  if (iso === localISO(-1)) return 'Ayer';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/** "1 partida" / "N partidas". */
export function formatPlays(n: number): string {
  return `${n} ${n === 1 ? 'partida' : 'partidas'}`;
}
