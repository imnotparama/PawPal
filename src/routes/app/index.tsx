import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect, useRef, type MouseEvent } from "react";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

const stats = [
  { label: "TOTAL PETS", value: "3", highlight: false },
  { label: "UPCOMING VACCINES", value: "2", highlight: false },
  { label: "AI CONVERSATIONS", value: "47", highlight: false },
  { label: "HEALTH SCORE", value: "92%", highlight: true },
];

const pets = [
  { name: "Luna", breed: "Golden Retriever", age: "3y", initial: "L" },
  { name: "Max", breed: "Labrador", age: "7y", initial: "M" },
  { name: "Milo", breed: "Persian Cat", age: "2y", initial: "Mi" },
];

const vaccinations = [
  { vaccine: "Rabies Booster", pet: "Luna", date: "Jul 12" },
  { vaccine: "DHPP Annual", pet: "Max", date: "Jul 28" },
];

const activity = [
  { text: "Luna's vaccination record updated — Rabies booster complete", time: "2 hours ago" },
  { text: "AI Chat: Discussed Max's dietary needs for senior dogs", time: "Yesterday" },
  { text: "Milo added to your pet profile — Welcome, Milo!", time: "3 days ago" },
  { text: "Health Score improved from 87% to 92%", time: "1 week ago" },
];

function HealthArc() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setProgress(92), 100);
    return () => clearTimeout(timer);
  }, []);
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <div style={{ position: "relative", width: 60, height: 60 }}>
      <svg width="60" height="60" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r={radius} fill="none" stroke="rgba(128,82,255,0.1)" strokeWidth="4" />
        <circle cx="30" cy="30" r={radius} fill="none" stroke="#8052ff" strokeWidth="4" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 1s ease-out", transform: "rotate(-90deg)", transformOrigin: "center" }} />
      </svg>
      <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: "#8052ff" }}>92%</span>
    </div>
  );
}

function MagneticCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });
  const [hovered, setHovered] = useState(false);

  const handleMouse = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) * 0.06;
    const dy = (e.clientY - rect.top - rect.height / 2) * 0.06;
    x.set(Math.max(-8, Math.min(8, dx)));
    y.set(Math.max(-8, Math.min(8, dy)));
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, borderColor: hovered ? "rgba(128,82,255,0.3)" : "rgba(255,255,255,0.08)", boxShadow: hovered ? "inset 0 0 30px rgba(128,82,255,0.08), 0 0 40px rgba(128,82,255,0.06)" : "none", transition: "border-color 0.2s, box-shadow 0.2s", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, cursor: "pointer", textAlign: "center" as const }}
      onMouseMove={handleMouse}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { x.set(0); y.set(0); setHovered(false); }}
    >
      {children}
    </motion.div>
  );
}

function Dashboard() {
  return (
    <div>
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        style={{ fontSize: 32, fontWeight: 300, color: "#ffffff", marginBottom: 4 }}
      >
        Welcome back, Parameshwaran.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
        style={{ fontSize: 15, color: "#9a9a9a", marginBottom: 32 }}
      >
        Here's what's happening with your pets today.
      </motion.p>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 + i * 0.1 }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(128,82,255,0.1)" }}
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 24px", borderBottom: s.highlight ? "2px solid #8052ff" : undefined, overflow: "hidden", position: "relative" }}
          >
            <p style={{ fontSize: 12, fontWeight: 400, color: "#9a9a9a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>{s.label}</p>
            {s.highlight ? <HealthArc /> : <p style={{ fontSize: 36, fontWeight: 600, color: "#ffffff" }}>{s.value}</p>}
          </motion.div>
        ))}
      </div>

      {/* Main Grid — 12 col */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Pet Cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.6 }}
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: "#ffffff" }}>Your Pets</h2>
              <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Add Pet +</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {pets.map((pet, i) => (
                <motion.div
                  key={pet.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 + i * 0.08 }}
                >
                  <MagneticCard>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #8052ff, #5030cc)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 18, fontWeight: 600, color: "#fff" }}>{pet.initial}</div>
                    <p style={{ fontSize: 16, fontWeight: 600, color: "#ffffff" }}>{pet.name}</p>
                    <p style={{ fontSize: 13, color: "#9a9a9a", marginTop: 2 }}>{pet.breed}, {pet.age}</p>
                    <span style={{ display: "inline-block", marginTop: 8, background: "rgba(128,82,255,0.2)", color: "#8052ff", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 500 }}>Healthy</span>
                  </MagneticCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.6 }}
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", marginBottom: 16 }}>Quick Actions</h2>
            <div style={{ display: "flex", gap: 12 }}>
              <motion.div
                animate={{ boxShadow: ["0 0 0px rgba(128,82,255,0)", "0 0 20px rgba(128,82,255,0.5)", "0 0 0px rgba(128,82,255,0)"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(128,82,255,0.7)" }}
                whileTap={{ scale: 0.97 }}
                style={{ borderRadius: 24 }}
              >
                <Link to="/app/chat" style={{ background: "#8052ff", color: "#fff", borderRadius: 24, padding: "12px 20px", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "block" }}>Ask AI a Question</Link>
              </motion.div>
              <Link to="/app/vaccinations" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 24, padding: "12px 20px", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Add Vaccination</Link>
              <Link to="/app/records" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 24, padding: "12px 20px", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Upload Record</Link>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Upcoming Vaccinations */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.6 }}
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", marginBottom: 16 }}>Upcoming Vaccinations</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {vaccinations.map((v, i) => (
                <div key={v.vaccine} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: i === 0 ? "#ff6b6b" : "#8052ff" }} />
                    <div>
                      <p style={{ fontSize: 14, color: "#ffffff" }}>{v.vaccine}</p>
                      <p style={{ fontSize: 12, color: "#9a9a9a" }}>{v.pet}</p>
                    </div>
                  </div>
                  <span style={i === 0
                    ? { background: "rgba(255,80,80,0.1)", color: "#ff6b6b", borderRadius: 20, padding: "4px 12px", fontSize: 12, boxShadow: "0 0 8px rgba(255,80,80,0.3)" }
                    : { background: "rgba(128,82,255,0.15)", color: "#8052ff", borderRadius: 20, padding: "4px 12px", fontSize: 12 }
                  }>Due {v.date}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.6 }}
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", marginBottom: 16 }}>Recent Activity</h2>
            <div>
              {activity.map((item, i) => (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#8052ff", marginTop: 6, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 13, color: "#ffffff" }}>{item.text}</p>
                      <p style={{ fontSize: 11, color: "#9a9a9a", marginTop: 2 }}>{item.time}</p>
                    </div>
                  </div>
                  {i < activity.length - 1 && <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />}
                </div>
              ))}
              <p style={{ marginTop: 12, fontSize: 13, color: "#8052ff", cursor: "pointer" }}>View all →</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
