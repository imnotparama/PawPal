import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

const headlineWords = ["Hold", "them", "closer."];

const stats = [
  { display: "12k+", label: "PETS ONBOARDED" },
  { display: "98%", label: "OWNERS CALMER" },
  { display: "24/7", label: "AI STANDBY" },
];

export function GirlCatPanel() {
  return (
    <div className="relative w-full h-full" style={{ overflow: "hidden" }}>
      {/* Radial glow behind text — left side */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          zIndex: 0,
          top: 0,
          left: 0,
          bottom: 0,
          width: "50%",
          background: "radial-gradient(ellipse 50% 60% at 20% 50%, rgba(128,82,255,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Text block — left half, vertically centered */}
      <div
        data-panel-content
        className="relative z-10"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "0 0 0 64px",
          maxWidth: 480,
        }}
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            color: "#8052ff",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          The bond is the product.
        </motion.p>

        {/* Headline — staggered */}
        <h2
          style={{
            fontSize: "clamp(40px, 5vw, 64px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            fontWeight: 300,
            color: "#ffffff",
          }}
        >
          {headlineWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 24 }}
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
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            marginTop: 16,
            fontSize: 15,
            lineHeight: 1.6,
            color: "#bdbdbd",
            maxWidth: 380,
          }}
        >
          Grounded in peer-reviewed veterinary literature and a panel of
          practicing vets — so the time you spend with your pet is spent
          loving them, not Googling them.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{ display: "flex", alignItems: "flex-start", gap: 32, marginTop: 40 }}
        >
          {stats.map((stat, i) => (
            <div key={stat.label} style={{ display: "flex", alignItems: "flex-start", gap: 32 }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 32, fontWeight: 600, color: "#ffffff" }}>
                  {stat.display}
                </span>
                <span style={{ fontSize: 11, fontWeight: 400, color: "#9a9a9a", letterSpacing: "0.05em", textTransform: "uppercase", marginTop: 4 }}>
                  {stat.label}
                </span>
              </div>
              {i < stats.length - 1 && (
                <div style={{ width: 1, height: 48, backgroundColor: "rgba(255,255,255,0.12)", alignSelf: "center" }} />
              )}
            </div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 1.0 }}
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
            Read The Science
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
