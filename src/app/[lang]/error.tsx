"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import { DEFAULT_LOCALE, hasLocale, type Locale } from "@/data/locale";
import { getUi } from "@/data/ui";
import styles from "./error.module.css";
import { Button } from "@/components/ui/button";

/** Error boundary por segmento [lang]. No recibe params, así que deduce el
 *  locale de la URL actual (los fallbacks de ruta caen en el default). */
function useRouteLocale(): Locale {
  const pathname = usePathname() ?? "";
  const firstSegment = pathname.split("/")[1];
  return firstSegment && hasLocale(firstSegment) ? firstSegment : DEFAULT_LOCALE;
}

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const ui = getUi(useRouteLocale()).errorPage;

  // Registrar el error para diagnóstico; no se traga en silencio.
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" tabIndex={-1} aria-labelledby="error-page-title">
      <Section variant="surface" paddingY="lg" as="div">
        <Container className={styles.content}>
          <h1 id="error-page-title" className={styles.title}>
            {ui.title}
          </h1>
          <p className={styles.message}>{ui.message}</p>
          <Button type="button" variant="outline" size="sm" onClick={unstable_retry}>
            {ui.retry}
          </Button>
        </Container>
      </Section>
    </main>
  );
}
