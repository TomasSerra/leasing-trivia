import { IDLE_RESET_MS } from '@/domain/config';
import { useIdleTimer } from './useIdleTimer';

/**
 * Durante una partida: si nadie toca por IDLE_RESET_MS, vuelve al inicio, así el
 * próximo visitante no hereda una partida a medias.
 */
export function useIdleReset(enabled: boolean, onReset: () => void): void {
  useIdleTimer({ timeoutMs: IDLE_RESET_MS, onIdle: onReset, enabled });
}
