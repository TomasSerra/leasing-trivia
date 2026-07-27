import { cn } from '@/lib/cn';
import type { TileState } from '@/domain/types';
import { CheckIcon, CrossIcon } from './icons';

interface AnswerTileProps {
  readonly letter: string;
  readonly text: string;
  readonly state: TileState;
  readonly disabled: boolean;
  readonly onSelect: () => void;
}

/**
 * Una opción de respuesta. No sabe nada de la partida ni del timer (ISP): sólo
 * dibuja su letra, su texto y su estado, y avisa cuando la tocan.
 * El feedback nunca depende sólo del color: correcta lleva check, incorrecta X.
 */
export function AnswerTile({ letter, text, state, disabled, onSelect }: AnswerTileProps) {
  const isCorrect = state === 'correct' || state === 'reveal-correct';
  const isIncorrect = state === 'incorrect';

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-label={`Opción ${letter}: ${text}`}
      className={cn(
        'group relative flex min-h-[13vh] w-full items-center gap-[1.1rem] rounded-[1.1rem] border-2 px-[1.4rem] py-[1.1rem] text-left transition-[background-color,border-color,transform,box-shadow] duration-200 ease-[var(--ease-out-quart)]',
        // idle
        state === 'idle' &&
          'border-brand-light bg-white text-ink shadow-[0_0.4rem_1.2rem_-0.6rem_rgba(11,47,74,0.25)] active:scale-[0.99]',
        // acuse al tocar
        state === 'selected' && 'scale-[0.99] border-brand-deep bg-brand-pale text-ink',
        // correcta elegida
        state === 'correct' && 'border-correct bg-correct text-white shadow-none',
        // incorrecta elegida
        state === 'incorrect' && 'border-incorrect bg-incorrect text-white shadow-none',
        // la correcta, revelada cuando el jugador erró
        state === 'reveal-correct' && 'border-correct bg-white text-correct shadow-none',
      )}
    >
      <span
        className={cn(
          'flex h-[3.2rem] w-[3.2rem] shrink-0 items-center justify-center rounded-full text-[1.7rem] font-black leading-none transition-colors duration-200',
          state === 'idle' && 'bg-brand-pale text-brand-deep',
          state === 'selected' && 'bg-brand-deep text-white',
          isCorrect && 'bg-correct text-white',
          isIncorrect && 'bg-white text-incorrect',
        )}
        aria-hidden="true"
      >
        {isCorrect ? (
          <CheckIcon className="h-[1.8rem] w-[1.8rem]" />
        ) : isIncorrect ? (
          <CrossIcon className="h-[1.8rem] w-[1.8rem]" />
        ) : (
          letter
        )}
      </span>

      <span className="text-[1.7rem] font-bold leading-[1.15]">{text}</span>
    </button>
  );
}
