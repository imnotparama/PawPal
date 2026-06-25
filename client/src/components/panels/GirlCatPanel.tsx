import { AmbientShapes } from "@/components/AmbientShapes";
import { ParticleConstellation } from "@/components/ParticleConstellation";
import { TiltCard } from "@/components/TiltCard";
import { GIRL_CAT_PATH } from "@/lib/silhouettes";

function FeatureCard({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <TiltCard className="dala-card rounded-3xl p-6 bg-void/40 backdrop-blur-sm">
      <div className="text-plum-voltage" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
        {kicker}
      </div>
      <h3 className="mt-4 text-bone" style={{ fontSize: 20, lineHeight: 1.15, letterSpacing: "-0.02em", fontWeight: 300 }}>
        {title}
      </h3>
      <p className="mt-3 text-smoke" style={{ fontSize: 13, lineHeight: 1.55, letterSpacing: "0.02em" }}>
        {body}
      </p>
    </TiltCard>
  );
}

export function GirlCatPanel() {
  return (
    <div className="relative w-full h-full flex items-center">
      <AmbientShapes seed={53} count={44} />
      <div className="absolute left-0 top-[10%] bottom-[10%] w-px bg-white/5" />

      {/* Constellation RIGHT */}
      <div className="absolute right-[5%] top-[8%] bottom-[8%] w-[48%] dala-constellation-wrap">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none constellation-glow" />
        <ParticleConstellation
          pathD={GIRL_CAT_PATH}
          count={2800}
          className="absolute inset-0 dala-constellation-surface"
          ariaLabel="Girl and cat constellation"
        />
      </div>

      {/* Text LEFT */}
      <div data-panel-content className="relative z-10 pl-12 lg:pl-24 xl:pl-32 max-w-[46%]">
        <div className="max-w-[440px]">
          <span data-reveal data-reveal-delay="0" className="text-amber-spark" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            The bond is the product.
          </span>

          <h2 data-reveal data-reveal-delay="0.1" className="mt-5 text-bone" style={{ fontSize: "clamp(36px, 5vw, 60px)", lineHeight: 0.92, letterSpacing: "-0.04em", fontWeight: 200 }}>
            Hold them
            <br />
            closer, with
            <br />
            <span className="text-plum-voltage" style={{ fontStyle: "italic" }}>
              fewer worries.
            </span>
          </h2>

          <p data-reveal data-reveal-delay="0.25" className="mt-6 text-ash max-w-[380px]" style={{ fontSize: 15, lineHeight: 1.55 }}>
            Grounded in peer-reviewed veterinary literature and a panel of
            practicing vets — so the time you spend with your pet is spent
            loving them, not Googling them.
          </p>

          <div className="mt-10 space-y-4">
            <div data-reveal data-reveal-delay="0.35">
              <FeatureCard kicker="01 / Records" title="Every paper. Every scan." body="Drop in PDFs, photos — PawPal extracts dates, dosages, diagnoses." />
            </div>
            <div data-reveal data-reveal-delay="0.45">
              <FeatureCard kicker="02 / Chat" title="Ask anything, anytime." body="Answered with citations, not vibes." />
            </div>
            <div data-reveal data-reveal-delay="0.55">
              <FeatureCard kicker="03 / Timeline" title="A quiet, watchful history." body="Weight, mood, meals, milestones." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
