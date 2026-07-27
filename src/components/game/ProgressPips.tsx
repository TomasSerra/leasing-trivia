import { cn } from '@/lib/cn';

interface ProgressPipsProps {
  readonly total: number;
  /** Índice de la pregunta actual (0-based). */
  readonly currentIndex: number;
  /** Aciertos hasta ahora, para colorear las ya respondidas. */
  readonly answeredCorrect: readonly boolean[];
}

/**
 * Indicador de avance: una marca por pregunta. Las respondidas muestran su
 * resultado (verde/rojo), la actual está resaltada, las futuras atenuadas.
 */
export function ProgressPips({ total, currentIndex, answeredCorrect }: ProgressPipsProps) {
  return (
    <div className="flex items-center gap-[0.6rem]" aria-label={`Pregunta ${currentIndex + 1} de ${total}`}>
      {Array.from({ length: total }, (_, i) => {
        const answered = i < answeredCorrect.length;
        const isCurrent = i === currentIndex;
        return (
          <span
            key={i}
            className={cn(
              'h-[0.7rem] rounded-full transition-all duration-300 ease-[var(--ease-out-quart)]',
              isCurrent ? 'w-[2.6rem]' : 'w-[0.7rem]',
              answered && answeredCorrect[i] && 'bg-correct',
              answered && !answeredCorrect[i] && 'bg-incorrect',
              !answered && isCurrent && 'bg-brand-deep',
              !answered && !isCurrent && 'bg-brand-light',
            )}
          />
        );
      })}
    </div>
  );
}
