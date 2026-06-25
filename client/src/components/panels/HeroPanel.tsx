import { Link } from "react-router-dom";
import { AmbientShapes } from "@/components/AmbientShapes";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { MagneticButton } from "@/components/MagneticButton";

function Stat({ n, label }: { n: React.ReactNode; label: string }) {
  return (
    <div className="dala-stat">
      <div className="text-bone" style={{ fontSize: 22, fontWeight: 300, letterSpacing: "-0.02em" }}>
        {n}
      </div>
      <div className="text-smoke mt-1" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </div>
    </div>
  );
}

export function HeroPanel() {
  return (
    <div className="relative w-full h-full flex items-center">
      <AmbientShapes seed={11} count={50} />

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-smoke animate-pulse z-20">
        <span style={{ fontSize: 12, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Scroll to explore
        </span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-plum-voltage">
          <path d="M4 10 L16 10 M12 6 L16 10 L12 14" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-10 w-full z-10">
        <div className="max-w-[520px] pawpal-fade-up">
          <div className="flex items-center gap-2 mb-8">
            <span className="block w-1.5 h-1.5 rounded-full bg-plum-voltage pawpal-pulse-dot" />
            <span className="text-amber-spark" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Stop guessing. Start caring.
            </span>
          </div>

          <h1 className="text-bone" style={{ fontSize: "clamp(48px, 7vw, 96px)", lineHeight: 0.88, letterSpacing: "-0.04em", fontWeight: 200 }}>
            Your pet&apos;s
            <br />
            health,
            <br />
            <span className="hero-gradient-text" style={{ fontWeight: 300, fontStyle: "italic" }}>
              answered.
            </span>
          </h1>

          <p className="mt-8 text-ash max-w-[440px]" style={{ fontSize: 16, lineHeight: 1.55, letterSpacing: "0.015em" }}>
            PawPal AI quietly listens to every vaccine, every vet note, every
            symptom — and answers the next question before you think to ask it.
          </p>

          <div className="mt-10 flex items-center gap-4 flex-wrap">
            <MagneticButton strength={0.25}>
              <Link to="/app" className="dala-btn-primary glow-btn inline-flex items-center justify-center rounded-3xl" style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Meet PawPal
              </Link>
            </MagneticButton>
            <MagneticButton strength={0.2}>
              <a href="#" className="dala-btn-outline-amber inline-flex items-center justify-center rounded-3xl" style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Watch demo
              </a>
            </MagneticButton>
          </div>

          <div className="mt-12 flex items-center gap-6 text-smoke">
            <Stat n={<AnimatedCounter end={12} suffix="k+" />} label="Pets onboarded" />
            <div className="w-px h-8 bg-white/10" />
            <Stat n={<AnimatedCounter end={98} suffix="%" />} label="Owners calmer" />
            <div className="w-px h-8 bg-white/10" />
            <Stat n="24/7" label="AI standby" />
          </div>
        </div>
      </div>
    </div>
  );
}
