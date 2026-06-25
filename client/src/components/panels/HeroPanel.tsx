import { Link } from "react-router-dom";
import { AmbientShapes } from "@/components/AmbientShapes";
import { MagneticButton } from "@/components/MagneticButton";

export function HeroPanel() {
  return (
    <div className="relative w-full h-full flex items-center">
      <AmbientShapes seed={11} count={55} />
      {/* Text overlaps with the particles — Dala style */}
      <div data-panel-content className="relative z-10 pl-10 lg:pl-16 xl:pl-20 max-w-[42%]">
        <h1
          data-reveal data-reveal-delay="0.05"
          className="text-bone"
          style={{
            fontSize: "clamp(60px, 9vw, 130px)",
            lineHeight: 0.92,
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

        <div data-reveal data-reveal-delay="0.25" className="mt-10 max-w-[400px]">
          <p
            className="text-amber-spark"
            style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
          >
            Stop guessing. Start caring.
          </p>
          <p className="mt-3 text-ash" style={{ fontSize: 14, lineHeight: 1.6 }}>
            PawPal AI quietly listens to every vaccine, every vet note, every
            symptom — and answers the next question before you think to ask it.
          </p>
        </div>

        <div data-reveal data-reveal-delay="0.4" className="mt-8">
          <MagneticButton strength={0.2}>
            <Link
              to="/app"
              className="dala-btn-primary glow-btn inline-flex items-center justify-center rounded-3xl"
              style={{ padding: "12px 22px", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}
            >
              Request Access
            </Link>
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
