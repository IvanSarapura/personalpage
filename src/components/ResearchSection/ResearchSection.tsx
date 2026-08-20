import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import SectionLink from "@/components/SectionLink/SectionLink";
import { localePath, type Locale } from "@/data/locale";
import { getResearch } from "@/data/research";
import { getUi } from "@/data/ui";
import styles from "./ResearchSection.module.css";

interface ResearchSectionProps {
  locale: Locale;
}

const HOME_RESEARCH_LIMIT = 2;

export default function ResearchSection({ locale }: ResearchSectionProps) {
  const ui = getUi(locale).research;
  const featuredResearch = getResearch(locale).slice(0, HOME_RESEARCH_LIMIT);
  const headingId = "research-heading";

  return (
    <Section variant="blue" paddingY="lg" ariaLabelledBy={headingId} id="research">
      <Container>
        <header className={styles.header}>
          <h2 id={headingId} className={styles.heading}>
            {ui.heading}
          </h2>
          <p className={styles.subheading}>{ui.subheading}</p>
        </header>

        {/* role="list" preserva la semántica en Safari cuando CSS elimina el marcador. */}
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
        <ul className={styles.list} role="list">
          {featuredResearch.map((item, index) => {
            const titleId = `featured-research-${item.id}`;
            const dateTime = item.kind === "published" ? item.datePublished : item.dateCreated;

            return (
              <li key={item.id} className={styles.item}>
                <article className={styles.article} aria-labelledby={titleId}>
                  <span className={styles.numeral} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 id={titleId} className={styles.title}>
                    <cite lang={locale === "en" ? item.titleLanguage : undefined}>
                      {item.title}
                    </cite>
                  </h3>

                  <p className={styles.date}>
                    <time dateTime={dateTime}>{item.dateLabel}</time>
                  </p>

                  <p className={styles.preview}>{item.preview}</p>
                </article>
              </li>
            );
          })}
        </ul>

        <div className={styles.archiveLink}>
          <SectionLink href={localePath(locale, "/research")}>{ui.allResearch}</SectionLink>
        </div>
      </Container>
    </Section>
  );
}
