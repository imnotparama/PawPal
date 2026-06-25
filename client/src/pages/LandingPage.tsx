import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { DogSection } from "@/components/DogSection";
import { GirlCatSection } from "@/components/GirlCatSection";
import { Footer } from "@/components/Footer";
import { CursorGlow } from "@/components/CursorGlow";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-void text-bone font-acronym overflow-x-hidden">
      <CursorGlow />
      <Navigation />
      <HeroSection />
      <DogSection />
      <GirlCatSection />
      <Footer />
    </main>
  );
}
