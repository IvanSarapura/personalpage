const SMOOTH_SCROLL_DURATION_MS = 450;

let cancelActiveScroll: (() => void) | undefined;

function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function easeInOutSine(progress: number): number {
  return -(Math.cos(Math.PI * progress) - 1) / 2;
}

/**
 * Desplaza la ventana con una duración predecible y una curva suave.
 * Una nueva navegación o una interacción directa del usuario cancela la
 * animación en curso para no competir con el control de desplazamiento nativo.
 */
export function smoothScrollTo(top: number): void {
  const target = Math.max(0, top);

  cancelActiveScroll?.();

  if (prefersReducedMotion()) {
    window.scrollTo({ top: target, behavior: "auto" });
    return;
  }

  const start = window.scrollY;
  const distance = target - start;

  if (Math.abs(distance) < 1) {
    window.scrollTo(0, target);
    return;
  }

  const startedAt = performance.now();
  let frameId = 0;

  const interactionEvents: Array<keyof WindowEventMap> = [
    "wheel",
    "touchstart",
    "pointerdown",
    "keydown",
  ];

  const removeInteractionListeners = () => {
    for (const eventName of interactionEvents) {
      window.removeEventListener(eventName, cancel);
    }
  };

  const cancel = () => {
    window.cancelAnimationFrame(frameId);
    removeInteractionListeners();

    if (cancelActiveScroll === cancel) {
      cancelActiveScroll = undefined;
    }
  };

  const step = (now: number) => {
    const progress = Math.min((now - startedAt) / SMOOTH_SCROLL_DURATION_MS, 1);
    window.scrollTo(0, Math.round(start + distance * easeInOutSine(progress)));

    if (progress < 1) {
      frameId = window.requestAnimationFrame(step);
      return;
    }

    cancel();
  };

  for (const eventName of interactionEvents) {
    window.addEventListener(eventName, cancel, { passive: true });
  }

  cancelActiveScroll = cancel;
  frameId = window.requestAnimationFrame(step);
}
