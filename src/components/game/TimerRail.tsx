import { cn } from '@/lib/cn';
import { URGENCY_MS } from '@/domain/config';

interface TimerRailProps {
  /** 1 → lleno, 0 → agotado. */
  readonly fraction: number;
  readonly remainingMs: number;
}

/**
 * Riel de tiempo full-bleed arriba de la pregunta. Altura fija y contador
 * siempre visible: el tiempo es la tensión del juego, no un detalle que aparece
 * al final. Se consume de derecha a izquierda animando `transform` (no `width`).
 * En los últimos URGENCY_MS pasa a rojo.
 *
 * Los segundos van siempre en blanco, con sombra para sostener contraste tanto
 * sobre el riel lleno como sobre el fondo ya vacío.
 */
export function TimerRail({ fraction, remainingMs }: TimerRailProps) {
  const urgent = remainingMs <= URGENCY_MS;
  const seconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const label = `${seconds}s`;

  const numberPosition =
    'pointer-events-none absolute inset-y-0 right-[1.6rem] flex items-center text-[1.7rem] font-black tabular-nums';

  return (
    <div
      className="relative h-[2.6rem] w-full bg-brand-pale"
      role="timer"
      aria-label={`Quedan ${seconds} segundos`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            'h-full origin-left transition-[transform,background-color] duration-100 ease-linear',
            urgent ? 'bg-incorrect' : 'bg-brand-cyan',
          )}
          style={{ transform: `scaleX(${fraction})` }}
        />
      </div>

      <span
        aria-hidden="true"
        className={cn(
          numberPosition,
          'text-white [text-shadow:0_0.12rem_0.35rem_rgba(0,47,74,0.55),0_0_0.08rem_rgba(0,47,74,0.75)]',
        )}
      >
        {label}
      </span>
    </div>
  );
}
