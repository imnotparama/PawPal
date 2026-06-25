import { AmbientShapes } from "@/components/AmbientShapes";
import { TiltCard } from "@/components/TiltCard";

function FeatureCard({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <TiltCard className="dala-card rounded-3xl p-6 bg-void/40 backdrop-blur-sm">
      <div className="text-plum-voltage" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
        {kicker}
      </div>
      <h3 className="mt-4 text-bone" style={{ fontSize: 22, lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 300 }}>
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

      <div data-panel-content className="relative mx-auto max-w-[1300px] px-6 lg:px-10 w-full z-10">
        <div className="max-w-[460px]">
          <span data-reveal data-reveal-delay="0" className="text-amber-spark" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            The bond is the product.
          </span>

          <h2 data-reveal data-reveal-delay="0.1" className="mt-5 text-bone" style={{ fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 0.92, letterSpacing: "-0.04em", fontWeight: 200 }}>
            Hold them
            <br />
            closer, with
            <br />
            <span className="text-plum-voltage" style={{ fontStyle: "italic" }}>
              fewer worries.
            </span>
          </h2>

          <p data-reveal data-reveal-delay="0.25" className="mt-6 text-ash max-w-[400px]" style={{ fontSize: 15, lineHeight: 1.55 }}>
            Grounded in peer-reviewed veterinary literature and a panel of
            practicing vets — so the time you spend with your pet is spent
            loving them, not Googling them.
          </p>
        </div>

        {/* Feature cards at bottom */}
        <div className="absolute bottom-8 left-6 right-6 lg:left-10 lg:right-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div data-reveal data-reveal-delay="0.35">
            <FeatureCard kicker="01 / Records" title="Every paper. Every scan." body="Drop in PDFs, photos — PawPal extracts dates, dosages, diagnoses." />
          </div>
          <div data-reveal data-reveal-delay="0.45">
            <FeatureCard kicker="02 / Chat" title="Ask anything, anytime." body="Answered with citations, not vibes. From rashes to kibble refusals." />
          </div>
          <div data-reveal data-reveal-delay="0.55">
            <FeatureCard kicker="03 / Timeline" title="A quiet, watchful history." body="Weight, mood, meals, milestones — observed as a soft constellation." />
          </div>
        </div>
      </div>
    </div>
  );
}
