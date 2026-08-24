import Link from "next/link";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import { buttonVariants } from "@/components/ui/button";
import { localePath, type Locale } from "@/data/locale";
import { SITE } from "@/data/site";
import { getUi } from "@/data/ui";

interface LeadSectionProps {
  locale: Locale;
}

export default function LeadSection({ locale }: LeadSectionProps) {
  const ui = getUi(locale);

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
        </Container>
      </div>
    </Section>
  );
}
