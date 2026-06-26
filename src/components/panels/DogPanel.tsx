import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

const bullets = [
  "Vaccination schedules — auto-tracked.",
  "Symptom triage without the panic.",
  "Weight, mood, appetite — quietly observed.",
];

const headlineWords = ["A", "vet", "in", "your", "pocket."];

export function DogPanel() {
  return (
    <div className="relative w-full h-full">
      {/* Radial glow behind text */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          zIndex: 0,
          top: 0,
          right: 0,
          bottom: 0,
          width: "55%",
          background: "radial-gradient(ellipse 50% 60% at 80% 50%, rgba(128,82,255,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Text block — right half only */}
      <div
        data-panel-content
        className="relative z-10"
        style={{
          paddingLeft: "50vw",
          paddingRight: "64px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
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
            fontSize: "clamp(48px, 7vw, 96px)",
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
              {word}
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
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="inline-flex items-center justify-center transition-all duration-200"
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
            See How It Works
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
