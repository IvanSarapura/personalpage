"use client";

import { useEffect, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { useLockBodyScroll, useFocusTrap, useIsClient } from "@/hooks";
import { MENU_ITEMS } from "@/data/menuItems";
import MenuHeader from "./MenuHeader";
import MenuNav from "./MenuNav";
import MenuFooter from "./MenuFooter";
import styles from "./FullscreenMenu.module.css";

interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_CLOSE_DELAY_MS = 100;

/**
 * Fuerza un reflow leyendo una propiedad de layout. Evita que el navegador
 * agrupe el cambio de display+opacity para que la transición CSS de apertura
 * se dispare correctamente.
 */
function forceReflow(element: HTMLElement): void {
  // Lectura con efecto secundario de layout intencional (no es código muerto).
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  element.scrollHeight;
}

/**
 * Menú de navegación a pantalla completa, renderizado en un portal sobre el body.
 * Orquesta los hooks (lock de scroll, focus trap, cierre por Escape/backdrop) y
 * compone la cabecera, la navegación y el pie.
 */
export default function FullscreenMenu({ isOpen, onClose }: FullscreenMenuProps) {
  const isClient = useIsClient();

  useLockBodyScroll(isOpen);
  const containerRef = useFocusTrap<HTMLDivElement>(isOpen);

  /*
    Smooth scroll a la sección objetivo y cerrar el menú.

    Estrategia:
    1. Cerrar el menú primero.
    2. Esperar a que la transición de cierre del overlay comience
       y el body scroll se restaure completamente (~100ms).
    3. Calcular el offset manualmente considerando la altura del navbar
       para evitar que el target quede detrás del sticky header.
    4. Usar window.scrollTo en lugar de scrollIntoView para control total.

    Esto previene la condición de carrera entre useLockBodyScroll
    y scrollIntoView que causaba el bug del navbar.
  */
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      onClose();

      window.setTimeout(() => {
        const target = document.querySelector(href);
        if (!target) return;

        const navbar = document.querySelector("nav[aria-label='Main navigation']");
        const navbarHeight = navbar?.getBoundingClientRect().height ?? 0;
        const targetRect = target.getBoundingClientRect();
        const targetPosition = window.scrollY + targetRect.top - navbarHeight;

        window.scrollTo({ top: Math.max(0, targetPosition), behavior: "smooth" });
      }, MENU_CLOSE_DELAY_MS);
    },
    [onClose]
  );

  // Forzar un reflow antes de la transición de apertura (ver forceReflow).
  useLayoutEffect(() => {
    if (isOpen && containerRef.current) {
      forceReflow(containerRef.current);
    }
  }, [isOpen, containerRef]);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Click en backdrop cierra el menú
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const overlayClass = `${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`;

  if (!isClient) return null;

  return createPortal(
    // El click en el backdrop cierra el menú (mejora con puntero); el cierre por
    // teclado ya lo cubre la tecla Escape, por eso se omiten los listeners de teclado.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <div
      ref={containerRef}
      className={overlayClass}
      role="dialog"
      aria-modal="true"
      aria-label="Main navigation menu"
      onClick={handleBackdropClick}
    >
      <div className={styles.panel}>
        <MenuHeader onClose={onClose} />
        <MenuNav items={MENU_ITEMS} isOpen={isOpen} onNavigate={handleNavClick} onClose={onClose} />
        <MenuFooter />
      </div>
    </div>,
    document.body
  );
}
