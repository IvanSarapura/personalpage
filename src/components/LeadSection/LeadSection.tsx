import Link from "next/link";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import { buttonVariants } from "@/components/ui/button";
import { localePath, type Locale } from "@/data/locale";
import { getProject } from "@/data/projects";
import { SITE } from "@/data/site";
import { getUi } from "@/data/ui";

interface LeadSectionProps {
  locale: Locale;
}

export default function LeadSection({ locale }: LeadSectionProps) {
  const ui = getUi(locale);
  const alimentis = getProject("food-code-oracle", locale);

  return (
    <Section variant="elevated" paddingY="none" ariaLabel={ui.hero.ariaLabel} id="home">
      <div className="py-[var(--section-padding-y-mobile)] md:py-[var(--section-padding-y)]">
        <Container>
          <h1 className="mb-[var(--element-gap)] text-[length:var(--display-2)] leading-[var(--display-2-lh)] font-normal tracking-[var(--display-2-tracking)] text-[var(--section-text)] text-balance md:mb-[var(--content-gap)] md:text-[length:var(--display-1)] md:leading-[var(--display-1-lh)] md:tracking-[var(--display-1-tracking)]">
            {SITE.name}
          </h1>

          <p className="mb-[var(--content-gap-mobile)] max-w-[var(--content-max-text)] text-[length:var(--body)] leading-[var(--body-lh)] font-normal tracking-[var(--letter-spacing-snug)] text-[var(--section-text-secondary)] md:mb-[var(--content-gap)] md:text-[length:var(--body-large)] md:leading-[var(--body-large-lh)]">
            {ui.hero.subheadline}
          </p>

          <div className="grid w-full max-w-full grid-cols-2 items-stretch gap-[var(--element-gap)] md:w-fit">
            <Link
              href={localePath(locale, "/projects")}
              className={buttonVariants({ variant: "outline", size: "sm", className: "w-full" })}
            >
              {ui.hero.ctaPrimary}
            </Link>
            <Link
              href="#contact"
              className={buttonVariants({ variant: "default", size: "sm", className: "w-full" })}
            >
              {ui.hero.ctaSecondary}
            </Link>
          </div>

          {alimentis && (
            <div className="mt-[var(--space-5)] border-t-[length:var(--border-width-thin)] border-solid border-[color:var(--section-border-interactive)] pt-[var(--space-5)]">
              <div className="max-w-[var(--content-max-text)]">
                <h2 className="text-[length:var(--heading-2)] leading-[var(--heading-2-lh)] font-semibold tracking-[var(--heading-2-tracking)] text-[var(--section-text)] text-balance">
                  {ui.hero.driving.heading}
                </h2>
                <p className="mt-[var(--space-4)] text-[length:var(--body)] leading-[var(--body-lh)] text-[var(--section-text-secondary)]">
                  {ui.hero.driving.description}
                </p>
              </div>

              <article
                className="mt-[var(--content-gap-mobile)] grid gap-[var(--element-gap)] border-[length:var(--border-width-thin)] border-solid border-[color:var(--section-border-interactive)] bg-[var(--accent-surface-subtle)] p-[var(--content-gap-mobile)] md:mt-[var(--content-gap)] md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:p-[var(--content-gap)]"
                aria-labelledby="alimentis-title"
              >
                <div>
                  <h3
                    id="alimentis-title"
                    className="text-[length:var(--heading-3)] leading-[var(--heading-3-lh)] font-semibold tracking-[var(--heading-3-tracking)] text-[var(--section-text)]"
                  >
                    {alimentis.title}
                  </h3>
                  <p className="mt-[var(--element-gap-sm)] max-w-[var(--content-max-text)] text-[length:var(--body)] leading-[var(--body-lh)] text-[var(--section-text-secondary)]">
                    {ui.hero.driving.projectDescription}
                  </p>
                </div>
              </article>
            </div>
          )}
        </Container>
      </div>
    </Section>
  );
}
