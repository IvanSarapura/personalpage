"use client";

import { useEffect, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { useLockBodyScroll, useFocusTrap, useIsClient } from "@/hooks";
import { getMenuItems } from "@/data/menuItems";
import { getUi } from "@/data/ui";
import type { Locale } from "@/data/locale";
import MenuHeader from "./MenuHeader";
import MenuNav from "./MenuNav";
import MenuFooter from "./MenuFooter";
import styles from "./FullscreenMenu.module.css";

interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
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
export default function FullscreenMenu({ isOpen, onClose, locale }: FullscreenMenuProps) {
  const isClient = useIsClient();
  const ui = getUi(locale);
  const items = getMenuItems(locale);

  useLockBodyScroll(isOpen);
  const containerRef = useFocusTrap<HTMLDivElement>(isOpen);

  /*
    Los ítems del menú mezclan rutas ("/about") y anclas dentro de una página
    ("/#focus", "/#projects"). Solo interceptamos las anclas que apuntan a la página ACTUAL:
    ahí hacemos smooth scroll manual (compensando la altura del navbar sticky y
    la condición de carrera con useLockBodyScroll). Para rutas y anclas de otra
    página dejamos que el navegador haga la navegación por defecto.
  */
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) {
        // Ruta sin ancla: navegación por defecto; solo cerramos el menú.
        onClose();
        return;
      }

      const normalize = (path: string) => path.replace(/\/+$/, "") || "/";
      const targetPath = normalize(href.slice(0, hashIndex));
      const currentPath = normalize(window.location.pathname);
      if (targetPath !== currentPath) {
        // Ancla de otra página: navegación por defecto.
        onClose();
        return;
      }

      e.preventDefault();
      onClose();

      const hash = href.slice(hashIndex);
      window.setTimeout(() => {
        const target = document.querySelector(hash);
        if (!target) return;

        const navbar = document.querySelector(`nav[aria-label='${ui.navbar.mainNavAriaLabel}']`);
        const navbarHeight = navbar?.getBoundingClientRect().height ?? 0;
        const targetRect = target.getBoundingClientRect();
        const targetPosition = window.scrollY + targetRect.top - navbarHeight;

        window.scrollTo({ top: Math.max(0, targetPosition), behavior: "smooth" });
      }, MENU_CLOSE_DELAY_MS);
    },
    [onClose, ui.navbar.mainNavAriaLabel]
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
      aria-label={ui.navbar.menuDialogLabel}
      onClick={handleBackdropClick}
    >
      <div className={styles.panel}>
        <MenuHeader
          onClose={onClose}
          navigationLabel={ui.navbar.navigationLabel}
          closeLabel={ui.navbar.closeMenu}
        />
        <MenuNav
          items={items}
          isOpen={isOpen}
          onNavigate={handleNavClick}
          onClose={onClose}
          ariaLabel={ui.navbar.menuNavAriaLabel}
        />
        <MenuFooter locale={locale} />
      </div>
    </div>,
    document.body
  );
}
