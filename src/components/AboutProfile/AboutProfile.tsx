import { Badge } from "@/components/ui/badge";
import { ABOUT_SECTION_IDS, type AboutProfileData } from "@/data/about";
import { type Locale } from "@/data/locale";
import styles from "./AboutProfile.module.css";

interface AboutProfileProps {
  locale: Locale;
  profile: AboutProfileData;
}

export default function AboutProfile({ profile }: AboutProfileProps) {
  return (
    <div className={styles.profile}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{profile.eyebrow}</p>
          <h1 id="about-profile-title" className={styles.title}>
            {profile.title}
          </h1>
          <div className={styles.introduction}>
            {profile.introduction.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <section className={styles.translation} aria-labelledby="about-translation-title">
          <div className={styles.sectionIntro}>
            <h2 id="about-translation-title">{profile.translation.heading}</h2>
            <p>{profile.translation.description}</p>
          </div>
          {/* role="list" preserves semantics in Safari when CSS removes markers. */}
          {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
          <ol className={styles.translationSteps} role="list">
            {profile.translation.steps.map((step) => (
              <li key={step.term}>
                <strong>{step.term}</strong>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>
      </header>

      <div className={styles.bodyGrid}>
        <nav className={styles.index} aria-label={profile.index.label}>
          <p>{profile.index.label}</p>
          {/* role="list" preserves semantics in Safari when CSS removes markers. */}
          {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
          <ul role="list">
            {profile.index.items.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.content}>
          <section
            id={ABOUT_SECTION_IDS.method}
            className={styles.contentSection}
            aria-labelledby="about-method-title"
          >
            <div className={styles.sectionIntro}>
              <h2 id="about-method-title">{profile.principles.heading}</h2>
              <p>{profile.principles.description}</p>
            </div>
            {/* role="list" preserves semantics in Safari when CSS removes markers. */}
            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
            <ol className={styles.principles} role="list">
              {profile.principles.items.map((principle, index) => (
                <li key={principle.title}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{principle.title}</h3>
                    <p>{principle.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section
            id={ABOUT_SECTION_IDS.formation}
            className={styles.contentSection}
            aria-labelledby="about-formation-title"
          >
            <div className={styles.sectionIntro}>
              <h2 id="about-formation-title">{profile.formation.heading}</h2>
              <p>{profile.formation.description}</p>
            </div>
            <div className={styles.formationGrid}>
              <div>
                <h3>{profile.formation.educationHeading}</h3>
                {profile.formation.groups.map((group) => (
                  <section key={group.title} className={styles.formationGroup}>
                    <h4>{group.title}</h4>
                    <ul>
                      {group.items.map((item) => (
                        <li key={item.name}>
                          <strong>{item.name}</strong>
                          <p>{item.detail}</p>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
              <div className={styles.stackColumn}>
                <h3>{profile.formation.stackHeading}</h3>
                {profile.formation.stackGroups.map((group) => (
                  <section key={group.title} className={styles.stackGroup}>
                    <h4>{group.title}</h4>
                    {/* role="list" preserves semantics in Safari when CSS removes markers. */}
                    {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
                    <ul className={styles.stackList} role="list">
                      {group.items.map((technology) => (
                        <li key={technology}>
                          <Badge variant="emphasis" translate="no">
                            {technology}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
