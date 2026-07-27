/**
 * Tipos del dominio de la trivia. Sin dependencias de React ni del navegador,
 * así la lógica de juego es testeable en aislamiento.
 */

/** Una opción tal como vive en el JSON de preguntas. */
export interface RawOption {
  readonly id: string;
  readonly text: string;
}

/** Pregunta tal como vive en el JSON estático. */
export interface RawQuestion {
  readonly id: number;
  readonly prompt: string;
  readonly options: readonly RawOption[];
  /** id de la opción correcta. */
  readonly correctOptionId: string;
}

/** Opción ya lista para render: sabe si es la correcta y su letra visible. */
export interface AnswerOption {
  readonly id: string;
  readonly text: string;
  /** 'A' | 'B' | 'C' — asignada después de barajar. */
  readonly letter: string;
  readonly isCorrect: boolean;
}

/** Pregunta preparada para una partida: opciones barajadas y letradas. */
export interface GameQuestion {
  readonly id: number;
  readonly prompt: string;
  readonly options: readonly AnswerOption[];
}

/** Registro de lo que el jugador respondió en una pregunta. */
export interface AnsweredQuestion {
  readonly question: GameQuestion;
  /** id de la opción elegida, o null si se agotó el tiempo sin responder. */
  readonly selectedOptionId: string | null;
  readonly wasCorrect: boolean;
}

/** Por qué terminó la partida. */
export type GameOutcome = 'won' | 'lost-mistake' | 'lost-timeout';

/** Estado visual de una opción en pantalla. */
export type TileState =
  | 'idle'
  | 'selected'
  | 'correct'
  | 'incorrect'
  | 'reveal-correct';
