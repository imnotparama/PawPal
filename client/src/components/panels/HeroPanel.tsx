import { Link } from "react-router-dom";
import { AmbientShapes } from "@/components/AmbientShapes";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { MagneticButton } from "@/components/MagneticButton";

function Stat({ n, label }: { n: React.ReactNode; label: string }) {
  return (
    <div className="dala-stat">
      <div className="text-bone" style={{ fontSize: 24, fontWeight: 300, letterSpacing: "-0.02em" }}>
        {n}
      </div>
      <div className="text-smoke mt-1.5" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </div>
    </div>
  );
}

export function HeroPanel() {
  return (
    <div className="relative w-full h-full flex items-center">
      <AmbientShapes seed={11} count={50} />

      {/* Subtle grid lines in background */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none hero-grid-bg" />

      {/* Scroll hint — pinned at bottom center */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-smoke animate-pulse z-20" data-reveal data-reveal-delay="0.7">
        <span style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Scroll to explore
        </span>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-plum-voltage">
          <path d="M4 10 L16 10 M12 6 L16 10 L12 14" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Text LEFT — vertically centered with proper top offset for nav */}
      <div data-panel-content className="relative z-10 pl-12 lg:pl-24 xl:pl-32 max-w-[48%]" style={{ paddingTop: "72px" }}>
        <div className="max-w-[500px]">
          <div className="flex items-center gap-2.5 mb-10" data-reveal data-reveal-delay="0">
            <span className="block w-2 h-2 rounded-full bg-plum-voltage pawpal-pulse-dot" />
            <span className="text-amber-spark" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Stop guessing. Start caring.
            </span>
          </div>

          <h1 data-reveal data-reveal-delay="0.1" className="text-bone" style={{ fontSize: "clamp(48px, 7vw, 96px)", lineHeight: 0.9, letterSpacing: "-0.04em", fontWeight: 200 }}>
            Your pet&apos;s
            <br />
            health,
            <br />
            <span className="hero-gradient-text" style={{ fontWeight: 300, fontStyle: "italic" }}>
              answered.
            </span>
          </h1>

          <p data-reveal data-reveal-delay="0.2" className="mt-10 text-ash max-w-[420px]" style={{ fontSize: 16, lineHeight: 1.6, letterSpacing: "0.01em" }}>
            PawPal AI quietly listens to every vaccine, every vet note, every
            symptom — and answers the next question before you think to ask it.
          </p>

          <div data-reveal data-reveal-delay="0.3" className="mt-12 flex items-center gap-5 flex-wrap">
            <MagneticButton strength={0.25}>
              <Link to="/app" className="dala-btn-primary glow-btn inline-flex items-center justify-center rounded-3xl" style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Meet PawPal
              </Link>
            </MagneticButton>
            <MagneticButton strength={0.2}>
              <a href="#" className="dala-btn-outline-amber inline-flex items-center justify-center rounded-3xl" style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Watch demo
              </a>
            </MagneticButton>
          </div>

          <div data-reveal data-reveal-delay="0.45" className="mt-16 flex items-center gap-8">
            <Stat n={<AnimatedCounter end={12} suffix="k+" />} label="Pets onboarded" />
            <div className="w-px h-9 bg-white/10" />
            <Stat n={<AnimatedCounter end={98} suffix="%" />} label="Owners calmer" />
            <div className="w-px h-9 bg-white/10" />
            <Stat n="24/7" label="AI standby" />
          </div>
        </div>
      </div>
    </div>
  );
}
