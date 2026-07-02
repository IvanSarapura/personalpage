"use client";

import { useState, useEffect } from "react";

export const DEFAULT_SCROLL_THRESHOLD = 8;

/**
 * Hook que detecta si el usuario ha scrolleado más allá de un umbral.
 * Usa requestAnimationFrame para evitar layout thrashing.
 *
 * @param threshold - Píxeles de scroll para activar el estado (default: 8)
 * @returns `true` si el scroll supera el umbral
 */
export function useScrolled(threshold: number = DEFAULT_SCROLL_THRESHOLD): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > threshold);
        rafId = 0;
      });
    };

    // Estado inicial (p. ej. al recargar con la posición de scroll preservada).
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [threshold]);

  return scrolled;
}
