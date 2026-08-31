import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import { getAbout, STACK } from "@/data/about";
import { hasLocale, localePath } from "@/data/locale";
import { getUi } from "@/data/ui";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const ui = getUi(lang).aboutPage;
  return {
    title: ui.title,
    description: ui.description,
    alternates: {
      canonical: localePath(lang, "/about"),
      languages: {
        en: "/about",
        es: "/es/about",
        "x-default": "/about",
      },
    },
  };
}

const headingClass =
  "mb-[var(--element-gap)] text-[length:var(--heading-2)] leading-[var(--heading-2-lh)] font-semibold tracking-[var(--heading-2-tracking)] text-[var(--section-text)]";

const bodyClass =
  "text-[length:var(--body)] leading-[var(--body-lh)] font-normal text-[var(--section-text-secondary)] md:text-[length:var(--body-large)] md:leading-[var(--body-large-lh)]";

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const ui = getUi(lang).aboutPage;
  const about = getAbout(lang);

  return (
    <main id="main-content" tabIndex={-1}>
      <Section variant="elevated" paddingY="lg" ariaLabel={ui.ariaLabel}>
        <Container>
          <div className="mx-auto max-w-[var(--content-max-text)]">
            <h1 className="mb-[var(--element-gap-sm)] text-[length:var(--heading-1)] leading-[var(--heading-1-lh)] font-normal tracking-[var(--heading-1-tracking)] text-[var(--section-text)] md:mb-[var(--element-gap)] md:text-[length:var(--display-2)] md:leading-[var(--display-2-lh)] md:tracking-[var(--display-2-tracking)]">
              {ui.title}
            </h1>

            <div className="mb-[var(--section-gap)] flex flex-col gap-[var(--element-gap)]">
              {about.bio.map((paragraph) => (
                <p key={paragraph} className={bodyClass}>
                  {paragraph}
                </p>
              ))}
            </div>

            <section className="mb-[var(--section-gap)]" aria-labelledby="journey-heading">
              <h2 id="journey-heading" className={headingClass}>
                {ui.journey}
              </h2>
              <ol className="m-0 flex list-none flex-col gap-[var(--element-gap)] border-l-[length:var(--border-width-thin)] border-solid border-[color:var(--section-border-decorative)] p-0 pl-[var(--content-gap)]">
                {about.timeline.map((entry) => (
                  <li key={entry.title} className="flex flex-col gap-[var(--space-1)]">
                    <span className="text-[length:var(--caption)] leading-[var(--caption-lh)] font-medium tracking-[var(--letter-spacing-wide)] text-[var(--section-text-secondary)]">
                      {entry.period}
                    </span>
                    <div className="flex flex-wrap items-center gap-[var(--space-3)]">
                      <h3 className="text-[length:var(--heading-3)] leading-[var(--heading-3-lh)] font-semibold tracking-[var(--heading-3-tracking)] text-[var(--section-text)]">
                        {entry.title}
                      </h3>
                      {entry.badge && <Badge variant="emphasis">{entry.badge}</Badge>}
                    </div>
                    <p className="text-[length:var(--body)] leading-[var(--body-lh)] font-normal text-[var(--section-text-secondary)]">
                      {entry.detail}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="mb-[var(--section-gap)]" aria-labelledby="education-heading">
              <h2 id="education-heading" className={headingClass}>
                {ui.education}
              </h2>
              <div className="flex flex-col gap-[var(--content-gap)]">
                {about.education.map((category) => (
                  <div key={category.title}>
                    <h3 className="mb-[var(--element-gap-sm)] text-[length:var(--heading-3)] leading-[var(--heading-3-lh)] font-semibold tracking-[var(--heading-3-tracking)] text-[var(--section-text)]">
                      {category.title}
                    </h3>
                    <ul className="m-0 flex list-none flex-col gap-[var(--element-gap-sm)] p-0">
                      {category.items.map((item) => (
                        <li key={item.name} className="flex flex-col gap-[var(--space-1)]">
                          <span className="text-[length:var(--body)] leading-[var(--body-lh)] font-medium text-[var(--section-text)]">
                            {item.name}
                          </span>
                          <span className="text-[length:var(--body)] leading-[var(--body-lh)] font-normal text-[var(--section-text-secondary)]">
                            {item.detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="stack-heading">
              <h2 id="stack-heading" className={headingClass}>
                {ui.stack}
              </h2>
              <ul className="m-0 flex list-none flex-wrap gap-[var(--space-2)] p-0">
                {STACK.map((tech) => (
                  <li key={tech}>
                    <Badge variant="emphasis">{tech}</Badge>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </Container>
      </Section>
    </main>
  );
}
