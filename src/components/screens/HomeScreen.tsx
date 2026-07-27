import { Logo } from '@/components/brand/Logo';
import { BrandField } from '@/components/kiosk/BrandField';
import { StatsButton } from '@/components/stats/StatsButton';
import { StatsDialog } from '@/components/stats/StatsDialog';
import { QUESTIONS_PER_GAME, GAME_DURATION_MS } from '@/domain/config';

interface HomeScreenProps {
  readonly onStart: () => void;
}

/** Pantalla de inicio (mundo claro): marca, reglas en una línea y CTA de juego. */
export function HomeScreen({ onStart }: HomeScreenProps) {
  const seconds = Math.round(GAME_DURATION_MS / 1000);

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-surface">
      <BrandField />

      <header className="relative z-10 flex items-start px-[3.2rem] pt-[3.2rem]">
        <Logo className="h-[5.6rem]" />
      </header>

      {/* Fuera del flujo: es una zona invisible para el operador, no parte de
          la composición visible del inicio. */}
      <StatsDialog trigger={<StatsButton />} />

      <main className="relative z-10 flex flex-1 flex-col items-start justify-center gap-[3.2rem] px-[3.2rem] pb-[6vh]">
        <div className="flex flex-col gap-[1.6rem]">
          <p className="text-[1.9rem] font-bold uppercase tracking-[0.08em] text-brand-cyan">
            Trivia
          </p>
          <h1 className="text-balance text-[5.4rem] font-black leading-[0.98] tracking-[-0.03em] text-ink">
            ¿Cuánto sabés
            <br />
            de leasing?
          </h1>
          <p className="max-w-[34ch] text-[2rem] font-normal leading-[1.35] text-ink-muted">
            {QUESTIONS_PER_GAME} preguntas para responder en {seconds} segundos. Acertá las tres y
            ganás.
          </p>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="flex h-[8.4rem] items-center justify-center rounded-[1.4rem] bg-brand-deep px-[5rem] text-[2.6rem] font-black text-white shadow-[0_1.2rem_2.6rem_-0.8rem_rgba(0,92,156,0.7)] transition-[transform,background-color] duration-200 ease-[var(--ease-out-quart)] hover:bg-brand-cyan active:scale-[0.98] active:bg-brand-cyan"
        >
          Jugar ahora
        </button>
      </main>
    </div>
  );
}
