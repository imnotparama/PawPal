import { motion } from "framer-motion";
import { AmbientShapes } from "@/components/AmbientShapes";

export function AboutPanel() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%', backgroundColor: '#000000' }}>
      <AmbientShapes seed={44} count={45} />
      
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
        {/* Main violet atmosphere left/center where shape stands */}
        <div style={{
          position: 'absolute',
          left: '-10%',
          top: '0%',
          width: '85%',
          height: '100%',
          background: 'radial-gradient(ellipse 75% 80% at 40% 50%, rgba(128,82,255,0.14) 0%, rgba(80,48,180,0.06) 45%, transparent 70%)',
        }} />
        {/* Amber crown glow */}
        <div style={{
          position: 'absolute',
          left: '20%',
          top: '-20%',
          width: '50%',
          height: '60%',
          background: 'radial-gradient(ellipse 60% 60% at 50% 30%, rgba(255,184,41,0.07) 0%, transparent 70%)',
        }} />
        {/* Purple ground shadow at bottom */}
        <div style={{
          position: 'absolute',
          left: '5%',
          bottom: '-10%',
          width: '65%',
          height: '45%',
          background: 'radial-gradient(ellipse 65% 50% at 40% 80%, rgba(60,20,120,0.1) 0%, transparent 70%)',
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

      {/* Text block — right half only */}
      <div
        data-panel-content
        style={{
          marginLeft: "55vw",
          width: "40vw",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
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
          About Us
        </motion.p>

        {/* Headline */}
        <h2
          style={{
            fontSize: "clamp(32px, 4vw, 52px)",
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            fontWeight: 300,
            color: "#ffffff",
          }}
        >
          Built by pet lovers,
          <br />
          <span style={{
            background: "linear-gradient(95deg, #d4c5ff 0%, #8052ff 60%, #6038dd 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 400
          }}>
            backed by science.
          </span>
        </h2>

        {/* Body text */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            marginTop: 20,
            fontSize: 15,
            lineHeight: 1.6,
            color: "#bdbdbd",
            maxWidth: 420,
          }}
        >
          PawPal was born out of a simple question: why is pet care so reactive?
          We are a team of veterinary researchers, data scientists, and designers
          obsessed with giving pets longer, healthier lives by transforming raw medical
          notes, vaccinations, and symptoms into proactive, life-saving insights.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          style={{ marginTop: 32 }}
        >
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent("scrollToPanel", { detail: { panel: 4 } }));
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
