import Link from "next/link";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import { Logo } from "@/components/Icons/Logo";
import { GitHubIcon, LinkedInIcon } from "@/components/Icons/SocialIcons";
import { getFooterLinks } from "@/data/navigation";
import { getSiteCopy, SITE } from "@/data/site";
import { getUi } from "@/data/ui";
import { localePath, type Locale } from "@/data/locale";

const socialLinkClass =
  "flex items-center justify-center w-[var(--action-btn-size)] h-[var(--action-btn-size)] rounded-full border-[length:var(--border-width-thin)] border-solid border-[color:var(--border-subtle)] text-[var(--text-secondary)] [transition:var(--transition-hover)] hover:border-[color:var(--border-default)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[color:var(--border-default)] focus-visible:outline-offset-[3px] focus-visible:border-[color:var(--border-default)] focus-visible:text-[var(--text-primary)]";

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
        <div className="grid grid-cols-[var(--footer-brand-col)_1fr] items-start gap-[var(--space-8)] max-[1024px]:grid-cols-1 max-[1024px]:gap-[var(--space-7)] max-[768px]:gap-[var(--space-6)]">
          <div className="flex flex-col gap-[var(--space-4)]">
            <Link
              href={localePath(locale, "/")}
              className="flex items-center"
              aria-label={ui.footer.homeAriaLabel}
            >
              <Logo className="h-auto w-[var(--icon-xl)] text-[var(--text-primary)] max-[768px]:w-[var(--icon-lg)]" />
            </Link>
            <p className="text-caption max-w-[var(--footer-brand-max)] tracking-[var(--letter-spacing-wide)] text-[var(--text-secondary)] opacity-[var(--opacity-secondary)]">
              {siteCopy.tagline}
            </p>
            <div className="flex items-center gap-[var(--space-4)]">
              <a
                href={SITE.social.linkedin}
                className={socialLinkClass}
                aria-label={ui.footer.onLinkedIn}
              >
                <LinkedInIcon className="h-[var(--icon-xs)] w-[var(--icon-xs)]" />
              </a>
              <a
                href={SITE.social.github}
                className={socialLinkClass}
                aria-label={ui.footer.onGitHub}
              >
                <GitHubIcon className="h-[var(--icon-xs)] w-[var(--icon-xs)]" />
              </a>
            </div>
          </div>

          <nav
            className="grid grid-cols-4 gap-[var(--space-6)] max-[1024px]:grid-cols-2 max-[768px]:grid-cols-2 max-[768px]:gap-[var(--space-5)]"
            aria-label={ui.footer.navAriaLabel}
          >
            {footerLinks.map((column) => (
              <div key={column.title}>
                <h4 className="text-label mb-[var(--space-4)] font-semibold tracking-[var(--letter-spacing-wide)] text-[var(--text-primary)] max-[768px]:mb-[var(--space-3)]">
                  {column.title}
                </h4>
                <ul className="m-0 flex list-none flex-col gap-[var(--space-3)] p-0 max-[768px]:gap-[var(--space-2)]">
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

        <div className="mt-[var(--space-6)] flex items-center justify-center border-t border-[color:var(--border-subtle)] pt-[var(--space-4)] max-[768px]:mt-[var(--space-5)] max-[768px]:pt-[var(--space-3)]">
          <p className="text-caption tracking-[var(--letter-spacing-wide)] text-[var(--text-secondary)] opacity-[var(--opacity-subtle)]">
            © {new Date().getFullYear()} {SITE.name}. {ui.footer.rights}
          </p>
        </div>
      </Container>
    </Section>
  );
}
