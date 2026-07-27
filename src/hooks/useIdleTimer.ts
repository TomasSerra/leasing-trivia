import { useEffect, useRef } from 'react';

const ACTIVITY_EVENTS = ['pointerdown', 'pointermove', 'keydown', 'touchstart', 'wheel'] as const;

interface IdleTimerOptions {
  /** Milisegundos de inactividad antes de disparar `onIdle`. */
  readonly timeoutMs: number;
  readonly onIdle: () => void;
  /** Cuando es false, el temporizador no corre (ni escucha actividad). */
  readonly enabled?: boolean;
}

/**
 * Dispara `onIdle` tras `timeoutMs` sin actividad del usuario; cualquier toque,
 * movimiento o tecla reinicia la cuenta. Base compartida por el auto-reset de
 * partida (useIdleReset) y la pantalla atractora (useAttractScreen).
 */
export function useIdleTimer({ timeoutMs, onIdle, enabled = true }: IdleTimerOptions): void {
  const onIdleRef = useRef(onIdle);
  onIdleRef.current = onIdle;

  useEffect(() => {
    if (!enabled) return;

    let timer = window.setTimeout(function fire() {
      onIdleRef.current();
    }, timeoutMs);

    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => onIdleRef.current(), timeoutMs);
    };

    for (const evt of ACTIVITY_EVENTS) {
      window.addEventListener(evt, reset, { passive: true, capture: true });
    }

    return () => {
      window.clearTimeout(timer);
      for (const evt of ACTIVITY_EVENTS) {
        window.removeEventListener(evt, reset, { capture: true } as EventListenerOptions);
      }
    };
  }, [timeoutMs, enabled]);
}
