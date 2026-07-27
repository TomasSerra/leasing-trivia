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
 * Los segundos se dibujan dos veces, una en cada tinta, y la copia clara se
 * recorta a la zona rellena con `clip-path`. Así el número siempre contrasta,
 * tanto cuando el riel está lleno como cuando ya se vació por detrás.
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

      {/* Sobre el riel ya vacío. */}
      <span
        aria-hidden="true"
        className={cn(numberPosition, urgent ? 'text-incorrect' : 'text-brand-deep')}
      >
        {label}
      </span>
      {/* Misma cifra recortada a la parte todavía llena. */}
      <span
        aria-hidden="true"
        className={cn(numberPosition, 'text-white transition-[clip-path] duration-100 ease-linear')}
        style={{ clipPath: `inset(0 ${(1 - fraction) * 100}% 0 0)` }}
      >
        {label}
      </span>
    </div>
  );
}
