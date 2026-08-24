"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, localePath, LOCALES, type Locale } from "@/data/locale";
import { getUi } from "@/data/ui";
import styles from "./Navbar.module.css";

const switcherClass =
  "inline-flex items-center justify-center rounded-[var(--radius-full)] border-[length:var(--border-width-thin)] border-solid border-[color:var(--section-text)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--caption)] leading-[var(--caption-lh)] font-medium tracking-[var(--letter-spacing-wide)] text-[var(--section-text)] no-underline [transition:var(--transition-hover)] hover:bg-[var(--section-text)] hover:text-[var(--navbar-locale-hover-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primitive-color-blue-600)]";

interface LocaleSwitcherProps {
  locale: Locale;
}

/** Alterna entre EN (sin prefijo) y ES (/es/*) preservando la ruta actual. */
export default function LocaleSwitcher({ locale }: LocaleSwitcherProps) {
  const ui = getUi(locale);
  const pathname = usePathname() || "/";

  // Ruta canónica sin prefijo de locale.
  const pathnameLocale = LOCALES.find(
    (supportedLocale) =>
      pathname === `/${supportedLocale}` || pathname.startsWith(`/${supportedLocale}/`)
  );
  const basePath = pathnameLocale ? pathname.slice(`/${pathnameLocale}`.length) || "/" : pathname;

  const targetHref =
    locale === DEFAULT_LOCALE ? localePath("es", basePath) : localePath(DEFAULT_LOCALE, basePath);

  return (
    <Link
      href={targetHref}
      className={`${styles.localeSwitcher} ${switcherClass}`}
      aria-label={ui.navbar.switchLocale}
    >
      {ui.navbar.switchLocaleShort}
    </Link>
  );
}
