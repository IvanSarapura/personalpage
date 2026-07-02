"use client";

import { useState } from "react";
import { useTheme } from "@/providers/useTheme";
import { MenuIcon, CloseIcon } from "@/components/Icons/MenuIcons";
import { Switch } from "@/components/Switch";
import FullscreenMenu from "./FullscreenMenu";

const menuBtnClass =
  "inline-flex h-[var(--navbar-touch-target)] w-[var(--navbar-touch-target)] cursor-pointer items-center justify-center border-none bg-transparent p-0 text-[var(--text-on-light)] [transition:opacity_var(--duration-base)_var(--ease-out)] hover:opacity-[var(--opacity-moderate)]";

export default function NavbarControls() {
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // El React Compiler memoiza estas funciones; useCallback sería redundante.
  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  /* El label "Dark/Light" describe la acción (a dónde vas si pulsas),
     no el estado actual — es un CTA, coherente con el aria-label. */
  const switchLabel = isDark ? "Switch to light mode" : "Switch to dark mode";
  const labelText = isDark ? "Light" : "Dark";

  return (
    <div className="flex items-center gap-[var(--element-gap)]">
      {/* suppressHydrationWarning: `isDark` proviene de useSyncExternalStore;
          en SSR siempre es "light", pero el script anti-FOUC de layout.tsx
          ya aplicó la clase `dark` al <html> antes de hidratar. La diferencia
          es intencional y esperada — no eliminar este prop. */}
      <div className="flex items-center gap-[var(--space-3)]" suppressHydrationWarning>
        <Switch checked={isDark} onChange={toggleTheme} ariaLabel={switchLabel} />
        <span className="text-label min-w-[36px] text-center tracking-[var(--letter-spacing-wide)] text-[var(--text-on-light)] select-none max-[768px]:hidden">
          {labelText}
        </span>
      </div>

      <button
        type="button"
        className={`${menuBtnClass}${isMenuOpen ? " opacity-[var(--opacity-moderate)]" : ""}`}
        onClick={isMenuOpen ? closeMenu : openMenu}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMenuOpen}
      >
        <span
          className="inline-flex h-[var(--navbar-icon-size)] w-[var(--navbar-icon-size)] items-center justify-center overflow-hidden [&>svg]:block [&>svg]:h-full [&>svg]:w-full"
          aria-hidden="true"
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </span>
      </button>

      <FullscreenMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </div>
  );
}
