import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/data/locale";

/**
 * Routing por locale (fase 3 — .agents/propuesta.md §6):
 * - `/`            → rewrite interno a `/en` (la URL visible queda sin prefijo).
 * - `/es/*`        → pasa tal cual (árbol app/[lang] con lang="es").
 * - `/en/*`        → redirect 308 a la URL sin prefijo (una sola URL canónica
 *                    por página EN; evita contenido duplicado).
 *
 * El matcher excluye assets (_next, archivos con extensión) y metadata routes.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /en y /en/* → canónico sin prefijo.
  if (pathname === `/${DEFAULT_LOCALE}` || pathname.startsWith(`/${DEFAULT_LOCALE}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(`/${DEFAULT_LOCALE}`.length) || "/";
    return NextResponse.redirect(url, 308);
  }

  // Locales no-default con prefijo explícito → sin tocar.
  const hasExplicitLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasExplicitLocale) {
    return;
  }

  // Sin prefijo → sirve el árbol del locale por defecto manteniendo la URL.
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Excluye internals de Next, metadata routes y cualquier archivo estático
  // con extensión (logo.svg, favicon.ico, etc.).
  matcher: ["/((?!_next|api|sitemap\\.xml|robots\\.txt|.*\\..*).*)"],
};
