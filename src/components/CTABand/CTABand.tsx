import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import { SITE } from "@/data/site";
import { getUi } from "@/data/ui";
import type { Locale } from "@/data/locale";

const emailBtn =
  "inline-flex items-center justify-center rounded-[var(--btn-radius)] border-[length:var(--border-width-thin)] border-solid border-[color:var(--text-on-light)] bg-transparent px-[var(--btn-padding-x-sm)] py-[var(--btn-padding-y-sm)] text-center text-[length:var(--label)] font-normal tracking-[var(--letter-spacing-wide)] text-[var(--text-on-light)] no-underline cursor-pointer [transition:var(--transition-hover)] hover:bg-[var(--text-on-light)] hover:text-[var(--color-white-pure)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-blue-screen)] dark:hover:text-[var(--color-deep)]";

interface CTABandProps {
  locale: Locale;
}

export default function CTABand({ locale }: CTABandProps) {
  const ui = getUi(locale);

  return (
    <Section
      variant="white"
      paddingY="lg"
      ariaLabel={ui.contact.ariaLabel}
      id="contact"
      className="dark:bg-[var(--color-deep-elevated)]"
    >
      <Container className="flex justify-center text-center">
        <div className="flex max-w-[var(--content-max-wide)] flex-col items-center gap-[var(--space-5)]">
          <h2 className="text-[length:var(--display-2)] leading-[var(--display-2-lh)] font-normal tracking-[var(--display-2-tracking)] text-[var(--text-on-light)] max-[768px]:text-[length:var(--heading-1)] max-[768px]:leading-[var(--heading-1-lh)] max-[768px]:tracking-[var(--heading-1-tracking)]">
            {ui.contact.heading}
          </h2>
          <p className="max-w-[var(--content-max-narrow)] text-[length:var(--body-large)] leading-[var(--body-large-lh)] font-normal text-[var(--text-on-light)] opacity-[var(--opacity-secondary)] max-[768px]:text-[length:var(--body)] max-[768px]:leading-[var(--body-lh)]">
            {ui.contact.subheading}
          </p>

          <a href={`mailto:${SITE.email}`} className={emailBtn}>
            {ui.contact.emailCta}
          </a>
        </div>
      </Container>
    </Section>
  );
}
