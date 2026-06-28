import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect, useRef, type MouseEvent } from "react";
import { useAuth } from "@/lib/auth";
import { usePets } from "@/hooks/usePets";
import { useVaccinations } from "@/hooks/useVaccinations";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { useChat } from "@/hooks/useChat";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function HealthArc({ score }: { score: number | null }) {
  const numericScore = score !== null ? score : 0;
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setProgress(numericScore), 100);
    return () => clearTimeout(timer);
  }, [numericScore]);
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <div style={{ position: "relative", width: 60, height: 60 }}>
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r={radius} fill="none" stroke="rgba(128,82,255,0.1)" strokeWidth="4" />
          {score !== null && (
            <circle cx="30" cy="30" r={radius} fill="none" stroke="#8052ff" strokeWidth="4" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 1s ease-out", transform: "rotate(-90deg)", transformOrigin: "center" }} />
          )}
        </svg>
        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: score !== null ? "#8052ff" : "#9a9a9a" }}>
          {score !== null ? `${score}%` : "—"}
        </span>
      </div>
      {score === null && (
        <span style={{ fontSize: 11, color: "#9a9a9a", marginTop: 8 }}>Add pets to calculate</span>
      )}
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
  const { user } = useAuth();
  const { pets } = usePets();
  const { vaccinations } = useVaccinations();
  const { records } = useMedicalRecords();
  const { messages } = useChat();

  const [firstName, setFirstName] = useState("there");

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        const fullName = currentUser?.user_metadata?.full_name;
        const name = fullName?.split(' ')[0] ?? currentUser?.email?.split('@')[0] ?? 'there';
        setFirstName(name);
      } catch (err) {
        console.error("Error fetching user name:", err);
      }
    }
    fetchUser();
  }, []);

  const upcomingVaccines = vaccinations.filter((v) => v.status === "Upcoming");
  const aiConversations = messages.filter((m) => m.role === "user").length;

  const overdueCount = vaccinations.filter((v) => v.status === "Upcoming" && new Date(v.date) < new Date()).length;
  const healthScore = pets.length === 0 ? null : Math.max(60, 100 - (overdueCount * 10));

  const stats = [
    { label: "TOTAL PETS", value: pets.length, highlight: false },
    { label: "UPCOMING VACCINES", value: upcomingVaccines.length, highlight: false },
    { label: "AI CONVERSATIONS", value: aiConversations, highlight: false },
    { label: "HEALTH SCORE", value: healthScore, highlight: true },
  ];

  // Recent activity: last 4 records + vaccinations sorted by created_at
  const recentActivity = [
    ...vaccinations.map((v) => ({ text: `${v.pets?.name || "Pet"}'s vaccination: ${v.vaccine_name}`, time: v.created_at, date: v.created_at })),
    ...records.map((r) => ({ text: `${r.pets?.name || "Pet"}: ${r.title}`, time: r.created_at, date: r.created_at })),
  ]
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    .slice(0, 4)
    .map((item) => ({
      text: item.text,
      time: item.time ? getRelativeTime(new Date(item.time)) : "",
    }));

  return (
    <div>
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        style={{ fontSize: 32, fontWeight: 300, color: "#ffffff", marginBottom: 4 }}
      >
        Welcome back, <span style={{ color: '#8052ff' }}>{firstName}</span>.
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
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "20px 24px", borderBottom: s.highlight ? "2px solid #8052ff" : undefined, overflow: "hidden", position: "relative" }}
          >
            <p style={{ fontSize: 12, fontWeight: 400, color: "#9a9a9a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>{s.label}</p>
            {s.highlight ? (
              <HealthArc score={s.value} />
            ) : (
              <p
                style={{
                  fontSize: 36,
                  fontWeight: 600,
                  color: s.value > 0 ? "#ffffff" : "#9a9a9a",
                }}
              >
                {s.value}
              </p>
            )}
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
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: 24 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: "#ffffff" }}>Your Pets</h2>
              <Link to="/app/pets" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer", textDecoration: "none" }}>Add Pet +</Link>
            </div>
            {pets.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 160, padding: "24px 0" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="rgba(128,82,255,0.3)">
                  <circle cx="7.5" cy="5.5" r="1.5" />
                  <circle cx="12" cy="4" r="1.5" />
                  <circle cx="16.5" cy="5.5" r="1.5" />
                  <circle cx="4.5" cy="9.5" r="1.2" />
                  <circle cx="19.5" cy="9.5" r="1.2" />
                  <path d="M12 20c-3.5 0-5.5-2.5-5.5-5 0-2 2-3.5 5.5-3.5s5.5 1.5 5.5 3.5c0 2.5-2 5-5.5 5z" />
                </svg>
                <h3 style={{ fontSize: 16, fontWeight: 500, color: "#ffffff", marginTop: 12, fontFamily: "'Space Grotesk', sans-serif" }}>
                  No pets added yet
                </h3>
                <p style={{ fontSize: 13, color: "#9a9a9a", marginTop: 6, textAlign: "center" }}>
                  Add your first pet to start tracking their health
                </p>
                <div style={{ marginTop: 16 }}>
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(128,82,255,0)",
                        "0 0 16px rgba(128,82,255,0.6)",
                        "0 0 0px rgba(128,82,255,0)"
                      ]
                    }}
                    transition={{
                      duration: 2.0,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{ borderRadius: "24px", overflow: "hidden" }}
                  >
                    <Link
                      to="/app/pets"
                      style={{
                        background: "#8052ff",
                        color: "#ffffff",
                        borderRadius: "24px",
                        padding: "10px 20px",
                        fontSize: 13,
                        fontWeight: 600,
                        textDecoration: "none",
                        display: "inline-block"
                      }}
                    >
                      Add Pet +
                    </Link>
                  </motion.div>
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(pets.length, 3)}, 1fr)`, gap: 16 }}>
                {pets.slice(0, 3).map((pet, i) => (
                  <motion.div
                    key={pet.id || pet.name}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 + i * 0.08 }}
                  >
                    <MagneticCard>
                      {pet.photo_url ? (
                        <img src={pet.photo_url} alt={pet.name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", margin: "0 auto 12px" }} />
                      ) : (
                        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #8052ff, #5030cc)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 18, fontWeight: 600, color: "#fff" }}>{pet.name?.[0] || "?"}</div>
                      )}
                      <p style={{ fontSize: 16, fontWeight: 600, color: "#ffffff" }}>{pet.name}</p>
                      <p style={{ fontSize: 13, color: "#9a9a9a", marginTop: 2 }}>{pet.breed}, {pet.age_years}y</p>
                      <span style={{ display: "inline-block", marginTop: 8, background: "rgba(128,82,255,0.2)", color: "#8052ff", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 500 }}>Healthy</span>
                    </MagneticCard>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.6 }}
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: 24 }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", marginBottom: 16 }}>Quick Actions</h2>
            <div style={{ display: "flex", gap: 12 }}>
              <motion.div
                animate={{ boxShadow: ["0 0 0px rgba(128,82,255,0)", "0 0 20px rgba(128,82,255,0.4)", "0 0 0px rgba(128,82,255,0)"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(128,82,255,0.6)" }}
                whileTap={{ scale: 0.97 }}
                style={{ borderRadius: 24 }}
              >
                <Link to="/app/chat" style={{ background: "#8052ff", color: "#fff", borderRadius: 24, padding: "12px 20px", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "block" }}>Ask AI a Question</Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03, borderColor: "#8052ff", boxShadow: "0 0 20px rgba(128,82,255,0.2)" }}
                whileTap={{ scale: 0.97 }}
                style={{ borderRadius: 24, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", overflow: "hidden", transition: "border-color 0.2s" }}
              >
                <Link to="/app/vaccinations" style={{ color: "#fff", padding: "11px 20px", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "block" }}>Add Vaccination</Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03, borderColor: "#8052ff", boxShadow: "0 0 20px rgba(128,82,255,0.2)" }}
                whileTap={{ scale: 0.97 }}
                style={{ borderRadius: 24, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", overflow: "hidden", transition: "border-color 0.2s" }}
              >
                <Link to="/app/records" style={{ color: "#fff", padding: "11px 20px", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "block" }}>Upload Record</Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Getting Started Checklist */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.7 }}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px",
              padding: 24,
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "#ffffff", marginBottom: 4, fontFamily: "'Space Grotesk', sans-serif" }}>Getting Started</h2>
            <p style={{ fontSize: 13, color: "#9a9a9a", marginBottom: 20 }}>Complete these steps to get the most from PawPal</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                {
                  text: "Add your first pet",
                  to: "/app/pets",
                  completed: pets.length > 0
                },
                {
                  text: "Log a vaccination",
                  to: "/app/vaccinations",
                  completed: vaccinations.length > 0
                },
                {
                  text: "Ask the AI a question",
                  to: "/app/chat",
                  completed: aiConversations > 0
                }
              ].map((item, index) => (
                <Link
                  key={index}
                  to={item.to}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <div
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.borderColor = "rgba(128,82,255,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.01)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 20px",
                      borderRadius: "12px",
                      background: "rgba(255,255,255,0.01)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      transition: "all 0.2s ease",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      {/* Checkbox circle */}
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          border: item.completed ? "1px solid #8052ff" : "1px solid rgba(255,255,255,0.2)",
                          background: "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0
                        }}
                      >
                        {item.completed && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="#8052ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 400, color: "#bdbdbd", fontFamily: "'Space Grotesk', sans-serif" }}>
                        {item.text}
                      </span>
                    </div>
                    
                    {/* Arrow */}
                    <span style={{ fontSize: 16, color: "#9a9a9a" }}>→</span>
                  </div>
                </Link>
              ))}
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
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: 24 }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", marginBottom: 16 }}>Upcoming Vaccinations</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {upcomingVaccines.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 0" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,184,41,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <path d="M12 14v4M10 16h4" />
                  </svg>
                  <p style={{ fontSize: 13, color: "#9a9a9a", marginTop: 8 }}>No upcoming vaccinations</p>
                </div>
              ) : (
                upcomingVaccines.slice(0, 2).map((v, i) => (
                  <div key={v.id || i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: i === 0 ? "#ff6b6b" : "#8052ff" }} />
                      <div>
                        <p style={{ fontSize: 14, color: "#ffffff" }}>{v.vaccine_name}</p>
                        <p style={{ fontSize: 12, color: "#9a9a9a" }}>{v.pets?.name || "Pet"}</p>
                      </div>
                    </div>
                    <span style={i === 0
                      ? { background: "rgba(255,80,80,0.1)", color: "#ff6b6b", borderRadius: 20, padding: "4px 12px", fontSize: 12, boxShadow: "0 0 8px rgba(255,80,80,0.3)" }
                      : { background: "rgba(128,82,255,0.15)", color: "#8052ff", borderRadius: 20, padding: "4px 12px", fontSize: 12 }
                    }>Due {v.date ? new Date(v.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.6 }}
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: 24 }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", marginBottom: 16 }}>Recent Activity</h2>
            <div>
              {recentActivity.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 0" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(128,82,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <p style={{ fontSize: 13, color: "#9a9a9a", marginTop: 8 }}>Activity will appear here</p>
                </div>
              ) : (
                recentActivity.map((item, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#8052ff", marginTop: 6, flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 13, color: "#ffffff" }}>{item.text}</p>
                        <p style={{ fontSize: 11, color: "#9a9a9a", marginTop: 2 }}>{item.time}</p>
                      </div>
                    </div>
                    {i < recentActivity.length - 1 && <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />}
                  </div>
                ))
              )}
              <Link to="/app/timeline" style={{ display: "block", marginTop: 12, fontSize: 13, color: "#8052ff", cursor: "pointer", textDecoration: "none" }}>View all →</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
