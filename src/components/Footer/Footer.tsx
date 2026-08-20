import Link from "next/link";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import { Logo } from "@/components/Icons/Logo";
import { getFooterLinks } from "@/data/navigation";
import { getSiteCopy, SITE } from "@/data/site";
import { getUi } from "@/data/ui";
import { localePath, type Locale } from "@/data/locale";

const columnLinkClass =
  "text-caption tracking-[var(--letter-spacing-wide)] text-[var(--text-secondary)] opacity-[var(--opacity-secondary)] [transition:var(--transition-hover)] hover:opacity-100 hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[color:var(--border-default)] focus-visible:outline-offset-[3px] focus-visible:rounded-[var(--radius-sm)] focus-visible:opacity-100 focus-visible:text-[var(--text-primary)]";

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const ui = getUi(locale);
  const footerLinks = getFooterLinks(locale);
  const siteCopy = getSiteCopy(locale);

  return (
    <Section variant="blue" paddingY="lg" ariaLabel={ui.footer.ariaLabel} as="footer">
      <Container>
        <div className="grid grid-cols-1 items-start gap-[var(--space-6)] md:gap-[var(--space-7)] lg:grid-cols-[var(--footer-brand-col)_1fr] lg:gap-[var(--space-8)]">
          <div className="flex flex-col gap-[var(--space-4)]">
            <Link
              href={localePath(locale, "/")}
              className="flex items-center"
              aria-label={ui.footer.homeAriaLabel}
            >
              <Logo className="h-auto w-[var(--icon-lg)] text-[var(--text-primary)] md:w-[var(--icon-xl)]" />
            </Link>
            <p className="text-caption max-w-[var(--footer-brand-max)] tracking-[var(--letter-spacing-wide)] text-[var(--text-secondary)] opacity-[var(--opacity-secondary)]">
              {siteCopy.tagline}
            </p>
          </div>

          <nav
            className="grid grid-cols-2 gap-[var(--space-5)] lg:grid-cols-4 lg:gap-[var(--space-6)]"
            aria-label={ui.footer.navAriaLabel}
          >
            {footerLinks.map((column) => (
              <div key={column.title}>
                <h4 className="text-label mb-[var(--space-3)] font-semibold tracking-[var(--letter-spacing-wide)] text-[var(--text-primary)] md:mb-[var(--space-4)]">
                  {column.title}
                </h4>
                <ul className="m-0 flex list-none flex-col gap-[var(--space-2)] p-0 md:gap-[var(--space-3)]">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className={columnLinkClass}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-[var(--space-5)] flex items-center justify-center border-t border-[color:var(--border-subtle)] pt-[var(--space-3)] md:mt-[var(--space-6)] md:pt-[var(--space-4)]">
          <p className="text-caption tracking-[var(--letter-spacing-wide)] text-[var(--text-secondary)] opacity-[var(--opacity-subtle)]">
            © {new Date().getFullYear()} {SITE.name}. {ui.footer.rights}
          </p>
        </div>
      </Container>
    </Section>
  );
}
