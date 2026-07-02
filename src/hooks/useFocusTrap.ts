"use client";

import { useEffect, useRef, useCallback } from "react";

const FOCUSABLE_SELECTORS = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/**
 * Hook que atrapa el focus dentro de un elemento mientras está activo.
 * Ciclos Tab/Shift+Tab solo entre elementos focusables del contenedor.
 * Restore focus al elemento previo al desactivar.
 *
 * @param active - Si `true`, activa el focus trap
 * @returns Ref para asignar al contenedor
 */
export function useFocusTrap<T extends HTMLElement>(active: boolean) {
  const containerRef = useRef<T>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback((): HTMLElement[] => {
    const container = containerRef.current;
    if (!container) return [];
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTORS));
  }, []);

  useEffect(() => {
    if (!active) return;

    // Guardar el elemento con foco para restaurarlo al cerrar. Solo nos sirve
    // si es HTMLElement (necesitamos poder llamar .focus()).
    const focusedElement = document.activeElement;
    previousActiveElement.current = focusedElement instanceof HTMLElement ? focusedElement : null;

    const container = containerRef.current;
    if (!container) return;

    // Focus inicial en el primer elemento focusable
    const focusable = getFocusableElements();
    focusable[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const elements = getFocusableElements();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first || !last) return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      previousActiveElement.current?.focus();
    };
  }, [active, getFocusableElements]);

  return containerRef;
}
