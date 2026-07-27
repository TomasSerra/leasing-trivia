import { useEffect, useState } from 'react';
import type { GameQuestion, TileState } from '@/domain/types';
import type { PlayPhase } from '@/domain/gameMachine';
import {
  ACKNOWLEDGE_MS,
  GAME_DURATION_MS,
  REVEAL_INCORRECT_EXTRA_MS,
  REVEAL_MS,
} from '@/domain/config';
import { useCountdown } from '@/hooks/useCountdown';
import { BrandField } from '@/components/kiosk/BrandField';
import { TimerRail } from '@/components/game/TimerRail';
import { ProgressPips } from '@/components/game/ProgressPips';
import { QuestionPrompt } from '@/components/game/QuestionPrompt';
import { AnswerTile } from '@/components/game/AnswerTile';

interface QuestionScreenProps {
  readonly questions: readonly GameQuestion[];
  readonly index: number;
  readonly phase: PlayPhase;
  readonly selectedOptionId: string | null;
  readonly answeredCorrect: readonly boolean[];
  readonly onAnswer: (optionId: string) => void;
  readonly onAdvance: () => void;
  readonly onTimeout: () => void;
}

/**
 * Pantalla de pregunta (mundo claro). Dueña del timer global (se pausa durante
 * el reveal) y del ritmo del reveal → avance. El estado de partida vive en el
 * reducer; acá sólo se traduce a estados de tile y a timing.
 */
export function QuestionScreen({
  questions,
  index,
  phase,
  selectedOptionId,
  answeredCorrect,
  onAnswer,
  onAdvance,
  onTimeout,
}: QuestionScreenProps) {
  const question = questions[index];

  // Acuse local al tocar: la opción "late" ACKNOWLEDGE_MS antes de revelar.
  const [pendingId, setPendingId] = useState<string | null>(null);

  const isRevealing = phase === 'revealing';
  const isBusy = isRevealing || pendingId !== null;

  const { remainingMs, fraction } = useCountdown({
    durationMs: GAME_DURATION_MS,
    running: true,
    paused: isBusy,
    onExpire: onTimeout,
  });

  // Toque → acuse → confirmar respuesta.
  useEffect(() => {
    if (pendingId === null) return;
    const t = window.setTimeout(() => {
      onAnswer(pendingId);
      setPendingId(null);
    }, ACKNOWLEDGE_MS);
    return () => window.clearTimeout(t);
  }, [pendingId, onAnswer]);

  // Reveal → avanzar. Errar da un segundo extra para leer la correcta.
  const answeredWrong =
    isRevealing &&
    selectedOptionId !== null &&
    question?.options.find((o) => o.id === selectedOptionId)?.isCorrect === false;

  useEffect(() => {
    if (!isRevealing) return;
    const delay = answeredWrong ? REVEAL_MS + REVEAL_INCORRECT_EXTRA_MS : REVEAL_MS;
    const t = window.setTimeout(onAdvance, delay);
    return () => window.clearTimeout(t);
  }, [isRevealing, answeredWrong, index, onAdvance]);

  if (!question) return null;

  const tileState = (optionId: string, isCorrect: boolean): TileState => {
    if (!isRevealing) return pendingId === optionId ? 'selected' : 'idle';
    if (optionId === selectedOptionId) return isCorrect ? 'correct' : 'incorrect';
    return isCorrect ? 'reveal-correct' : 'idle';
  };

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-surface">
      <TimerRail fraction={fraction} remainingMs={remainingMs} />
      <BrandField />

      <div className="relative z-10 flex items-center justify-between px-[3.2rem] pt-[2.8rem]">
        <ProgressPips
          total={questions.length}
          currentIndex={index}
          answeredCorrect={answeredCorrect}
        />
        <span className="text-[1.6rem] font-bold text-ink-muted">
          {index + 1} / {questions.length}
        </span>
      </div>

      {/* key por índice: reinicia la entrada del contenido en cada pregunta. */}
      <main
        key={index}
        className="relative z-10 flex flex-1 flex-col justify-center gap-[3.4rem] px-[3.2rem] pb-[5vh] [animation:content-rise_360ms_var(--ease-out-expo)]"
      >
        <QuestionPrompt prompt={question.prompt} />
        <div className="flex flex-col gap-[1.2rem]">
          {question.options.map((option) => (
            <AnswerTile
              key={option.id}
              letter={option.letter}
              text={option.text}
              state={tileState(option.id, option.isCorrect)}
              disabled={isBusy}
              onSelect={() => setPendingId(option.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
