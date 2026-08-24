import { notFound } from "next/navigation";
import LeadSection from "@/components/LeadSection/LeadSection";
import ResearchSection from "@/components/ResearchSection/ResearchSection";
import SignalsSection from "@/components/SignalsSection/SignalsSection";
import TrackRecordSection from "@/components/TrackRecordSection/TrackRecordSection";
import CurrentWorkSection from "@/components/CurrentWorkSection/CurrentWorkSection";
import SelectedWorkSection from "@/components/SelectedWorkSection/SelectedWorkSection";
import CTABand from "@/components/CTABand/CTABand";
import { hasLocale } from "@/data/locale";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <main id="main-content" tabIndex={-1}>
      <LeadSection locale={lang} />
      <ResearchSection locale={lang} />
      <SignalsSection locale={lang} />
      <TrackRecordSection locale={lang} />
      <CurrentWorkSection locale={lang} />
      <SelectedWorkSection locale={lang} />
      <CTABand locale={lang} />
    </main>
  );
}
