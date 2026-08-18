import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import { localePath, type Locale } from "@/data/locale";
import { getRecognitions, type Recognition, type RecognitionEvidence } from "@/data/recognition";
import { getUi } from "@/data/ui";
import styles from "./TrackRecordSection.module.css";

const FEATURED_RECOGNITION_ID = "legalthon-uba-cardano";

interface TrackRecordSectionProps {
  locale: Locale;
}

interface EvidenceLinksProps {
  evidence: readonly RecognitionEvidence[];
  locale: Locale;
  opensInNewTab: string;
}

function EvidenceLinks({ evidence, locale, opensInNewTab }: EvidenceLinksProps) {
  return (
    // role="list" preserva la semántica en Safari cuando CSS elimina los marcadores.
    // eslint-disable-next-line jsx-a11y/no-redundant-roles
    <ul className={styles.actions} role="list">
      {evidence.map((item) => {
        const key = item.type === "internal" ? item.projectSlug : item.href;

        return (
          <li key={key}>
            {item.type === "internal" ? (
              <Link
                href={localePath(locale, `/projects/${item.projectSlug}`)}
                className={styles.actionLink}
              >
                <span>{item.label}</span>
                <ChevronRight aria-hidden="true" focusable="false" />
              </Link>
            ) : (
              <a
                href={item.href}
                className={styles.actionLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{item.label}</span> <span className="sr-only"> ({opensInNewTab})</span>
                <ExternalLink aria-hidden="true" focusable="false" />
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

interface RecordMetaProps {
  item: Recognition;
}

function RecordMeta({ item }: RecordMetaProps) {
  return (
    <div className={styles.meta}>
      <span>{item.eyebrow}</span>
      <time dateTime={String(item.year)}>{item.year}</time>
    </div>
  );
}

export default function TrackRecordSection({ locale }: TrackRecordSectionProps) {
  const ui = getUi(locale).stats;
  const recognitions = getRecognitions(locale);
  const featured = recognitions.find((item) => item.id === FEATURED_RECOGNITION_ID);
  const supporting = recognitions.filter((item) => item.id !== FEATURED_RECOGNITION_ID);

  if (!featured) {
    throw new Error(`Missing featured recognition: ${FEATURED_RECOGNITION_ID}`);
  }

  const headingId = "track-record-heading";
  const featuredTitleId = `track-record-${featured.id}`;

  return (
    <Section variant="blue" paddingY="lg" ariaLabelledBy={headingId}>
      <Container>
        <header className={styles.header}>
          <h2 id={headingId} className={styles.headline}>
            {ui.heading}
          </h2>
          <p className={styles.subheadline}>{ui.subheading}</p>
        </header>

        <div className={styles.evidenceBoard}>
          <article className={styles.featured} aria-labelledby={featuredTitleId}>
            <RecordMeta item={featured} />
            <p className={styles.featuredOutcome}>{featured.outcome}</p>
            <h3 id={featuredTitleId} className={styles.featuredTitle} lang={featured.titleLanguage}>
              {featured.title}
            </h3>
            <p className={styles.issuer}>{featured.issuer}</p>
            <p className={styles.featuredSummary}>{featured.summary}</p>
            <EvidenceLinks
              evidence={featured.evidence}
              locale={locale}
              opensInNewTab={ui.opensInNewTab}
            />
          </article>

          {/* role="list" preserva la semántica en Safari cuando CSS elimina los marcadores. */}
          {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
          <ul className={styles.supportingList} role="list">
            {supporting.map((item) => {
              const titleId = `track-record-${item.id}`;

              return (
                <li key={item.id} className={styles.supportingItem}>
                  <article className={styles.supportingArticle} aria-labelledby={titleId}>
                    <RecordMeta item={item} />
                    <p className={styles.supportingOutcome}>{item.outcome}</p>
                    <h3 id={titleId} className={styles.supportingTitle}>
                      {item.title}
                    </h3>
                    <p className={styles.issuer}>{item.issuer}</p>
                    <p className={styles.supportingSummary}>{item.summary}</p>
                    <EvidenceLinks
                      evidence={item.evidence}
                      locale={locale}
                      opensInNewTab={ui.opensInNewTab}
                    />
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
