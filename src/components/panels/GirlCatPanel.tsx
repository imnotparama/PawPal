import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { AmbientShapes } from "@/components/AmbientShapes";

const headlineWords = ["Hold", "them", "closer."];
const gradientWords = ["closer."];
const gradientStyle: React.CSSProperties = {
  background: "linear-gradient(95deg, #d4c5ff 0%, #8052ff 60%, #6038dd 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: 400
};

const stats = [
  { display: "SCIENCE", label: "Peer-reviewed literature" },
  { display: "EMPATHY", label: "Designed for pet parents" },
  { display: "24/7", label: "Real-time triage assistance" },
];

export function GirlCatPanel() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%', backgroundColor: '#000000' }}>
      <AmbientShapes seed={33} count={45} />
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
        {/* Main violet atmosphere behind the figure */}
        <div style={{
          position: 'absolute',
          right: '-10%',
          top: '0%',
          width: '80%',
          height: '100%',
          background: 'radial-gradient(ellipse 70% 80% at 70% 50%, rgba(128,82,255,0.18) 0%, rgba(80,48,180,0.08) 40%, transparent 70%)',
        }} />
        {/* Amber warmth at the top of the figure */}
        <div style={{
          position: 'absolute',
          right: '10%',
          top: '-20%',
          width: '50%',
          height: '60%',
          background: 'radial-gradient(ellipse 60% 60% at 60% 40%, rgba(255,184,41,0.08) 0%, transparent 70%)',
        }} />
        {/* Deep bottom shadow for grounding */}
        <div style={{
          position: 'absolute',
          right: '0%',
          bottom: '-10%',
          width: '70%',
          height: '50%',
          background: 'radial-gradient(ellipse 70% 50% at 60% 80%, rgba(60,20,120,0.15) 0%, transparent 70%)',
        }} />
      </div>

      {/* Text block */}
      <div
        data-panel-content
        className="ml-[6vw] w-[88vw] md:w-[40vw] flex flex-col justify-center relative z-10"
        style={{
          minHeight: "100vh",
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
            fontSize: "clamp(32px, 5vw, 64px)",
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
          className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-10"
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
                <div className="hidden sm:block w-[1px] h-12 bg-white/10 self-center" />
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
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent("scrollToPanel", { detail: { panel: 3 } }));
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
