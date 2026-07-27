/**
 * Endurecido de kiosco para la TV touch: bloquea zoom (pinch, doble-tap,
 * ctrl+wheel, atajos de teclado), menú contextual, selección y arrastre.
 * Portado del kiosco previo del usuario; sin la excepción de rutas de celular,
 * que acá no existen.
 */
export function installKioskHardening(): void {
  const isEditable = (target: EventTarget | null): boolean => {
    if (!(target instanceof HTMLElement)) return false;
    return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
  };

  // Pinch-zoom iOS.
  (['gesturestart', 'gesturechange', 'gestureend'] as const).forEach((name) => {
    document.addEventListener(name, (e) => e.preventDefault(), { passive: false });
  });

  // Ctrl/trackpad wheel zoom.
  document.addEventListener(
    'wheel',
    (e) => {
      if (e.ctrlKey) e.preventDefault();
    },
    { passive: false },
  );

  // Atajos de teclado de zoom.
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && ['=', '+', '-', '0'].includes(e.key)) e.preventDefault();
  });

  // Doble-tap zoom (Safari): descarta el 2º touchend dentro de 300ms.
  let lastTouchEnd = 0;
  document.addEventListener(
    'touchend',
    (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) e.preventDefault();
      lastTouchEnd = now;
    },
    { passive: false },
  );

  // Pinch multi-touch en navegadores que ignoran user-scalable=no.
  document.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length > 1) e.preventDefault();
    },
    { passive: false },
  );

  // Menú contextual (click derecho / algunos long-press).
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // Selección de texto (salvo en campos editables).
  document.addEventListener('selectstart', (e) => {
    if (!isEditable(e.target)) e.preventDefault();
  });

  // Arrastre de imágenes / texto.
  document.addEventListener('dragstart', (e) => e.preventDefault());
}
