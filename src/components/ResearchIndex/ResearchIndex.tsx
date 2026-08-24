import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import SectionLink from "@/components/SectionLink/SectionLink";
import type { Locale } from "@/data/locale";
import { getResearch } from "@/data/research";
import { getUi } from "@/data/ui";
import styles from "./ResearchIndex.module.css";

interface ResearchIndexProps {
  locale: Locale;
}

function formatAuthors(authors: readonly { name: string }[], locale: Locale): string {
  return new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(
    authors.map((author) => author.name)
  );
}

export default function ResearchIndex({ locale }: ResearchIndexProps) {
  const ui = getUi(locale).research;
  const research = getResearch(locale);

  return (
    <Section variant="elevated" paddingY="lg" as="section" ariaLabelledBy="research-page-title">
      <Container>
        <header className={styles.hero}>
          <h1 id="research-page-title" className={styles.pageTitle}>
            {ui.pageTitle}
          </h1>
          <p className={styles.pageIntro}>{ui.pageIntro}</p>
        </header>

        <div className={styles.archiveHeading}>
          <h2>{ui.archiveHeading}</h2>
          <p>
            <span>{String(research.length).padStart(2, "0")}</span> {ui.worksLabel}
          </p>
        </div>

        {/* role="list" preserva la semántica en Safari cuando CSS elimina el marcador. */}
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
        <ol className={styles.list} role="list">
          {research.map((item, index) => {
            const titleId = `research-${item.id}-title`;
            const dateTime = item.kind === "published" ? item.datePublished : item.dateCreated;

            return (
              <li key={item.id} className={styles.item}>
                <article id={item.id} className={styles.article} aria-labelledby={titleId}>
                  <span className={styles.numeral} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className={styles.content}>
                    <h3 id={titleId} className={styles.title}>
                      <cite lang={locale === "en" ? item.titleLanguage : undefined}>
                        {item.title}
                      </cite>
                    </h3>

                    <p className={styles.date}>
                      <time dateTime={dateTime}>{item.dateLabel}</time>
                    </p>

                    {item.kind === "published" && (
                      <p
                        className={styles.subtitle}
                        lang={locale === "en" ? item.titleLanguage : undefined}
                      >
                        {item.subtitle}
                      </p>
                    )}

                    <dl className={styles.metadata}>
                      <div className={styles.metadataRow}>
                        <dt>{item.authors.length === 1 ? ui.authorLabel : ui.authorsLabel}</dt>
                        <dd>{formatAuthors(item.authors, locale)}</dd>
                      </div>
                      <div className={styles.metadataRow}>
                        <dt>{ui.contextLabel}</dt>
                        <dd>{item.context}</dd>
                      </div>
                      {item.kind === "in-progress" && (
                        <div className={styles.metadataRow}>
                          <dt>{ui.backgroundLabel}</dt>
                          <dd>{item.academicBackground.join(" · ")}</dd>
                        </div>
                      )}
                      {item.kind === "published" && (
                        <div className={styles.metadataRow}>
                          <dt>{ui.recognitionLabel}</dt>
                          <dd>{item.recognition}</dd>
                        </div>
                      )}
                    </dl>

                    <p className={styles.summary}>{item.summary}</p>

                    {item.kind === "published" && (
                      <SectionLink
                        href={item.link.href}
                        external
                        opensInNewTabLabel={ui.opensInNewTab}
                        className={styles.link}
                      >
                        {item.link.label}
                      </SectionLink>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}
