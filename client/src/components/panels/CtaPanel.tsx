import { Link } from "react-router-dom";
import { AmbientShapes } from "@/components/AmbientShapes";
import { MagneticButton } from "@/components/MagneticButton";
import { LogoMark } from "@/components/LogoMark";

export function CtaPanel() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <AmbientShapes seed={77} count={70} exclusionRadius={0.12} />
      <div className="absolute left-0 top-[10%] bottom-[10%] w-px bg-white/5" />

      {/* === Multi-layered glow effects === */}

      {/* Large pulsing center glow */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none cta-glow-core"
        style={{
          width: "70vw",
          height: "70vh",
          left: "15vw",
          top: "15vh",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(128,82,255,0.18) 0%, rgba(128,82,255,0.06) 40%, transparent 70%)",
        }}
      />

      {/* Amber accent orb — top right */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none cta-glow-orb-1"
        style={{
          width: "40vw",
          height: "40vh",
          right: "-5vw",
          top: "-5vh",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(255,184,41,0.1) 0%, transparent 60%)",
        }}
      />

      {/* Lichen accent orb — bottom left */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none cta-glow-orb-2"
        style={{
          width: "35vw",
          height: "35vh",
          left: "-5vw",
          bottom: "-5vh",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(21,132,110,0.1) 0%, transparent 60%)",
        }}
      />

      {/* Plum ring glow — animated pulse */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none cta-ring-glow"
        style={{
          width: "50vw",
          height: "50vh",
          left: "25vw",
          top: "25vh",
          borderRadius: "50%",
          border: "1px solid rgba(128,82,255,0.15)",
          boxShadow: "0 0 80px 20px rgba(128,82,255,0.06), inset 0 0 60px 10px rgba(128,82,255,0.04)",
        }}
      />

      {/* Smaller inner ring */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none cta-ring-glow-inner"
        style={{
          width: "30vw",
          height: "30vh",
          left: "35vw",
          top: "35vh",
          borderRadius: "50%",
          border: "1px solid rgba(255,184,41,0.08)",
          boxShadow: "0 0 40px 10px rgba(255,184,41,0.03)",
        }}
      />

      {/* === Content === */}
      <div data-panel-content className="relative text-center max-w-[700px] px-6 z-10">
        <div data-reveal data-reveal-delay="0" className="flex justify-center mb-8">
          <div className="cta-logo-pulse">
            <LogoMark />
          </div>
        </div>

        <h2 data-reveal data-reveal-delay="0.1" className="text-bone" style={{ fontSize: "clamp(40px, 6vw, 78px)", lineHeight: 0.9, letterSpacing: "-0.04em", fontWeight: 200 }}>
          Ready to hold
          <br />
          <span className="hero-gradient-text">them closer?</span>
        </h2>

        <p data-reveal data-reveal-delay="0.25" className="mt-8 text-ash mx-auto max-w-[480px]" style={{ fontSize: 16, lineHeight: 1.6 }}>
          Join thousands of pet owners who stopped worrying and started
          understanding. PawPal AI is free to start.
        </p>

        <div data-reveal data-reveal-delay="0.4" className="mt-12 flex items-center justify-center gap-4 flex-wrap">
          <MagneticButton strength={0.3}>
            <Link to="/app" className="dala-btn-primary glow-btn cta-btn-enhanced inline-flex items-center justify-center rounded-3xl" style={{ padding: "18px 32px", fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
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
