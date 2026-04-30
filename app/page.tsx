import Hero from "@/components/homepage/Hero";
import ServicesSection from "@/components/homepage/ServicesSection";
import GalleryShowcase from "@/components/homepage/GalleryShowcase";
import TikTokShowcase from "@/components/homepage/TikTokShowcase";
import PricingPreview from "@/components/homepage/PricingPreview";
import TestimonialsShowcase from "@/components/homepage/TestimonialsShowcase";
import HowItWorks from "@/components/homepage/HowItWorks";
import FinalCTA from "@/components/homepage/FinalCTA";
import FeatureRow from "@/components/homepage/FeatureRow";
import SectionWave from "@/components/homepage/SectionWave";
import FloatingCowgirl from "@/components/ui/FloatingCowgirl";

export default function Home() {
  return (
    <>
      <section id="home">
        <FloatingCowgirl />

        <Hero />
      </section>

      <SectionWave />

      <FeatureRow />

      <section id="services">
        <ServicesSection />
      </section>

      <section id="gallery">
        <GalleryShowcase />
      </section>

      <TikTokShowcase />

      <section id="pricing">
        <PricingPreview />
      </section>

      <TestimonialsShowcase />

      <section id="how-it-works">
        <HowItWorks />
      </section>

      <FinalCTA />
    </>
  );
}