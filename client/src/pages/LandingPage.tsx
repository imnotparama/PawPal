import { Navigation } from "@/components/Navigation";
import { HorizontalScroll, HPanel } from "@/components/HorizontalScroll";
import { CursorGlow } from "@/components/CursorGlow";
import { ParticleMorph3D } from "@/components/ParticleMorph3D";
import { HeroPanel } from "@/components/panels/HeroPanel";
import { DogPanel } from "@/components/panels/DogPanel";
import { GirlCatPanel } from "@/components/panels/GirlCatPanel";
import { CtaPanel } from "@/components/panels/CtaPanel";

export function LandingPage() {
  return (
    <div className="bg-void text-bone font-acronym">
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
          <CtaPanel />
        </HPanel>
      </HorizontalScroll>
    </div>
  );
}
