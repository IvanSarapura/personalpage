import Link from "next/link";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import { DEFAULT_LOCALE } from "@/data/locale";
import { getUi } from "@/data/ui";

/** 404 dentro del árbol [lang]. `not-found.tsx` no recibe params, así que usa
 *  el locale por defecto — suficiente para una página de error minimalista. */
export default function NotFound() {
  const ui = getUi(DEFAULT_LOCALE).notFound;

  return (
    <main id="main-content">
      <Section variant="white" paddingY="lg" ariaLabel={ui.title}>
        <Container className="flex flex-col items-start gap-[var(--element-gap)]">
          <h1 className="text-[length:var(--heading-1)] leading-[var(--heading-1-lh)] font-normal tracking-[var(--heading-1-tracking)] text-[var(--text-on-light)]">
            {ui.title}
          </h1>
          <p className="text-[length:var(--body-large)] leading-[var(--body-large-lh)] text-[var(--text-on-light)] opacity-[var(--opacity-strong)]">
            {ui.message}
          </p>
          <Link
            href="/"
            className="text-[length:var(--body)] font-medium tracking-[var(--letter-spacing-wide)] text-[var(--text-on-light)] underline underline-offset-4 [transition:var(--transition-hover)] hover:opacity-70"
          >
            {ui.backHome}
          </Link>
        </Container>
      </Section>
    </main>
  );
}
