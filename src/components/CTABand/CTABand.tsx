import Link from "next/link";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";

const primaryBtn =
  "inline-flex items-center justify-center rounded-[var(--btn-radius)] border-2 border-solid border-[color:var(--text-on-light)] bg-[var(--text-on-light)] px-[var(--btn-padding-x-lg)] py-[var(--btn-padding-y-lg)] text-[length:var(--body)] font-medium leading-[1.25] tracking-[var(--letter-spacing-wide)] text-[var(--color-white-pure)] no-underline cursor-pointer [transition:var(--transition-hover)] hover:bg-transparent hover:text-[var(--text-on-light)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--text-on-light)] dark:text-[var(--color-deep)] dark:hover:text-[var(--color-white-pure)] max-[768px]:px-[28px] max-[768px]:py-[14px]";

export default function CTABand() {
  return (
    <Section
      variant="white"
      paddingY="lg"
      ariaLabel="Call to action"
      className="dark:bg-[var(--color-deep-elevated)]"
    >
      <Container className="flex justify-center text-center">
        <div className="flex max-w-[var(--content-max-wide)] flex-col items-center gap-[var(--space-5)]">
          <h2 className="text-[length:var(--display-2)] leading-[var(--display-2-lh)] font-normal tracking-[var(--display-2-tracking)] text-[var(--text-on-light)] max-[768px]:text-[length:var(--heading-1)] max-[768px]:leading-[var(--heading-1-lh)] max-[768px]:tracking-[var(--heading-1-tracking)]">
            Ready to stop losing guests?
          </h2>
          <p className="max-w-[var(--content-max-narrow)] text-[length:var(--body-large)] leading-[var(--body-large-lh)] font-normal text-[var(--text-on-light)] opacity-[var(--opacity-secondary)] max-[768px]:text-[length:var(--body)] max-[768px]:leading-[var(--body-lh)]">
            Book a free demo and see how Sira finds your revenue leaks in under 5 minutes.
          </p>

          <div className="mt-[var(--space-3)] flex flex-col items-center gap-[var(--space-4)]">
            <Link href="/demo" className={primaryBtn}>
              Book a Demo
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
