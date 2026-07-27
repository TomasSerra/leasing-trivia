import { useEffect, useRef, useState } from 'react';

interface CountdownOptions {
  readonly durationMs: number;
  /** El reloj corre sólo si está activo… */
  readonly running: boolean;
  /** …y no pausado (se pausa durante el reveal, así 40s son 40s de pensar). */
  readonly paused: boolean;
  readonly onExpire: () => void;
}

interface CountdownState {
  readonly remainingMs: number;
  /** 1 → lleno, 0 → agotado. Para el riel del timer. */
  readonly fraction: number;
}

/**
 * Cuenta regresiva basada en un deadline, con pausa. Congela el tiempo restante
 * al pausar y recalcula el deadline al reanudar, sin acumular deriva.
 * Se resetea al cambiar `durationMs` (o por remount con key de partida).
 */
export function useCountdown({
  durationMs,
  running,
  paused,
  onExpire,
}: CountdownOptions): CountdownState {
  const [remainingMs, setRemainingMs] = useState(durationMs);
  const remainingRef = useRef(durationMs);
  const deadlineRef = useRef(0);
  const expiredRef = useRef(false);

  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  // Reset al (re)definir la duración: nueva partida.
  useEffect(() => {
    remainingRef.current = durationMs;
    setRemainingMs(durationMs);
    expiredRef.current = false;
  }, [durationMs]);

  useEffect(() => {
    if (!running || paused || expiredRef.current) return;

    deadlineRef.current = performance.now() + remainingRef.current;
    const id = window.setInterval(() => {
      const rem = deadlineRef.current - performance.now();
      if (rem <= 0) {
        remainingRef.current = 0;
        setRemainingMs(0);
        window.clearInterval(id);
        if (!expiredRef.current) {
          expiredRef.current = true;
          onExpireRef.current();
        }
      } else {
        remainingRef.current = rem;
        setRemainingMs(rem);
      }
    }, 100);

    return () => window.clearInterval(id);
  }, [running, paused]);

  return {
    remainingMs,
    fraction: durationMs > 0 ? Math.max(0, Math.min(1, remainingMs / durationMs)) : 0,
  };
}
