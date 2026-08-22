"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Hook que bloquea el scroll del body mientras está activo.
 * Preserva la posición del scroll para evitar saltos al desbloquear.
 *
 * @param locked - Si `true`, bloquea el scroll
 * @returns Una función para omitir la restauración de posición al cerrar por navegación.
 */
export function useLockBodyScroll(locked: boolean) {
  const shouldRestoreScrollRef = useRef(true);

  const skipScrollRestoration = useCallback(() => {
    shouldRestoreScrollRef.current = false;
  }, []);

  useEffect(() => {
    if (!locked) return;

    shouldRestoreScrollRef.current = true;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollY = window.scrollY;

    const scrollBarCompensation = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";

    if (scrollBarCompensation > 0) {
      document.body.style.paddingRight = `${scrollBarCompensation}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      // Un cierre manual vuelve al punto previo; una navegación deja que la
      // ruta destino establezca su propia posición antes del primer paint.
      if (shouldRestoreScrollRef.current) {
        window.scrollTo(0, scrollY);
      }
    };
  }, [locked]);

  return skipScrollRestoration;
}
