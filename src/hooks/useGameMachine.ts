import { useCallback, useMemo, useReducer } from 'react';
import { gameReducer, initialState, type GameState } from '@/domain/gameMachine';
import type { GameQuestion } from '@/domain/types';

/** Acciones ya ligadas al dispatch, para que las pantallas no vean el reducer. */
export interface GameActions {
  start(questions: readonly GameQuestion[]): void;
  answer(optionId: string): void;
  advance(): void;
  timeout(): void;
  reset(): void;
}

/** Envuelve el reducer puro de la partida y expone acciones tipadas. */
export function useGameMachine(): readonly [GameState, GameActions] {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const start = useCallback(
    (questions: readonly GameQuestion[]) => dispatch({ type: 'START', questions }),
    [],
  );
  const answer = useCallback((optionId: string) => dispatch({ type: 'ANSWER', optionId }), []);
  const advance = useCallback(() => dispatch({ type: 'ADVANCE' }), []);
  const timeout = useCallback(() => dispatch({ type: 'TIMEOUT' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  const actions = useMemo<GameActions>(
    () => ({ start, answer, advance, timeout, reset }),
    [start, answer, advance, timeout, reset],
  );

  return [state, actions] as const;
}
