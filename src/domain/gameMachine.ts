/**
 * Máquina de estados pura de la partida: home → playing → result.
 * No importa React; es un reducer testeable. El tiempo (countdown) y el timing
 * del reveal viven en hooks que despachan TIMEOUT y ADVANCE.
 */
import type { AnsweredQuestion, GameOutcome, GameQuestion } from './types';
import { isAnswerCorrect, resolveOutcome } from './quiz';

/** Fase dentro de una pregunta: eligiendo vs. mostrando el resultado. */
export type PlayPhase = 'answering' | 'revealing';

export type GameState =
  | { readonly status: 'home' }
  | {
      readonly status: 'playing';
      readonly questions: readonly GameQuestion[];
      readonly index: number;
      readonly answers: readonly AnsweredQuestion[];
      readonly phase: PlayPhase;
      /** opción tocada en la pregunta actual (solo durante 'revealing'). */
      readonly selectedOptionId: string | null;
    }
  | {
      readonly status: 'result';
      readonly outcome: GameOutcome;
      readonly questions: readonly GameQuestion[];
      readonly answers: readonly AnsweredQuestion[];
    };

export type GameAction =
  | { readonly type: 'START'; readonly questions: readonly GameQuestion[] }
  | { readonly type: 'ANSWER'; readonly optionId: string }
  | { readonly type: 'ADVANCE' }
  | { readonly type: 'TIMEOUT' }
  | { readonly type: 'RESET' };

export const initialState: GameState = { status: 'home' };

function toResult(
  questions: readonly GameQuestion[],
  answers: readonly AnsweredQuestion[],
  timedOut: boolean,
): GameState {
  return {
    status: 'result',
    outcome: resolveOutcome(answers, questions.length, timedOut),
    questions,
    answers,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START':
      if (action.questions.length === 0) return state;
      return {
        status: 'playing',
        questions: action.questions,
        index: 0,
        answers: [],
        phase: 'answering',
        selectedOptionId: null,
      };

    case 'ANSWER': {
      if (state.status !== 'playing' || state.phase !== 'answering') return state;
      const question = state.questions[state.index];
      if (!question) return state;
      const wasCorrect = isAnswerCorrect(question, action.optionId);
      const answered: AnsweredQuestion = {
        question,
        selectedOptionId: action.optionId,
        wasCorrect,
      };
      return {
        ...state,
        phase: 'revealing',
        selectedOptionId: action.optionId,
        answers: [...state.answers, answered],
      };
    }

    case 'ADVANCE': {
      if (state.status !== 'playing' || state.phase !== 'revealing') return state;
      const isLast = state.index + 1 >= state.questions.length;
      if (isLast) return toResult(state.questions, state.answers, false);
      return {
        ...state,
        index: state.index + 1,
        phase: 'answering',
        selectedOptionId: null,
      };
    }

    case 'TIMEOUT': {
      // El reloj está pausado durante el reveal, así que un TIMEOUT solo llega
      // mientras se está eligiendo. Se registra la pregunta actual como no
      // respondida y se cierra la partida por tiempo.
      if (state.status !== 'playing' || state.phase !== 'answering') return state;
      const question = state.questions[state.index];
      const answers = question
        ? [
            ...state.answers,
            { question, selectedOptionId: null, wasCorrect: false } satisfies AnsweredQuestion,
          ]
        : state.answers;
      return toResult(state.questions, answers, true);
    }

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}
