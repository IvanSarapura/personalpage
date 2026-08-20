import Link from "next/link";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import { localePath, type Locale } from "@/data/locale";
import { SITE } from "@/data/site";
import { getUi } from "@/data/ui";

const btnBase =
  "inline-flex w-full min-w-0 items-center justify-center rounded-[var(--btn-radius)] border-[length:var(--border-width-thin)] border-solid border-[color:var(--text-on-light)] px-[var(--btn-padding-x-sm)] py-[var(--btn-padding-y-sm)] text-center text-[length:var(--label)] font-normal tracking-[var(--letter-spacing-wide)] no-underline cursor-pointer [transition:var(--transition-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-blue-screen)]";

const btnWhite =
  "bg-transparent text-[var(--text-on-light)] hover:bg-[var(--text-on-light)] hover:text-[var(--color-white-pure)] dark:hover:text-[var(--color-deep)]";

const btnBlue =
  "bg-[var(--text-on-light)] text-[var(--color-white-pure)] dark:text-[var(--color-deep)] hover:bg-transparent hover:text-[var(--text-on-light)] dark:hover:text-[var(--color-white-pure)]";

interface LeadSectionProps {
  locale: Locale;
}

export default function LeadSection({ locale }: LeadSectionProps) {
  const ui = getUi(locale);

  return (
    <Section
      variant="white"
      paddingY="none"
      ariaLabel={ui.hero.ariaLabel}
      className="dark:bg-[var(--surface-tertiary)]"
      id="home"
    >
      <div className="py-[var(--section-padding-y-mobile)] md:py-[var(--section-padding-y)]">
        <Container>
          <h1 className="mb-[var(--element-gap)] text-[length:var(--display-2)] leading-[var(--display-2-lh)] font-normal tracking-[var(--display-2-tracking)] text-[var(--text-on-light)] text-balance md:mb-[var(--content-gap)] md:text-[length:var(--display-1)] md:leading-[var(--display-1-lh)] md:tracking-[var(--display-1-tracking)]">
            {SITE.name}
          </h1>

          <p className="mb-[var(--content-gap-mobile)] max-w-[var(--content-max-text)] text-[length:var(--body)] leading-[var(--body-lh)] font-normal tracking-[var(--letter-spacing-snug)] text-[var(--text-on-light)] opacity-[var(--opacity-strong)] md:mb-[var(--content-gap)] md:text-[length:var(--body-large)] md:leading-[var(--body-large-lh)]">
            {ui.hero.subheadline}
          </p>

          <div className="grid w-full max-w-full grid-cols-2 items-stretch gap-[var(--element-gap)] md:w-fit">
            <Link href={localePath(locale, "/projects")} className={`${btnBase} ${btnWhite}`}>
              {ui.hero.ctaPrimary}
            </Link>
            <Link href="#contact" className={`${btnBase} ${btnBlue}`}>
              {ui.hero.ctaSecondary}
            </Link>
          </div>
        </Container>
      </div>
    </Section>
  );
}
