import Container from "@/components/Container/Container";
import ContactForm from "@/components/ContactForm/ContactForm";
import Section from "@/components/Section/Section";
import { SITE } from "@/data/site";
import { getUi } from "@/data/ui";
import type { Locale } from "@/data/locale";

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
        <div className="flex w-full max-w-[var(--content-max-wide)] flex-col items-center gap-[var(--space-5)]">
          <h2 className="text-[length:var(--display-2)] leading-[var(--display-2-lh)] font-normal tracking-[var(--display-2-tracking)] text-[var(--text-on-light)] text-balance max-[768px]:text-[length:var(--heading-1)] max-[768px]:leading-[var(--heading-1-lh)] max-[768px]:tracking-[var(--heading-1-tracking)]">
            {ui.contact.heading}
          </h2>

          <p className="max-w-[var(--content-max-narrow)] text-[length:var(--body-large)] leading-[var(--body-large-lh)] font-normal text-[var(--text-on-light)] opacity-[var(--opacity-secondary)] max-[768px]:text-[length:var(--body)] max-[768px]:leading-[var(--body-lh)]">
            {ui.contact.subheading}
          </p>

          <ContactForm locale={locale} copy={ui.contact} fallbackHref={SITE.social.linkedin} />
        </div>
      </Container>
    </Section>
  );
}
