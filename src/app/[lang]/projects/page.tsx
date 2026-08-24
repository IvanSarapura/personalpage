import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import ProjectsGrid from "@/components/ProjectsGrid/ProjectsGrid";
import { hasLocale, localePath } from "@/data/locale";
import { getUi } from "@/data/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const ui = getUi(lang).projectsPage;
  return {
    title: ui.title,
    description: ui.description,
    alternates: {
      canonical: localePath(lang, "/projects"),
      languages: {
        en: "/projects",
        es: "/es/projects",
        "x-default": "/projects",
      },
    },
  };
}

export default async function ProjectsPage({ params }: PageProps<"/[lang]/projects">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const ui = getUi(lang).projectsPage;

  return (
    <main id="main-content" tabIndex={-1}>
      <Section variant="surface" paddingY="lg" ariaLabel={ui.title}>
        <Container>
          <h1 className="mb-[var(--element-gap-sm)] text-[length:var(--heading-1)] leading-[var(--heading-1-lh)] font-normal tracking-[var(--heading-1-tracking)] text-[var(--section-text)] md:mb-[var(--element-gap)] md:text-[length:var(--display-2)] md:leading-[var(--display-2-lh)] md:tracking-[var(--display-2-tracking)]">
            {ui.title}
          </h1>

          <p className="mb-[var(--content-gap)] max-w-[var(--content-max-text)] text-[length:var(--body)] leading-[var(--body-lh)] font-normal tracking-[var(--letter-spacing-snug)] text-[var(--section-text-secondary)] md:mb-[var(--section-gap)] md:text-[length:var(--body-large)] md:leading-[var(--body-large-lh)]">
            {ui.intro}
          </p>

          <ProjectsGrid locale={lang} />
        </Container>
      </Section>
    </main>
  );
}
