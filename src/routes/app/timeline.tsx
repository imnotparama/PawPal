import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { usePets } from "@/hooks/usePets";
import { useVaccinations } from "@/hooks/useVaccinations";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";

export const Route = createFileRoute("/app/timeline")({
  component: TimelinePage,
});

const typeColors: Record<string, string> = {
  Checkup: "#8052ff",
  Illness: "#ff6b6b",
  Vaccination: "#ffb829",
  Surgery: "#ff4444",
  Treatment: "#ffb829",
  "New Pet": "#15846e",
  Consultation: "#4a9eff",
  Wellness: "#8052ff",
};

function TimelinePage() {
  const { pets } = usePets();
  const { vaccinations } = useVaccinations();
  const { records } = useMedicalRecords();
  const [filter, setFilter] = useState("All Pets");

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = "Health Timeline — PawPal AI";
    }
  }, []);

  const petFilters = ["All Pets", ...pets.map((p) => p.name)];

  const timeline = [
    ...vaccinations.map((v) => ({ ...v, event_type: "Vaccination", title: v.vaccine_name, pet: v.pets?.name })),
    ...records.map((r) => ({ ...r, event_type: r.record_type, title: r.title, pet: r.pets?.name })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filtered = filter === "All Pets" ? timeline : timeline.filter((e) => e.pet === filter);

  // Group events by year
  const groupedByYear: Record<number, typeof filtered> = {};
  filtered.forEach((event) => {
    const year = new Date(event.date).getFullYear();
    if (!groupedByYear[year]) {
      groupedByYear[year] = [];
    }
    groupedByYear[year].push(event);
  });

  const sortedYears = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a);

  // Simple pet color map
  const petColors: Record<string, string> = {};
  const colorPalette = ["rgba(128,82,255,0.8)", "rgba(255,184,41,0.8)", "rgba(21,132,110,0.8)", "rgba(74,158,255,0.8)", "rgba(255,107,107,0.8)"];
  pets.forEach((p, i) => { petColors[p.name] = colorPalette[i % colorPalette.length]; });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-start mb-8">
        <div>
          <h1 style={{ 
            fontSize: 36, 
            fontWeight: 300, 
            marginBottom: 4,
            background: "linear-gradient(90deg, #ffffff, #8052ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Health Timeline
          </h1>
          <p style={{ fontSize: 15, color: "#9a9a9a" }}>A chronological view of health events across all your pets.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 max-w-full -mx-6 px-6 sm:mx-0 sm:px-0 scrollbar-none">
          {petFilters.map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? "rgba(128,82,255,0.2)" : "rgba(255,255,255,0.05)", border: filter === f ? "1px solid #8052ff" : "1px solid rgba(255,255,255,0.08)", color: filter === f ? "#ffffff" : "#9a9a9a", borderRadius: 20, padding: "6px 16px", fontSize: 13, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}>{f}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: "center",
            padding: "48px 24px",
            background: "rgba(255,255,255,0.01)",
            border: "1px dashed rgba(255,255,255,0.15)",
            borderRadius: 24,
            maxWidth: 480,
            margin: "40px auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16
          }}
        >
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(128,82,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8052ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", marginBottom: 6 }}>No Health Timeline Events</h3>
            <p style={{ fontSize: 14, color: "#9a9a9a", maxWidth: 320, margin: "0 auto", lineHeight: 1.5 }}>
              Your unified chronological timeline compiles vaccinations and medical records logs automatically.
            </p>
          </div>
          <Link
            to="/app/records"
            style={{ background: "#8052ff", color: "#fff", border: "none", borderRadius: 20, padding: "10px 20px", fontSize: 13, fontWeight: 600, textDecoration: "none", cursor: "pointer", marginTop: 8 }}
          >
            Log First Health Event +
          </Link>
        </motion.div>
      ) : (
        <>
          {sortedYears.map((year) => (
            <div key={year} style={{ marginBottom: 32 }}>
              {/* Year label */}
              <div style={{
                background: "transparent",
                border: "none",
                color: "#9a9a9a",
                fontSize: "11px",
                fontWeight: 400,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                padding: 0,
                marginBottom: "12px",
                marginTop: 8
              }}>{year}</div>

              {/* Timeline */}
              <div className="relative pl-8 md:pl-[216px]">
                {/* Animated vertical line */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="timeline-connecting-line"
                  style={{ transformOrigin: "top" }}
                />

                {groupedByYear[year].map((event, i) => {
                  const color = typeColors[event.event_type] || "#8052ff";
                  const petColor = petColors[event.pet || ""] || "#9a9a9a";

                  return (
                    <motion.div
                      key={event.id || `${event.title}-${i}`}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.1 }}
                      style={{ position: "relative", marginBottom: 24 }}
                    >
                      {/* Dot */}
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: [0, 1.3, 1] }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="absolute left-[-25px] md:left-[-41px] top-[22px] w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ border: `1px solid ${color}`, background: `${color}1A`, boxShadow: `0 0 10px ${color}66`, position: "absolute", zIndex: 1 }}
                      >
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                      </motion.div>

                      {/* Card */}
                      <div
                        className="ml-2 md:ml-4 cursor-pointer transition-all duration-200"
                        style={{ position: "relative", zIndex: 1, background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "20px 24px" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = "0 0 15px " + color + "1F"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.01)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
                      >
                        {/* Top row */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ background: `${color}1F`, border: `1px solid ${color}33`, color, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 500 }}>{event.event_type}</span>
                            <span style={{ fontSize: 15, fontWeight: 600, color: "#ffffff" }}>{event.title}</span>
                          </div>
                          <span style={{ fontSize: 13, color: "#9a9a9a" }}>{event.date ? new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</span>
                        </div>

                        {/* Pet name */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: petColor }} />
                          <span style={{ fontSize: 13, fontWeight: 500, color: petColor }}>{event.pet || "Unknown"}</span>
                        </div>

                        {/* Notes */}
                        {event.notes && <p style={{ fontSize: 14, color: "#9a9a9a", lineHeight: 1.6, marginTop: 8 }}>{event.notes}</p>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
