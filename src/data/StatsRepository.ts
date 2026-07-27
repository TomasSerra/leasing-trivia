/** Una fila del historial: un día y cuántas partidas se jugaron. */
export interface DayStat {
  /** 'YYYY-MM-DD' en hora local de Argentina. */
  readonly date: string;
  readonly plays: number;
}

/**
 * Persistencia del contador de partidas por día. La UI depende de esta
 * interfaz; hoy es localStorage, mañana podría ser un backend sin tocar la UI.
 */
export interface StatsRepository {
  /** Registra que arrancó una partida (cuenta para el día de hoy). */
  recordPlay(): void;
  /** Historial completo, de más nuevo a más viejo. */
  history(): DayStat[];
  /** Total acumulado de partidas. */
  total(): number;
}
