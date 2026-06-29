import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { AmbientShapes } from "@/components/AmbientShapes";

const bullets = [
  "Vaccination schedules — auto-tracked.",
  "Symptom triage without the panic.",
  "Weight, mood, appetite — quietly observed.",
];

const headlineWords = ["A", "vet", "in", "your", "pocket."];
const gradientWords = ["your", "pocket."];
const gradientStyle: React.CSSProperties = {
  background: "linear-gradient(95deg, #d4c5ff 0%, #8052ff 60%, #6038dd 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: 400
};

export function DogPanel() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%', backgroundColor: '#000000' }}>
      <AmbientShapes seed={22} count={45} />
      {/* Background depth layers */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {/* Main violet atmosphere left/center where dog stands */}
        <div style={{
          position: 'absolute',
          left: '-10%',
          top: '0%',
          width: '85%',
          height: '100%',
          background: 'radial-gradient(ellipse 75% 80% at 40% 50%, rgba(128,82,255,0.16) 0%, rgba(80,48,180,0.07) 45%, transparent 70%)',
        }} />
        {/* Amber crown glow at top of dog */}
        <div style={{
          position: 'absolute',
          left: '25%',
          top: '-20%',
          width: '45%',
          height: '55%',
          background: 'radial-gradient(ellipse 55% 55% at 50% 30%, rgba(255,184,41,0.09) 0%, transparent 70%)',
        }} />
        {/* Purple ground shadow at bottom */}
        <div style={{
          position: 'absolute',
          left: '5%',
          bottom: '-10%',
          width: '65%',
          height: '45%',
          background: 'radial-gradient(ellipse 65% 50% at 40% 80%, rgba(60,20,120,0.12) 0%, transparent 70%)',
        }} />
      </div>

      {/* Dark scrim overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "50%",
          height: "100%",
          zIndex: 1,
          pointerEvents: "none",
          background: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 30%)",
        }}
      />

      {/* Text block */}
      <div
        data-panel-content
        className="ml-[6vw] w-[88vw] md:ml-[55vw] md:w-[40vw] flex flex-col justify-center relative z-10"
        style={{
          minHeight: "100vh",
        }}
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            color: "#8052ff",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          For every species. Every breed. Every quirk.
        </motion.p>

        {/* Headline — staggered words */}
        <h2
          style={{
            fontSize: "clamp(36px, 7vw, 96px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            fontWeight: 300,
            color: "#ffffff",
          }}
        >
          {headlineWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
              style={{ display: "inline-block", marginRight: "0.25em" }}
            >
              {gradientWords.includes(word) ? (
                <span style={gradientStyle}>{word}</span>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </h2>

        {/* Body text */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            marginTop: 24,
            marginBottom: 16,
            fontSize: 15,
            lineHeight: 1.6,
            color: "#bdbdbd",
            maxWidth: 380,
          }}
        >
          Upload a photo of a rash, paste a vet&apos;s report, ask why your
          dog won&apos;t eat. PawPal threads it all into a single, growing
          portrait of your animal.
        </motion.p>

        {/* Bullets — 6px plum squares */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {bullets.map((line, i) => (
            <motion.div
              key={line}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
              style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  backgroundColor: "#8052ff",
                  flexShrink: 0,
                  marginTop: 7,
                }}
              />
              <span style={{ fontSize: 16, color: "#ffffff", fontWeight: 400 }}>
                {line}
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.9 }}
          style={{ marginTop: 32 }}
        >
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent("scrollToPanel", { detail: { panel: 2 } }));
            }}
            className="inline-flex items-center justify-center transition-all duration-200 cursor-pointer"
            style={{
              padding: "14px 24px",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              backgroundColor: "transparent",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#ffffff",
              borderRadius: "24px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#8052ff";
              e.currentTarget.style.color = "#8052ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              e.currentTarget.style.color = "#ffffff";
            }}
          >
            Next Page
          </button>
        </motion.div>
      </div>
    </div>
  );
}
