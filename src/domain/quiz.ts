/**
 * Lógica pura de la trivia: barajado, selección de preguntas, preparación de
 * opciones y condición de victoria. Nada de React ni de estado global.
 */
import type {
  AnsweredQuestion,
  AnswerOption,
  GameQuestion,
  GameOutcome,
  RawQuestion,
} from './types';
import { QUESTIONS_PER_GAME } from './config';

const LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;

/**
 * Fisher-Yates. Devuelve un array nuevo; no muta el de entrada.
 * `rng` inyectable para poder testear con una secuencia determinística.
 */
export function shuffle<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = out[i]!;
    out[i] = out[j]!;
    out[j] = tmp;
  }
  return out;
}

/**
 * Prepara una pregunta cruda para jugar: baraja las opciones y les asigna
 * letra según la posición barajada. Barajar es obligatorio: en el set original
 * la correcta es la A en 18 de 20, y sin barajar la trivia se aprende de memoria.
 */
export function prepareQuestion(raw: RawQuestion, rng: () => number = Math.random): GameQuestion {
  const shuffled = shuffle(raw.options, rng);
  const options: AnswerOption[] = shuffled.map((opt, index) => ({
    id: opt.id,
    text: opt.text,
    letter: LETTERS[index] ?? String(index + 1),
    isCorrect: opt.id === raw.correctOptionId,
  }));
  return { id: raw.id, prompt: raw.prompt, options };
}

/**
 * Elige `count` preguntas para una partida, despriorizando las de partidas
 * recientes (por id) para que dos visitantes seguidos no vean lo mismo, y
 * prepara cada una (opciones barajadas).
 */
export function pickQuestions(
  pool: readonly RawQuestion[],
  recentIds: readonly number[],
  count: number = QUESTIONS_PER_GAME,
  rng: () => number = Math.random,
): GameQuestion[] {
  const recent = new Set(recentIds);
  const fresh = pool.filter((q) => !recent.has(q.id));
  const stale = pool.filter((q) => recent.has(q.id));

  // Primero las frescas barajadas; si no alcanzan, se completa con las viejas.
  const ordered = [...shuffle(fresh, rng), ...shuffle(stale, rng)];
  return ordered.slice(0, count).map((q) => prepareQuestion(q, rng));
}

/** ¿La opción elegida es la correcta de esta pregunta? */
export function isAnswerCorrect(question: GameQuestion, selectedOptionId: string | null): boolean {
  if (selectedOptionId === null) return false;
  return question.options.some((o) => o.id === selectedOptionId && o.isCorrect);
}

/** Se gana solo con todas correctas. */
export function isWin(answers: readonly AnsweredQuestion[], total: number): boolean {
  return answers.length === total && answers.every((a) => a.wasCorrect);
}

/** Determina el desenlace a partir de las respuestas y si se agotó el tiempo. */
export function resolveOutcome(
  answers: readonly AnsweredQuestion[],
  total: number,
  timedOut: boolean,
): GameOutcome {
  if (isWin(answers, total)) return 'won';
  return timedOut ? 'lost-timeout' : 'lost-mistake';
}

/** Cantidad de aciertos, para el repaso final. */
export function countCorrect(answers: readonly AnsweredQuestion[]): number {
  return answers.reduce((n, a) => (a.wasCorrect ? n + 1 : n), 0);
}
