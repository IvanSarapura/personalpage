import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import { ExternalLink } from "lucide-react";
import { getCurrentWork } from "@/data/current-work";
import type { Locale } from "@/data/locale";
import { getUi } from "@/data/ui";
import styles from "./CurrentWorkSection.module.css";

interface CurrentWorkSectionProps {
  locale: Locale;
}

export default function CurrentWorkSection({ locale }: CurrentWorkSectionProps) {
  const ui = getUi(locale).building;
  const items = getCurrentWork(locale);

  return (
    <Section
      variant="white"
      paddingY="lg"
      ariaLabel={ui.ariaLabel}
      className="dark:bg-[var(--surface-tertiary)]"
      id="building"
    >
      <Container>
        <header className={styles.header}>
          <h2 className={styles.heading}>{ui.heading}</h2>
          <p className={styles.subheading}>{ui.subheading}</p>
        </header>

        {/* role="list" preserva la semántica en Safari cuando CSS elimina el marcador. */}
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
        <ul className={styles.list} role="list">
          {items.map((item) => {
            const titleId = `current-work-${item.id}`;

            return (
              <li key={item.id} className={styles.item}>
                <article className={styles.article} aria-labelledby={titleId}>
                  <p className={styles.eyebrow}>
                    {item.category} <span aria-hidden="true">·</span> {item.status}
                  </p>
                  <h3 id={titleId} className={styles.title}>
                    {item.title}
                  </h3>
                  <p className={styles.description}>{item.description}</p>

                  <ul className={styles.highlights}>
                    {item.highlights.map((highlight) => (
                      <li key={highlight} className={styles.highlight}>
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  {item.link && (
                    <a
                      href={item.link.href}
                      className={styles.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.link.label}
                      <ExternalLink aria-hidden="true" focusable="false" />
                      <span className="sr-only"> ({ui.opensInNewTab})</span>
                    </a>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
