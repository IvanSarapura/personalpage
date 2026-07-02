"use client";

import { useEffect } from "react";

/**
 * Hook que bloquea el scroll del body mientras está activo.
 * Preserva la posición del scroll para evitar saltos al desbloquear.
 *
 * @param locked - Si `true`, bloquea el scroll
 */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

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
      // Restaurar la posición del scroll para evitar saltos indeseados
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}
