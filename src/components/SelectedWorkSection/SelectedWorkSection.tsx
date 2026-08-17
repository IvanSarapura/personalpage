import Link from "next/link";
import Container from "@/components/Container/Container";
import ModuleList from "@/components/ModuleList/ModuleList";
import Section from "@/components/Section/Section";
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
        <h2 className="mb-[var(--section-gap)] text-[length:var(--display-2)] leading-[var(--display-2-lh)] font-normal tracking-[var(--display-2-tracking)] text-[var(--text-primary)] text-balance max-[768px]:mb-[var(--space-6)] max-[768px]:text-[length:var(--heading-1)] max-[768px]:leading-[var(--heading-1-lh)] max-[768px]:tracking-[var(--heading-1-tracking)]">
          {ui.heading}
        </h2>

        <div className="mx-auto max-w-[var(--content-max-wide)]">
          <ModuleList modules={getModules(locale)} />

          <div className="mt-[var(--content-gap)]">
            <Link
              href={localePath(locale, "/projects")}
              className="text-[length:var(--body)] font-medium tracking-[var(--letter-spacing-wide)] text-[var(--text-primary)] underline underline-offset-4 [transition:var(--transition-hover)] hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--text-primary)]"
            >
              {ui.allCaseStudies}
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
