import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ResearchIndex from "@/components/ResearchIndex/ResearchIndex";
import { hasLocale, localePath } from "@/data/locale";
import { buildResearchJsonLd, serializeJsonLd } from "@/data/structured-data";
import { getUi } from "@/data/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const ui = getUi(lang).research;

  return {
    title: ui.pageTitle,
    description: ui.pageDescription,
    alternates: {
      canonical: localePath(lang, "/research"),
      languages: {
        en: "/research",
        es: "/es/research",
        "x-default": "/research",
      },
    },
  };
}

export default async function ResearchPage({ params }: PageProps<"/[lang]/research">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildResearchJsonLd(lang)) }}
      />
      <main id="main-content">
        <ResearchIndex locale={lang} />
      </main>
    </>
  );
}
