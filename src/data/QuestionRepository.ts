import type { GameQuestion } from '@/domain/types';

/**
 * Fuente de preguntas para una partida. Las pantallas dependen de esta
 * interfaz, no de una implementación concreta (DIP): mover las preguntas a una
 * API sólo requiere otra implementación, sin tocar la UI.
 */
export interface QuestionRepository {
  /** Devuelve las preguntas de una nueva partida, ya barajadas y letradas. */
  nextGame(): GameQuestion[];
}
