import { cn } from '@/lib/cn';
import type { AnsweredQuestion, GameOutcome } from '@/domain/types';
import { countCorrect } from '@/domain/quiz';
import { Iso } from '@/components/brand/Iso';
import { BrandField } from '@/components/kiosk/BrandField';
import { AnswerReview } from '@/components/game/AnswerReview';

interface ResultScreenProps {
  readonly outcome: GameOutcome;
  readonly answers: readonly AnsweredQuestion[];
  readonly onPlayAgain: () => void;
  readonly onHome: () => void;
}

const COPY: Record<GameOutcome, { title: string; subtitle: string }> = {
  won: { title: '¡Ganaste!', subtitle: 'Respondiste las tres preguntas correctamente.' },
  'lost-mistake': { title: '¡Casi!', subtitle: 'Para ganar necesitás las tres respuestas correctas.' },
  'lost-timeout': { title: '¡Se acabó el tiempo!', subtitle: 'Hay que responder las tres antes de que termine.' },
};

/**
 * Pantalla de resultado (mundo pleno). Drench de color según el desenlace, con
 * un wipe vertical al entrar. Cierra con el repaso didáctico de las 3 respuestas.
 */
export function ResultScreen({ outcome, answers, onPlayAgain, onHome }: ResultScreenProps) {
  const won = outcome === 'won';
  const correct = countCorrect(answers);
  const { title, subtitle } = COPY[outcome];

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      {/* Capa de color con wipe vertical: el momento memorable entre mundos. */}
      <div
        className={cn(
          'absolute inset-0 [animation:world-wipe_520ms_var(--ease-out-expo)]',
          won ? 'bg-teal-deep' : 'bg-brand-deep',
        )}
      />
      <BrandField tone="white" />

      <div className="relative z-10 flex h-full flex-col px-[3.2rem] py-[3.6rem] [animation:content-rise_460ms_var(--ease-out-expo)_120ms_both]">
        <Iso tone="solid" className="h-[4.4rem] w-[4.4rem] text-white" label="Leasing Argentina" />

        <div className="mt-[4vh] flex flex-col gap-[1.2rem]">
          <p className="text-[1.8rem] font-bold uppercase tracking-[0.1em] text-white/80">
            {correct} de {answers.length} correctas
          </p>
          <h1 className="text-balance text-[5.6rem] font-black leading-[0.95] tracking-[-0.03em] text-white">
            {title}
          </h1>
          <p className="max-w-[32ch] text-[2rem] font-normal leading-[1.3] text-white/85">
            {subtitle}
          </p>
        </div>

        <div className="mt-[3.4vh] flex-1 overflow-y-auto">
          <AnswerReview answers={answers} />
        </div>

        <div className="mt-[2.4rem] flex flex-col gap-[1.2rem]">
          <button
            type="button"
            onClick={onPlayAgain}
            className={cn(
              'h-[8rem] w-full rounded-[1.4rem] bg-white text-[2.4rem] font-black transition-transform duration-200 ease-[var(--ease-out-quart)] active:scale-[0.98]',
              won ? 'text-teal-deep' : 'text-brand-deep',
            )}
          >
            Jugar de nuevo
          </button>
          <button
            type="button"
            onClick={onHome}
            className="h-[6rem] w-full rounded-[1.2rem] border-2 border-white/45 text-[1.8rem] font-bold text-white transition-colors duration-200 hover:border-white active:border-white"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
