"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/useTheme";
import { scrollToTopInstantly } from "@/lib/smooth-scroll";
import { MenuIcon, CloseIcon } from "@/components/Icons/MenuIcons";
import { Switch } from "@/components/Switch";
import FullscreenMenu from "./FullscreenMenu";
import LocaleSwitcher from "./LocaleSwitcher";
import { getUi } from "@/data/ui";
import type { Locale } from "@/data/locale";

const menuBtnClass =
  "inline-flex h-[var(--navbar-touch-target)] w-[var(--navbar-touch-target)] cursor-pointer items-center justify-center border-none bg-transparent p-0 text-[var(--text-on-light)] [transition:opacity_var(--duration-base)_var(--ease-out)] hover:opacity-[var(--opacity-moderate)]";

interface NavbarControlsProps {
  locale: Locale;
}

export default function NavbarControls({ locale }: NavbarControlsProps) {
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const pendingMenuRouteRef = useRef<string | null>(null);
  const ui = getUi(locale);

  // El React Compiler memoiza estas funciones; useCallback sería redundante.
  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);
  const prepareRouteNavigation = (href: string) => {
    pendingMenuRouteRef.current = new URL(href, window.location.origin).pathname;
  };

  /* Next conserva el scroll si el nuevo Page sigue visible. Para las rutas
     iniciadas desde el menú queremos una página de destino que se pinte arriba,
     sin alterar la restauración nativa de Back/Forward. */
  useLayoutEffect(() => {
    if (pendingMenuRouteRef.current !== pathname) return;

    scrollToTopInstantly();
    pendingMenuRouteRef.current = null;
  }, [pathname]);

  /* El label "Dark/Light" describe la acción (a dónde vas si pulsas),
     no el estado actual — es un CTA, coherente con el aria-label. */
  const switchLabel = isDark ? ui.navbar.switchToLight : ui.navbar.switchToDark;
  const labelText = isDark ? ui.navbar.lightLabel : ui.navbar.darkLabel;

  return (
    <div className="flex items-center gap-[var(--element-gap)]">
      <LocaleSwitcher locale={locale} />

      <div className="flex items-center gap-[var(--space-3)]">
        <Switch checked={isDark} onChange={toggleTheme} ariaLabel={switchLabel} />
        <span className="text-label hidden min-w-[36px] text-center tracking-[var(--letter-spacing-wide)] text-[var(--text-on-light)] select-none md:inline-block">
          {labelText}
        </span>
      </div>

      <button
        type="button"
        className={`${menuBtnClass}${isMenuOpen ? " opacity-[var(--opacity-moderate)]" : ""}`}
        onClick={isMenuOpen ? closeMenu : openMenu}
        aria-label={isMenuOpen ? ui.navbar.closeMenu : ui.navbar.openMenu}
        aria-expanded={isMenuOpen}
      >
        <span
          className="inline-flex h-[var(--navbar-icon-size)] w-[var(--navbar-icon-size)] items-center justify-center overflow-hidden [&>svg]:block [&>svg]:h-full [&>svg]:w-full"
          aria-hidden="true"
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </span>
      </button>

      <FullscreenMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        locale={locale}
        onRouteNavigation={prepareRouteNavigation}
      />
    </div>
  );
}
