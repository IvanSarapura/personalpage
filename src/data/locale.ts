/** Locales soportados por el contenido del sitio.
 *  Routing (fase 3 — .agents/propuesta.md §6): `/` sirve EN (rewrite interno a
 *  `/en` vía src/proxy.ts) y `/es/*` sirve ES. `/en/*` redirige a la URL sin
 *  prefijo para mantener una única URL canónica por página. */
export const LOCALES = ["en", "es"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function hasLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Prefija una ruta interna con el locale cuando no es el default.
 *  localePath("en", "/projects") → "/projects"
 *  localePath("es", "/projects") → "/es/projects"
 *  localePath("es", "/")         → "/es" */
export function localePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}
