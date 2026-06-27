import { Link } from "@tanstack/react-router";
import { AmbientShapes } from "@/components/AmbientShapes";
import { MagneticButton } from "@/components/MagneticButton";

export function CtaPanel() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AmbientShapes seed={77} count={50} exclusionRadius={0.12} />

      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        {/* Central violet convergence */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70%',
          height: '70%',
          background: 'radial-gradient(ellipse, rgba(128,82,255,0.1) 0%, transparent 65%)',
          filter: 'blur(60px)'
        }} />
      </div>

      <div data-panel-content className="relative text-center max-w-[600px] px-8" style={{ position: "relative", zIndex: 2 }}>
        <h2
          data-reveal data-reveal-delay="0.05"
          className="text-bone"
          style={{ fontSize: "clamp(40px, 6vw, 64px)", lineHeight: 1, letterSpacing: "-0.03em", fontWeight: 300 }}
        >
          Ready to{" "}
          <span style={{
            background: "linear-gradient(95deg, #d4c5ff 0%, #8052ff 60%, #6038dd 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 400
          }}>
            care smarter?
          </span>
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
