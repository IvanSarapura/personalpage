import { Badge } from "@/components/ui/badge";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import { ABOUT_SECTION_IDS, type AboutProfileData } from "@/data/about";
import styles from "./AboutProfile.module.css";

interface AboutProfileProps {
  profile: AboutProfileData;
}

export default function AboutProfile({ profile }: AboutProfileProps) {
  return (
    <>
      <Section variant="elevated" paddingY="none" ariaLabelledBy="about-profile-title">
        <Container>
          <header className={styles.hero}>
            <div className={styles.heroCopy}>
              <h1 id="about-profile-title" className={styles.title}>
                {profile.title}
              </h1>
              <div className={styles.introduction}>
                {profile.introduction.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className={styles.indexGrid}>
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
            </div>
          </header>
        </Container>
      </Section>

      <Section
        variant="elevated"
        paddingY="none"
        id={ABOUT_SECTION_IDS.method}
        ariaLabelledBy="about-method-title"
      >
        <Container>
          <div className={`${styles.sectionFrame} ${styles.sectionFrameWithDivider}`}>
            <div className={`${styles.sectionContent} ${styles.principlesSection}`}>
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
            </div>
          </div>
        </Container>
      </Section>

      <Section
        variant="brand"
        paddingY="none"
        id={ABOUT_SECTION_IDS.formation}
        ariaLabelledBy="about-formation-title"
      >
        <Container>
          <div className={styles.sectionFrame}>
            <div className={`${styles.sectionContent} ${styles.formationSection}`}>
              <div className={styles.sectionIntro}>
                <h2 id="about-formation-title">{profile.formation.heading}</h2>
                <p>{profile.formation.description}</p>
              </div>
              <div>
                <h3>{profile.formation.educationHeading}</h3>
                {profile.formation.groups.map((group) => (
                  <section key={group.title} className={styles.formationGroup}>
                    <h4>{group.title}</h4>
                    <ul>
                      {group.items.map((item) => (
                        <li key={item.title}>
                          <strong>{item.title}</strong>
                          <span className={styles.formationInstitution}>{item.institution}</span>
                          <p>{item.detail}</p>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section
        variant="elevated"
        paddingY="none"
        id={ABOUT_SECTION_IDS.stack}
        ariaLabelledBy="about-stack-title"
      >
        <Container>
          <div className={styles.sectionFrame}>
            <div className={`${styles.sectionContent} ${styles.formationSection}`}>
              <div className={styles.sectionIntro}>
                <h2 id="about-stack-title">{profile.formation.stackHeading}</h2>
                <p>{profile.formation.stackDescription}</p>
              </div>
              <div className={styles.stackGroups}>
                {profile.formation.stackGroups.map((group) => (
                  <section key={group.title} className={styles.stackGroup}>
                    <h3>{group.title}</h3>
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
          </div>
        </Container>
      </Section>
    </>
  );
}
