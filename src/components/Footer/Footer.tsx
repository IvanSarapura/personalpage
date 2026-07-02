import Link from "next/link";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import { SiraLogo } from "@/components/Icons/SiraLogo";
import { LinkedInIcon, XIcon } from "@/components/Icons/SocialIcons";
import { FOOTER_LINKS } from "@/data/navigation";
import { SITE } from "@/data/site";

const socialLinkClass =
  "flex items-center justify-center w-[var(--action-btn-size)] h-[var(--action-btn-size)] rounded-full border-[length:var(--border-width-thin)] border-solid border-[color:var(--border-subtle)] text-[var(--text-secondary)] [transition:var(--transition-hover)] hover:border-[color:var(--border-default)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[color:var(--border-default)] focus-visible:outline-offset-[3px] focus-visible:border-[color:var(--border-default)] focus-visible:text-[var(--text-primary)]";

const columnLinkClass =
  "text-caption tracking-[var(--letter-spacing-wide)] text-[var(--text-secondary)] opacity-[var(--opacity-secondary)] [transition:var(--transition-hover)] hover:opacity-100 hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[color:var(--border-default)] focus-visible:outline-offset-[3px] focus-visible:rounded-[var(--radius-sm)] focus-visible:opacity-100 focus-visible:text-[var(--text-primary)]";

export default function Footer() {
  return (
    <Section variant="blue" paddingY="lg" ariaLabel="Footer" as="footer" id="contact">
      <Container>
        <div className="grid grid-cols-[var(--footer-brand-col)_1fr] items-start gap-[var(--space-8)] max-[1024px]:grid-cols-1 max-[1024px]:gap-[var(--space-7)] max-[768px]:gap-[var(--space-6)]">
          <div className="flex flex-col gap-[var(--space-4)]">
            <Link href="/" className="flex items-center" aria-label={`${SITE.name} home`}>
              <SiraLogo className="h-auto w-[var(--icon-xl)] text-[var(--text-primary)] max-[768px]:w-[var(--icon-lg)]" />
            </Link>
            <p className="text-caption max-w-[var(--footer-brand-max)] tracking-[var(--letter-spacing-wide)] text-[var(--text-secondary)] opacity-[var(--opacity-secondary)]">
              {SITE.tagline}
            </p>
            <div className="flex items-center gap-[var(--space-4)]">
              <a
                href={SITE.social.linkedin}
                className={socialLinkClass}
                aria-label={`${SITE.name} on LinkedIn`}
              >
                <LinkedInIcon className="h-[var(--icon-xs)] w-[var(--icon-xs)]" />
              </a>
              <a
                href={SITE.social.x}
                className={socialLinkClass}
                aria-label={`${SITE.name} on X (Twitter)`}
              >
                <XIcon className="h-[var(--icon-xs)] w-[var(--icon-xs)]" />
              </a>
            </div>
          </div>

          <nav
            className="grid grid-cols-4 gap-[var(--space-6)] max-[1024px]:grid-cols-2 max-[768px]:grid-cols-2 max-[768px]:gap-[var(--space-5)]"
            aria-label="Footer navigation"
          >
            {FOOTER_LINKS.map((column) => (
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
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </Section>
  );
}
