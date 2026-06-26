import { Link } from "@tanstack/react-router";
import { AmbientShapes } from "@/components/AmbientShapes";
import { MagneticButton } from "@/components/MagneticButton";

export function CtaPanel() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AmbientShapes seed={77} count={50} exclusionRadius={0.12} />

      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          zIndex: 1,
          background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,0,0,0.5) 0%, transparent 100%)",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute pointer-events-none cta-glow-core"
        style={{
          width: "60vw", height: "60vh", left: "20vw", top: "20vh",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(128,82,255,0.12) 0%, transparent 65%)",
        }}
      />

      <div data-panel-content className="relative text-center max-w-[600px] px-8" style={{ position: "relative", zIndex: 2 }}>
        <h2
          data-reveal data-reveal-delay="0.05"
          className="text-bone"
          style={{ fontSize: "clamp(40px, 6vw, 64px)", lineHeight: 1, letterSpacing: "-0.03em", fontWeight: 300 }}
        >
          Ready to care smarter?
        </h2>

        <p data-reveal data-reveal-delay="0.15" className="mt-5 mx-auto max-w-[460px]" style={{ fontSize: 18, lineHeight: 1.5, color: "#bdbdbd", fontWeight: 400 }}>
          Join thousands of pet owners who never miss a vaccine, a symptom, or a vet note.
        </p>

        {/* CTA Buttons */}
        <div data-reveal data-reveal-delay="0.3" className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <MagneticButton strength={0.25}>
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              style={{
                padding: "16px 32px",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                backgroundColor: "#8052ff",
                color: "#ffffff",
                borderRadius: "24px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Get Started Free
            </Link>
          </MagneticButton>

          <MagneticButton strength={0.2}>
            <Link
              to="/auth"
              search={{ mode: "signin" }}
              className="transition-colors duration-200 hover:border-plum-voltage hover:text-plum-voltage"
              style={{
                padding: "16px 32px",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                backgroundColor: "transparent",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "24px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Sign In
            </Link>
          </MagneticButton>
        </div>

        {/* Trust line */}
        <p data-reveal data-reveal-delay="0.4" className="mt-6" style={{ fontSize: 12, color: "#9a9a9a", textAlign: "center" }}>
          No credit card required · Free forever plan available
        </p>
      </div>
    </div>
  );
}
