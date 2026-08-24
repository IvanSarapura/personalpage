import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import { PROJECTS, getProject } from "@/data/projects";
import { hasLocale, localePath, LOCALES } from "@/data/locale";
import { getUi } from "@/data/ui";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import SectionLink from "@/components/SectionLink/SectionLink";

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

const sectionHeadingClass =
  "mb-[var(--element-gap-sm)] text-[length:var(--heading-2)] leading-[var(--heading-2-lh)] font-semibold tracking-[var(--heading-2-tracking)] text-[var(--section-text)]";

const bodyClass =
  "text-[length:var(--body)] leading-[var(--body-lh)] font-normal text-[var(--section-text-secondary)] md:text-[length:var(--body-large)] md:leading-[var(--body-large-lh)]";

const linkClass = buttonVariants({
  variant: "link",
  size: "sm",
  className: "px-0 py-0 text-[length:var(--body)]",
});

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
    <main id="main-content" tabIndex={-1}>
      <Section variant="surface" paddingY="lg" ariaLabel={project.title}>
        <Container>
          <div className="mx-auto max-w-[var(--content-max-text)]">
            <Link href={localePath(lang, "/projects")} className={linkClass}>
              {ui.backToProjects}
            </Link>

            <p className="mt-[var(--content-gap)] text-[length:var(--caption)] leading-[var(--caption-lh)] font-medium tracking-[var(--letter-spacing-wide)] text-[var(--section-text-secondary)]">
              {project.num} · {project.status}
            </p>

            <h1 className="mt-[var(--space-2)] mb-[var(--element-gap-sm)] text-[length:var(--heading-1)] leading-[var(--heading-1-lh)] font-normal tracking-[var(--heading-1-tracking)] text-[var(--section-text)] md:mb-[var(--element-gap)] md:text-[length:var(--display-2)] md:leading-[var(--display-2-lh)] md:tracking-[var(--display-2-tracking)]">
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
                  <li key={chip}>
                    <Badge variant="emphasis">{chip}</Badge>
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
                <SectionLink
                  href={project.links.demo}
                  external
                  opensInNewTabLabel={ui.opensInNewTab}
                >
                  {ui.liveDemo}
                </SectionLink>
              )}
              {project.links.repo && (
                <SectionLink
                  href={project.links.repo}
                  external
                  opensInNewTabLabel={ui.opensInNewTab}
                >
                  {ui.repo}
                </SectionLink>
              )}
              {project.links.paper && (
                <SectionLink
                  href={project.links.paper}
                  external
                  opensInNewTabLabel={ui.opensInNewTab}
                >
                  {ui.paper}
                </SectionLink>
              )}
              <SectionLink href={`${localePath(lang, "/")}#contact`}>{ui.getInTouch}</SectionLink>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
