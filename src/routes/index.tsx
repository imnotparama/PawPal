import { createFileRoute } from "@tanstack/react-router";
import { ParticleMorph3D } from "@/components/ParticleMorph3D";
import { CursorGlow } from "@/components/CursorGlow";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { HorizontalScroll, HPanel } from "@/components/HorizontalScroll";
import { HeroPanel } from "@/components/panels/HeroPanel";
import { DogPanel } from "@/components/panels/DogPanel";
import { GirlCatPanel } from "@/components/panels/GirlCatPanel";
import { AboutPanel } from "@/components/panels/AboutPanel";
import { CtaPanel } from "@/components/panels/CtaPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PawPal AI — Your pet's health, in the constellation" },
      {
        name: "description",
        content:
          "PawPal AI is the smart health companion for your pet. Vaccinations, records, AI chat — answered before you ask.",
      },
      {
        property: "og:title",
        content: "PawPal AI — Your pet's health, in the constellation",
      },
      {
        property: "og:description",
        content:
          "Smart, calm, always-on health companion for cats and dogs. Powered by AI.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="min-h-screen text-bone font-acronym relative" style={{ margin: 0, padding: 0, backgroundColor: '#000000' }}>
      <CursorGlow />
      <ParticleMorph3D />
      <Navigation />
      <HorizontalScroll>
        <HPanel>
          <HeroPanel />
        </HPanel>
        <HPanel>
          <DogPanel />
        </HPanel>
        <HPanel>
          <GirlCatPanel />
        </HPanel>
        <HPanel>
          <AboutPanel />
        </HPanel>
        <HPanel>
          <CtaPanel />
        </HPanel>
      </HorizontalScroll>
      <Footer />
    </main>
  );
}

