"use client";

import Link from "next/link";
import Container from "@/components/Container/Container";
import { Logo } from "@/components/Icons/Logo";
import NavbarControls from "./NavbarControls";
import { useScrolled } from "@/hooks";
import { localePath, type Locale } from "@/data/locale";
import { getUi } from "@/data/ui";
import styles from "./Navbar.module.css";

interface NavbarProps {
  locale: Locale;
}

export default function Navbar({ locale }: NavbarProps) {
  const scrolled = useScrolled(8);
  const ui = getUi(locale);

  // Fondo en un solo origen condicional: en reposo papel en light y tinta
  // elevada en dark; al hacer scroll, glassmorphism (bg translúcido + blur +
  // hairline) y el texto se oscurece (--navbar-text-scrolled) para conservar
  // el contraste AA sobre cualquier sección. Evita conflictos de especificidad
  // entre utilidades bg-[...] de igual jerarquía.
  const surfaceClass = scrolled
    ? "bg-[var(--navbar-bg-scrolled)] [backdrop-filter:blur(var(--navbar-backdrop-blur))] [-webkit-backdrop-filter:blur(var(--navbar-backdrop-blur))] shadow-[0_1px_0_0_var(--navbar-border-scrolled)]"
    : "bg-[var(--section-surface-elevated)]";

  return (
    <nav
      aria-label={ui.navbar.mainNavAriaLabel}
      className={`${styles.navbar}${scrolled ? ` ${styles.navbarScrolled}` : ""} sticky top-0 z-[var(--z-nav)] w-full text-[var(--section-text)] [transition:var(--navbar-transition)] ${surfaceClass}`}
    >
      <Container className="flex items-center justify-between py-[var(--navbar-padding-y-mobile)] md:py-[var(--navbar-padding-y)]">
        <Link
          href={localePath(locale, "/")}
          className={`${styles.homeLink} flex items-center`}
          aria-label={ui.navbar.homeAriaLabel}
        >
          <Logo className="h-auto w-[40px] text-[var(--section-text)] md:w-[48px]" />
        </Link>
        <NavbarControls locale={locale} />
      </Container>
      <Container>
        <div
          className={`h-[var(--divider-thickness)] w-full bg-[var(--navbar-divider)] [transition:opacity_var(--duration-slow)_var(--ease-in-out)] ${
            scrolled ? "opacity-0" : ""
          }`}
        />
      </Container>
    </nav>
  );
}
