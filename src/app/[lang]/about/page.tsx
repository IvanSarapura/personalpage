import type { Metadata } from "next";
import { notFound } from "next/navigation";

import AboutProfile from "@/components/AboutProfile/AboutProfile";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import { getAboutMetadata, getAboutProfile } from "@/data/about";
import { hasLocale, localePath } from "@/data/locale";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const metadata = getAboutMetadata(lang);
  return {
    title: metadata.title,
    description: metadata.description,
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

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const profile = getAboutProfile(lang);

  return (
    <main id="main-content" tabIndex={-1}>
      <Section variant="elevated" paddingY="none" as="section" ariaLabelledBy="about-profile-title">
        <Container>
          <AboutProfile locale={lang} profile={profile} />
        </Container>
      </Section>
    </main>
  );
}
