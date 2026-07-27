import { STATS_TIME_ZONE } from '@/domain/config';
import type { DayStat, StatsRepository } from './StatsRepository';

const STORAGE_KEY = 'leasing-trivia:stats:v1';

/** Mapa persistido: fecha local 'YYYY-MM-DD' → cantidad de partidas. */
type StatsMap = Record<string, number>;

/**
 * Fecha de hoy en hora de Argentina, no en UTC: sin esto, todo lo jugado
 * después de las 21h caería en el día siguiente. `en-CA` da formato ISO
 * 'YYYY-MM-DD' directamente.
 */
function todayInArgentina(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: STATS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/** Implementación sobre localStorage. Tolera storage no disponible o corrupto. */
export class LocalStatsRepository implements StatsRepository {
  constructor(private readonly storage: Storage = window.localStorage) {}

  recordPlay(): void {
    const map = this.read();
    const today = todayInArgentina();
    map[today] = (map[today] ?? 0) + 1;
    this.write(map);
  }

  history(): DayStat[] {
    const map = this.read();
    return Object.entries(map)
      .map(([date, plays]) => ({ date, plays }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  total(): number {
    return Object.values(this.read()).reduce((sum, n) => sum + n, 0);
  }

  private read(): StatsMap {
    try {
      const raw = this.storage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed !== 'object' || parsed === null) return {};
      // Filtra a pares fecha→número, descartando cualquier basura.
      const out: StatsMap = {};
      for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
        if (typeof value === 'number' && Number.isFinite(value)) out[key] = value;
      }
      return out;
    } catch {
      return {};
    }
  }

  private write(map: StatsMap): void {
    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch {
      // Storage lleno o deshabilitado: el juego sigue, solo no persiste.
    }
  }
}
