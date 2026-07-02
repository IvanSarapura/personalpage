import Navbar from "@/components/Navbar/Navbar";
import LeadSection from "@/components/LeadSection/LeadSection";
import Hero from "@/components/Hero/Hero";
import SignalsSection from "@/components/SignalsSection/SignalsSection";
import StatsSection from "@/components/StatsSection/StatsSection";
import CTABand from "@/components/CTABand/CTABand";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <LeadSection />
        <Hero />
        <SignalsSection />
        <StatsSection />
        <CTABand />
      </main>
      <Footer />
    </>
  );
}
