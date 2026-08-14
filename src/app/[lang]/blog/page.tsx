import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogIndex from "@/components/BlogIndex/BlogIndex";
import { hasLocale, localePath } from "@/data/locale";
import { getUi } from "@/data/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const ui = getUi(lang).blog;
  return {
    title: ui.title,
    description: ui.description,
    alternates: {
      canonical: localePath(lang, "/blog"),
      languages: {
        en: "/blog",
        es: "/es/blog",
        "x-default": "/blog",
      },
    },
  };
}

export default async function BlogPage({ params }: PageProps<"/[lang]/blog">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <main id="main-content">
      <BlogIndex locale={lang} />
    </main>
  );
}
