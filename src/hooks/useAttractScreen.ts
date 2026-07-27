import { useCallback, useEffect, useRef, useState } from 'react';
import { ATTRACT_AFTER_MS } from '@/domain/config';
import { useIdleTimer } from './useIdleTimer';

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'touchstart'] as const;

/**
 * En el inicio: tras ATTRACT_AFTER_MS de inactividad muestra la pantalla
 * atractora; el primer gesto la oculta. Devuelve si está visible.
 */
export function useAttractScreen(enabled: boolean): boolean {
  const [showing, setShowing] = useState(false);

  const show = useCallback(() => setShowing(true), []);
  useIdleTimer({ timeoutMs: ATTRACT_AFTER_MS, onIdle: show, enabled });

  // Mientras la atractora está visible, el primer gesto la baja.
  const showingRef = useRef(showing);
  showingRef.current = showing;
  useEffect(() => {
    if (!showing) return;
    const handler = () => setShowing(false);
    for (const evt of ACTIVITY_EVENTS) {
      window.addEventListener(evt, handler, { passive: true, capture: true });
    }
    return () => {
      for (const evt of ACTIVITY_EVENTS) {
        window.removeEventListener(evt, handler, { capture: true } as EventListenerOptions);
      }
    };
  }, [showing]);

  return enabled && showing;
}
