import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import { PROJECTS, getProject } from "@/data/projects";
import { hasLocale, localePath, LOCALES } from "@/data/locale";
import { getUi } from "@/data/ui";

type CaseStudyPageProps = PageProps<"/[lang]/projects/[slug]">;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => PROJECTS.map((project) => ({ lang, slug: project.slug })));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};

  const project = getProject(slug, lang);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: localePath(lang, `/projects/${project.slug}`),
      languages: {
        en: `/projects/${project.slug}`,
        es: `/es/projects/${project.slug}`,
        "x-default": `/projects/${project.slug}`,
      },
    },
  };
}

const chipClass =
  "inline-block rounded-[var(--radius-full)] bg-[var(--accent-surface-subtle)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--caption)] leading-[var(--caption-lh)] font-medium tracking-[var(--letter-spacing-wide)] text-[var(--accent-emphasis)]";

const sectionHeadingClass =
  "mb-[var(--element-gap-sm)] text-[length:var(--heading-2)] leading-[var(--heading-2-lh)] font-semibold tracking-[var(--heading-2-tracking)] text-[var(--text-on-light)]";

const bodyClass =
  "text-[length:var(--body-large)] leading-[var(--body-large-lh)] font-normal text-[var(--text-on-light)] opacity-[var(--opacity-strong)] max-[768px]:text-[length:var(--body)] max-[768px]:leading-[var(--body-lh)]";

const linkClass =
  "text-[length:var(--body)] font-medium tracking-[var(--letter-spacing-wide)] text-[var(--text-on-light)] underline underline-offset-4 [transition:var(--transition-hover)] hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--color-blue-screen)]";

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const project = getProject(slug, lang);
  if (!project) notFound();

  const ui = getUi(lang).caseStudy;

  const caseSections = [
    { title: ui.origin, body: project.origin },
    { title: ui.mechanism, body: project.mechanism },
    { title: ui.future, body: project.future },
  ];

  return (
    <main id="main-content">
      <Section variant="white" paddingY="lg" ariaLabel={project.title}>
        <Container>
          <div className="mx-auto max-w-[var(--content-max-text)]">
            <Link href={localePath(lang, "/projects")} className={linkClass}>
              {ui.backToProjects}
            </Link>

            <p className="mt-[var(--content-gap)] text-[length:var(--caption)] leading-[var(--caption-lh)] font-medium tracking-[var(--letter-spacing-wide)] text-[var(--text-on-light)] opacity-[var(--opacity-subtle)]">
              {project.num} · {project.status}
            </p>

            <h1 className="mt-[var(--space-2)] mb-[var(--element-gap-sm)] text-[length:var(--display-2)] leading-[var(--display-2-lh)] font-normal tracking-[var(--display-2-tracking)] text-[var(--text-on-light)] max-[768px]:text-[length:var(--heading-1)] max-[768px]:leading-[var(--heading-1-lh)] max-[768px]:tracking-[var(--heading-1-tracking)]">
              {project.title}
            </h1>

            <p className={`${bodyClass} mb-[var(--element-gap)]`}>{project.tagline}</p>

            {project.award && (
              <p className="mb-[var(--element-gap)] text-[length:var(--body)] leading-[var(--body-lh)] font-semibold tracking-[var(--letter-spacing-wide)] text-[var(--accent-emphasis)]">
                🏆 {project.award}
              </p>
            )}

            {(project.stack.length > 0 || project.tags.length > 0) && (
              <ul
                className="m-0 mb-[var(--content-gap)] flex list-none flex-wrap gap-[var(--space-2)] p-0"
                aria-label={ui.stackAndTagsAriaLabel}
              >
                {[...project.stack, ...project.tags].map((chip) => (
                  <li key={chip} className={chipClass}>
                    {chip}
                  </li>
                ))}
              </ul>
            )}

            {caseSections.map((section) => (
              <section key={section.title} className="mb-[var(--content-gap)]">
                <h2 className={sectionHeadingClass}>{section.title}</h2>
                <p className={bodyClass}>{section.body}</p>
              </section>
            ))}

            <div className="flex flex-wrap items-center gap-[var(--space-5)]">
              {project.links.demo && (
                <a href={project.links.demo} className={linkClass} target="_blank" rel="noopener">
                  {ui.liveDemo}
                </a>
              )}
              {project.links.repo && (
                <a href={project.links.repo} className={linkClass} target="_blank" rel="noopener">
                  {ui.repo}
                </a>
              )}
              {project.links.paper && (
                <a
                  href={project.links.paper}
                  className={linkClass}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${ui.paper} (${ui.opensInNewTab})`}
                >
                  {ui.paper}
                </a>
              )}
              <Link href={`${localePath(lang, "/")}#contact`} className={linkClass}>
                {ui.getInTouch}
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
