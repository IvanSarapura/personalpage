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
    <main id="main-content">
      <Section variant="white" paddingY="lg" ariaLabel={ui.title}>
        <Container>
          <h1 className="mb-[var(--element-gap)] text-[length:var(--display-2)] leading-[var(--display-2-lh)] font-normal tracking-[var(--display-2-tracking)] text-[var(--text-on-light)] max-[768px]:mb-[var(--element-gap-sm)] max-[768px]:text-[length:var(--heading-1)] max-[768px]:leading-[var(--heading-1-lh)] max-[768px]:tracking-[var(--heading-1-tracking)]">
            {ui.title}
          </h1>

          <p className="mb-[var(--section-gap)] max-w-[var(--content-max-text)] text-[length:var(--body-large)] leading-[var(--body-large-lh)] font-normal tracking-[var(--letter-spacing-snug)] text-[var(--text-on-light)] opacity-[var(--opacity-strong)] max-[768px]:mb-[var(--content-gap)] max-[768px]:text-[length:var(--body)] max-[768px]:leading-[var(--body-lh)]">
            {ui.intro}
          </p>

          <ProjectsGrid locale={lang} />
        </Container>
      </Section>
    </main>
  );
}
