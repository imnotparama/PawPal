import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AmbientShapes } from "@/components/AmbientShapes";
import { MagneticButton } from "@/components/MagneticButton";
import { TrustBar } from "@/components/TrustBar";

const headlineWords = ["Your", "pet's", "health,", "reimagined."];
const gradientWords = ["health,", "reimagined."];

const gradientStyle: React.CSSProperties = {
  background: "linear-gradient(90deg, #ffffff 0%, #8052ff 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

export function HeroPanel() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="relative w-full h-full flex items-center">
      <AmbientShapes seed={11} count={55} />
      {/* Text overlaps with the particles — Dala style */}
      <div data-panel-content className="relative z-10 pl-10 lg:pl-16 xl:pl-20 max-w-[42%]">
        <h1
          data-reveal
          data-reveal-delay="0.05"
          className="text-bone"
          style={{
            fontSize: "clamp(60px, 9vw, 130px)",
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            fontWeight: 300,
          }}
        >
          {headlineWords.map((word, index) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
              style={{ display: "inline-block", marginRight: "0.25em" }}
            >
              {gradientWords.includes(word) ? (
                <span style={gradientStyle}>{word}</span>
              ) : (
                word
              )}
              {(word === "pet's" || word === "health,") && <br />}
            </motion.span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
          data-reveal
          data-reveal-delay="0.25"
          className="mt-10 max-w-[400px]"
        >
          <p
            className="text-amber-spark"
            style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
          >
            Stop guessing. Start caring.
          </p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 1.0 }}
            className="mt-3 text-ash"
            style={{ fontSize: 14, lineHeight: 1.6 }}
          >
            PawPal AI quietly listens to every vaccine, every vet note, every
            symptom — and answers the next question before you think to ask it.
          </motion.p>
        </motion.div>

        <div data-reveal data-reveal-delay="0.4" className="mt-8 flex items-center gap-4">
          <MagneticButton strength={0.2}>
            <Link
              to="/login"
              className="dala-btn-primary glow-btn inline-flex items-center justify-center rounded-3xl"
              style={{ padding: "12px 22px", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}
            >
              Request Access
            </Link>
          </MagneticButton>

          <button
            onClick={() => setShowDemo(true)}
            className="inline-flex items-center justify-center"
            style={{
              padding: "12px 22px",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              backgroundColor: "transparent",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#ffffff",
              borderRadius: "24px",
              cursor: "pointer",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#8052ff";
              e.currentTarget.style.color = "#8052ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
              e.currentTarget.style.color = "#ffffff";
            }}
          >
            Watch Demo
          </button>
        </div>

        <TrustBar />
      </div>

      {/* Demo Modal */}
      {showDemo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
          onClick={() => setShowDemo(false)}
        >
          <div
            className="relative bg-neutral-900 rounded-2xl p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDemo(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              style={{ fontSize: 20, lineHeight: 1, background: "none", border: "none", cursor: "pointer" }}
              aria-label="Close demo modal"
            >
              ✕
            </button>
            <p className="text-white text-center" style={{ fontSize: 16, fontWeight: 500 }}>
              Video demo coming soon
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
