import { notFound } from "next/navigation";
import LeadSection from "@/components/LeadSection/LeadSection";
import SelectedWorkSection from "@/components/SelectedWorkSection/SelectedWorkSection";
import CurrentWorkSection from "@/components/CurrentWorkSection/CurrentWorkSection";
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
      <SelectedWorkSection locale={lang} />
      <CurrentWorkSection locale={lang} />
      <StatsSection locale={lang} />
      <CTABand locale={lang} />
    </main>
  );
}
