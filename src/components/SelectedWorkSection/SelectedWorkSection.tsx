import Container from "@/components/Container/Container";
import ModuleList from "@/components/ModuleList/ModuleList";
import Section from "@/components/Section/Section";
import SectionLink from "@/components/SectionLink/SectionLink";
import { localePath, type Locale } from "@/data/locale";
import { getModules } from "@/data/modules";
import { getUi } from "@/data/ui";

interface SelectedWorkSectionProps {
  locale: Locale;
}

export default function SelectedWorkSection({ locale }: SelectedWorkSectionProps) {
  const ui = getUi(locale).selectedWork;

  return (
    <Section variant="blue" paddingY="lg" ariaLabel={ui.ariaLabel} id="projects">
      <Container>
        <h2 className="mb-[var(--space-6)] text-[length:var(--heading-1)] leading-[var(--heading-1-lh)] font-normal tracking-[var(--heading-1-tracking)] text-[var(--text-primary)] text-balance md:mb-[var(--section-gap)] md:text-[length:var(--display-2)] md:leading-[var(--display-2-lh)] md:tracking-[var(--display-2-tracking)]">
          {ui.heading}
        </h2>

        <div className="mx-auto max-w-[var(--content-max-wide)]">
          <ModuleList modules={getModules(locale)} />

          <div className="mt-[var(--content-gap)]">
            <SectionLink href={localePath(locale, "/projects")}>{ui.allCaseStudies}</SectionLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
