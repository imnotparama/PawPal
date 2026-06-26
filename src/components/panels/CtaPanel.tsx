import { Link } from "@tanstack/react-router";
import { AmbientShapes } from "@/components/AmbientShapes";
import { MagneticButton } from "@/components/MagneticButton";

export function CtaPanel() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AmbientShapes seed={77} count={50} exclusionRadius={0.12} />

      {/* Subtle center glow */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none cta-glow-core"
        style={{
          width: "60vw", height: "60vh", left: "20vw", top: "20vh",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(128,82,255,0.12) 0%, transparent 65%)",
        }}
      />

      <div data-panel-content className="relative text-center max-w-[600px] px-8 z-10">
        <h2
          data-reveal data-reveal-delay="0.05"
          className="text-bone"
          style={{
            fontSize: "clamp(44px, 7vw, 88px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            fontWeight: 300,
          }}
        >
          Ready to
          <br />
          start caring?
        </h2>

        <p data-reveal data-reveal-delay="0.2" className="mt-8 text-ash mx-auto max-w-[420px]" style={{ fontSize: 15, lineHeight: 1.65 }}>
          Join thousands of pet owners who stopped worrying and started
          understanding. PawPal AI is free to start.
        </p>

        <div data-reveal data-reveal-delay="0.35" className="mt-10 flex items-center justify-center gap-4">
          <MagneticButton strength={0.3}>
            <Link to="/login" className="dala-btn-primary glow-btn inline-flex items-center justify-center rounded-3xl" style={{ padding: "16px 28px", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Create your pet profile
            </Link>
          </MagneticButton>
          <MagneticButton strength={0.2}>
            <Link to="/login" className="dala-btn-ghost rounded-3xl inline-flex items-center justify-center" style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Sign in
            </Link>
          </MagneticButton>
        </div>

        <div data-reveal data-reveal-delay="0.5" className="mt-14 flex items-center justify-center gap-8">
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a key={l} href="#" className="dala-nav-link" style={{ fontSize: 12, letterSpacing: "0.02em" }}>{l}</a>
          ))}
        </div>
        <p data-reveal data-reveal-delay="0.55" className="mt-4 text-smoke" style={{ fontSize: 11 }}>
          © 2026 PawPal AI
        </p>
      </div>
    </div>
  );
}
