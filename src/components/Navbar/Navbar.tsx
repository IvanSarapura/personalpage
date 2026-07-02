"use client";

import Link from "next/link";
import Container from "@/components/Container/Container";
import { SiraLogo } from "@/components/Icons/SiraLogo";
import NavbarControls from "./NavbarControls";
import { useScrolled } from "@/hooks";

export default function Navbar() {
  const scrolled = useScrolled(8);

  // Fondo en un solo origen condicional: en reposo surface-secondary; al hacer
  // scroll, glassmorphism (bg translúcido + blur + hairline). Evita conflictos
  // de especificidad entre utilidades bg-[...] de igual jerarquía.
  const surfaceClass = scrolled
    ? "bg-[var(--navbar-bg-scrolled)] [backdrop-filter:blur(var(--navbar-backdrop-blur))] [-webkit-backdrop-filter:blur(var(--navbar-backdrop-blur))] shadow-[0_1px_0_0_var(--navbar-border-scrolled)]"
    : "bg-[var(--surface-secondary)]";

  return (
    <nav
      aria-label="Main navigation"
      className={`sticky top-0 z-[var(--z-nav)] w-full text-[var(--text-on-light)] [transition:var(--navbar-transition)] ${surfaceClass}`}
    >
      <Container className="flex items-center justify-between py-[var(--navbar-padding-y)] max-[768px]:py-[var(--navbar-padding-y-mobile)]">
        <Link href="/" className="flex items-center" aria-label="Sira home">
          <SiraLogo className="h-auto w-[48px] text-[var(--text-on-light)] max-[768px]:w-[40px]" />
        </Link>
        <NavbarControls />
      </Container>
      <Container>
        <div
          className={`h-[var(--divider-thickness)] w-full bg-[var(--surface-primary)] [transition:opacity_var(--duration-slow)_var(--ease-in-out)] dark:bg-[var(--border-default)] ${
            scrolled ? "opacity-0" : ""
          }`}
        />
      </Container>
    </nav>
  );
}
