import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import { getStats } from "@/data/signals";
import { getUi } from "@/data/ui";
import type { Locale } from "@/data/locale";
import styles from "./StatsSection.module.css";

interface StatsSectionProps {
  locale: Locale;
}

export default function StatsSection({ locale }: StatsSectionProps) {
  const ui = getUi(locale);
  const stats = getStats(locale);

  return (
    <Section
      variant="blue"
      paddingY="lg"
      ariaLabel={ui.stats.ariaLabel}
      className={styles.statsSection}
    >
      <Container>
        <div className={styles.header}>
          <h2 className={styles.headline}>{ui.stats.heading}</h2>
          <p className={styles.subheadline}>{ui.stats.subheading}</p>
        </div>

        {/* role="list" intencional: Safari descarta la semántica de lista con list-style:none. */}
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
        <ul className={styles.grid} role="list">
          {stats.map((stat) => (
            <li key={stat.label} className={styles.card}>
              <span className={styles.value}>{stat.value}</span>
              <span className={styles.label}>{stat.label}</span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
