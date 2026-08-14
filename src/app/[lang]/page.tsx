import { notFound } from "next/navigation";
import LeadSection from "@/components/LeadSection/LeadSection";
import Hero from "@/components/Hero/Hero";
import SignalsSection from "@/components/SignalsSection/SignalsSection";
import StatsSection from "@/components/StatsSection/StatsSection";
import CTABand from "@/components/CTABand/CTABand";
import { hasLocale } from "@/data/locale";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <main id="main-content">
      <LeadSection locale={lang} />
      <SignalsSection locale={lang} />
      <Hero locale={lang} />
      <StatsSection locale={lang} />
      <CTABand locale={lang} />
    </main>
  );
}
