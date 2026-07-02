import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import { STATS } from "@/data/signals";
import styles from "./StatsSection.module.css";

export default function StatsSection() {
  return (
    <Section
      variant="blue"
      paddingY="lg"
      ariaLabel="Platform statistics"
      className={styles.statsSection}
    >
      <Container>
        <div className={styles.header}>
          <h2 className={styles.headline}>Built to scale with your business</h2>
          <p className={styles.subheadline}>
            From data ingestion to actionable intelligence — Sira handles complexity so you
            don&apos;t have to.
          </p>
        </div>

        {/* role="list" intencional: Safari descarta la semántica de lista con list-style:none. */}
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
        <ul className={styles.grid} role="list">
          {STATS.map((stat) => (
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
