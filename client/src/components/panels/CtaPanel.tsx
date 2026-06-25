import { Link } from "react-router-dom";
import { AmbientShapes } from "@/components/AmbientShapes";
import { MagneticButton } from "@/components/MagneticButton";
import { LogoMark } from "@/components/LogoMark";

export function CtaPanel() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AmbientShapes seed={77} count={60} exclusionRadius={0.15} />
      <div className="absolute left-0 top-[10%] bottom-[10%] w-px bg-white/5" />

      {/* Radial glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 50% 50% at center, rgba(128,82,255,0.08) 0%, transparent 70%)" }}
      />

      <div data-panel-content className="relative text-center max-w-[700px] px-6 z-10">
        <div data-reveal data-reveal-delay="0" className="flex justify-center mb-8">
          <LogoMark />
        </div>

        <h2 data-reveal data-reveal-delay="0.1" className="text-bone" style={{ fontSize: "clamp(40px, 6vw, 78px)", lineHeight: 0.9, letterSpacing: "-0.04em", fontWeight: 200 }}>
          Ready to hold
          <br />
          them closer?
        </h2>

        <p data-reveal data-reveal-delay="0.25" className="mt-8 text-ash mx-auto max-w-[480px]" style={{ fontSize: 16, lineHeight: 1.6 }}>
          Join thousands of pet owners who stopped worrying and started
          understanding. PawPal AI is free to start.
        </p>

        <div data-reveal data-reveal-delay="0.4" className="mt-12 flex items-center justify-center gap-4 flex-wrap">
          <MagneticButton strength={0.3}>
            <Link to="/app" className="dala-btn-primary glow-btn inline-flex items-center justify-center rounded-3xl" style={{ padding: "18px 28px", fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Create your pet profile
            </Link>
          </MagneticButton>
          <MagneticButton strength={0.2}>
            <Link to="/app" className="dala-btn-ghost rounded-3xl inline-flex items-center justify-center" style={{ padding: "18px 28px", fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Sign in
            </Link>
          </MagneticButton>
        </div>

        <div data-reveal data-reveal-delay="0.55" className="mt-16 flex items-center justify-center gap-8">
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a key={l} href="#" className="dala-nav-link" style={{ fontSize: 13, letterSpacing: "0.021em" }}>
              {l}
            </a>
          ))}
        </div>

        <p data-reveal data-reveal-delay="0.6" className="mt-6 text-smoke" style={{ fontSize: 12, letterSpacing: "0.02em" }}>
          © 2026 PawPal AI — built quietly, for the loud ones at home.
        </p>
      </div>
    </div>
  );
}
