import { Link } from "react-router-dom";
import { AmbientShapes } from "@/components/AmbientShapes";
import { MagneticButton } from "@/components/MagneticButton";

export function HeroPanel() {
  return (
    <div className="relative w-full h-full flex items-center">
      <AmbientShapes seed={11} count={30} />

      {/* Text LEFT — large bold Dala-style headline */}
      <div data-panel-content className="relative z-10 pl-12 lg:pl-20 xl:pl-28 max-w-[48%]">
        <h1
          data-reveal data-reveal-delay="0.05"
          className="text-bone"
          style={{
            fontSize: "clamp(56px, 8vw, 110px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            fontWeight: 300,
          }}
        >
          Your pet&apos;s
          <br />
          health,
          <br />
          reimagined.
        </h1>

        <div data-reveal data-reveal-delay="0.2" className="mt-10">
          <p
            className="text-amber-spark"
            style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}
          >
            Stop guessing. Start caring.
          </p>
          <p
            className="mt-4 text-ash max-w-[400px]"
            style={{ fontSize: 15, lineHeight: 1.6, letterSpacing: "0.01em" }}
          >
            PawPal AI quietly listens to every vaccine, every vet note, every
            symptom — and answers the next question before you think to ask it.
          </p>
        </div>

        <div data-reveal data-reveal-delay="0.35" className="mt-8">
          <MagneticButton strength={0.2}>
            <Link
              to="/app"
              className="dala-btn-primary glow-btn inline-flex items-center justify-center rounded-3xl"
              style={{ padding: "14px 24px", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}
            >
              Request Access
            </Link>
          </MagneticButton>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-smoke z-20 animate-pulse" data-reveal data-reveal-delay="0.6">
        <span style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>Scroll</span>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-plum-voltage">
          <path d="M4 10 L16 10 M12 6 L16 10 L12 14" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}
