import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import SectionLink from "@/components/SectionLink/SectionLink";
import { DEFAULT_LOCALE } from "@/data/locale";
import { getUi } from "@/data/ui";

/** 404 dentro del árbol [lang]. `not-found.tsx` no recibe params, así que usa
 *  el locale por defecto — suficiente para una página de error minimalista. */
export default function NotFound() {
  const ui = getUi(DEFAULT_LOCALE).notFound;

  return (
    <main id="main-content" tabIndex={-1}>
      <Section variant="surface" paddingY="lg" ariaLabel={ui.title}>
        <Container className="flex flex-col items-start gap-[var(--element-gap)]">
          <h1 className="text-[length:var(--heading-1)] leading-[var(--heading-1-lh)] font-normal tracking-[var(--heading-1-tracking)] text-[var(--section-text)]">
            {ui.title}
          </h1>
          <p className="text-[length:var(--body-large)] leading-[var(--body-large-lh)] text-[var(--section-text-secondary)]">
            {ui.message}
          </p>
          <SectionLink href="/">{ui.backHome}</SectionLink>
        </Container>
      </Section>
    </main>
  );
}
