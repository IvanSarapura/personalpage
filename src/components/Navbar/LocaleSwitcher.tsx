"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, localePath, type Locale } from "@/data/locale";
import { getUi } from "@/data/ui";

const switcherClass =
  "inline-flex items-center justify-center rounded-[var(--radius-full)] border-[length:var(--border-width-thin)] border-solid border-[color:var(--text-on-light)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--caption)] leading-[var(--caption-lh)] font-medium tracking-[var(--letter-spacing-wide)] text-[var(--text-on-light)] no-underline [transition:var(--transition-hover)] hover:bg-[var(--text-on-light)] hover:text-[var(--color-white-pure)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-blue-screen)] dark:hover:text-[var(--color-deep)]";

interface LocaleSwitcherProps {
  locale: Locale;
}

/** Alterna entre EN (sin prefijo) y ES (/es/*) preservando la ruta actual. */
export default function LocaleSwitcher({ locale }: LocaleSwitcherProps) {
  const ui = getUi(locale);
  const pathname = usePathname() || "/";

  // Ruta canónica sin prefijo de locale.
  const basePath =
    pathname === "/es"
      ? "/"
      : pathname.startsWith("/es/")
        ? pathname.slice("/es".length)
        : pathname;

  const targetHref =
    locale === DEFAULT_LOCALE ? localePath("es", basePath) : localePath(DEFAULT_LOCALE, basePath);

  return (
    <Link href={targetHref} className={switcherClass} aria-label={ui.navbar.switchLocale}>
      {ui.navbar.switchLocaleShort}
    </Link>
  );
}
