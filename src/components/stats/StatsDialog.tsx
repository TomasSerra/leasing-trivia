import { useState, type ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useStatsRepository } from '@/providers/RepositoryProvider';
import type { DayStat } from '@/data/StatsRepository';
import { formatDayLabel, formatPlays } from './statsFormat';

interface StatsDialogProps {
  /** El disparador (StatsButton) se pasa como trigger. */
  readonly trigger: ReactNode;
}

/**
 * Modal de estadísticas: partidas por día (más nuevo primero) y total. Lee del
 * repositorio al abrir, así refleja la partida recién jugada sin recargar.
 */
export function StatsDialog({ trigger }: StatsDialogProps) {
  const stats = useStatsRepository();
  const [history, setHistory] = useState<DayStat[]>([]);
  const [total, setTotal] = useState(0);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setHistory(stats.history());
      setTotal(stats.total());
    }
  };

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/45 [animation:soft-fade_200ms_var(--ease-out-quart)]" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 flex max-h-[80vh] w-[80vw] max-w-[46rem] -translate-x-1/2 -translate-y-1/2 flex-col gap-[2rem] rounded-[1.6rem] bg-white p-[2.6rem] shadow-[0_2rem_5rem_-1rem_rgba(11,47,74,0.5)] [animation:content-rise_260ms_var(--ease-out-expo)] focus:outline-none"
          aria-describedby={undefined}
        >
          <div className="flex flex-col gap-[0.4rem]">
            <Dialog.Title className="text-[2.4rem] font-black leading-none tracking-[-0.02em] text-ink">
              Estadísticas
            </Dialog.Title>
            <p className="text-[1.4rem] font-normal text-ink-muted">Partidas jugadas por día</p>
          </div>

          {history.length === 0 ? (
            <p className="py-[2rem] text-center text-[1.5rem] font-normal text-ink-muted">
              Todavía no se jugó ninguna partida.
            </p>
          ) : (
            <ul className="flex flex-col gap-[0.4rem] overflow-y-auto">
              {history.map((row) => (
                <li
                  key={row.date}
                  className="flex items-center justify-between border-b border-brand-pale py-[1rem] last:border-b-0"
                >
                  <span className="text-[1.6rem] font-bold text-ink">{formatDayLabel(row.date)}</span>
                  <span className="text-[1.6rem] font-normal tabular-nums text-ink-muted">
                    {formatPlays(row.plays)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center justify-between border-t-2 border-brand-light pt-[1.4rem]">
            <span className="text-[1.6rem] font-black text-ink">Total</span>
            <span className="text-[1.6rem] font-black tabular-nums text-brand-deep">
              {formatPlays(total)}
            </span>
          </div>

          <Dialog.Close asChild>
            <button
              type="button"
              className="mt-[0.4rem] h-[5.2rem] w-full rounded-[1rem] bg-brand-deep text-[1.6rem] font-bold text-white transition-colors duration-200 hover:bg-brand-cyan active:bg-brand-cyan"
            >
              Cerrar estadísticas
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
