import { useCallback } from 'react';
import { RepositoryProvider, useQuestionRepository, useStatsRepository } from '@/providers/RepositoryProvider';
import { useGameMachine } from '@/hooks/useGameMachine';
import { useIdleReset } from '@/hooks/useIdleReset';
import { useAttractScreen } from '@/hooks/useAttractScreen';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { QuestionScreen } from '@/components/screens/QuestionScreen';
import { ResultScreen } from '@/components/screens/ResultScreen';
import { AttractScreen } from '@/components/kiosk/AttractScreen';

/** Orquesta repositorios + máquina de estados + comportamiento de kiosco. */
function Game() {
  const questionRepo = useQuestionRepository();
  const statsRepo = useStatsRepository();
  const [state, actions] = useGameMachine();

  // Cuenta la partida al arrancar (así abandonar a mitad igual suma) y reparte
  // preguntas nuevas.
  const startGame = useCallback(() => {
    statsRepo.recordPlay();
    actions.start(questionRepo.nextGame());
  }, [statsRepo, questionRepo, actions]);

  // Auto-reset: durante una partida, la inactividad vuelve al inicio.
  useIdleReset(state.status === 'playing', actions.reset);

  // Pantalla atractora: sólo en el inicio.
  const showAttract = useAttractScreen(state.status === 'home');

  return (
    <>
      {state.status === 'home' && <HomeScreen onStart={startGame} />}

      {state.status === 'playing' && (
        <QuestionScreen
          questions={state.questions}
          index={state.index}
          phase={state.phase}
          selectedOptionId={state.selectedOptionId}
          answeredCorrect={state.answers.map((a) => a.wasCorrect)}
          onAnswer={actions.answer}
          onAdvance={actions.advance}
          onTimeout={actions.timeout}
        />
      )}

      {state.status === 'result' && (
        <ResultScreen
          outcome={state.outcome}
          answers={state.answers}
          onPlayAgain={startGame}
          onHome={actions.reset}
        />
      )}

      {showAttract && <AttractScreen />}
    </>
  );
}

export function App() {
  return (
    <RepositoryProvider>
      <Game />
    </RepositoryProvider>
  );
}
