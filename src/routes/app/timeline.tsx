import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
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
  Wellness: "#4a9eff",
};

function TimelinePage() {
  const { pets } = usePets();
  const { vaccinations } = useVaccinations();
  const { records } = useMedicalRecords();
  const [filter, setFilter] = useState("All Pets");

  const petFilters = ["All Pets", ...pets.map((p) => p.name)];

  const timeline = [
    ...vaccinations.map((v) => ({ ...v, event_type: "Vaccination", title: v.vaccine_name, pet: v.pets?.name })),
    ...records.map((r) => ({ ...r, event_type: r.record_type, title: r.title, pet: r.pets?.name })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filtered = filter === "All Pets" ? timeline : timeline.filter((e) => e.pet === filter);

  // Simple pet color map
  const petColors: Record<string, string> = {};
  const colorPalette = ["rgba(128,82,255,0.8)", "rgba(255,184,41,0.8)", "rgba(21,132,110,0.8)", "rgba(74,158,255,0.8)", "rgba(255,107,107,0.8)"];
  pets.forEach((p, i) => { petColors[p.name] = colorPalette[i % colorPalette.length]; });

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 300, color: "#ffffff", marginBottom: 4 }}>Health Timeline</h1>
          <p style={{ fontSize: 15, color: "#9a9a9a" }}>A chronological view of health events across all your pets.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {petFilters.map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? "rgba(128,82,255,0.2)" : "rgba(255,255,255,0.05)", border: filter === f ? "1px solid #8052ff" : "1px solid rgba(255,255,255,0.08)", color: filter === f ? "#ffffff" : "#9a9a9a", borderRadius: 20, padding: "6px 16px", fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>{f}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ fontSize: 18, color: "#9a9a9a" }}>No health events yet.</p>
        </div>
      ) : (
        <>
          {/* Year label */}
          <div style={{ fontSize: 11, color: "#9a9a9a", letterSpacing: "0.08em", textTransform: "uppercase", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 6, marginBottom: 16, marginTop: 8 }}>2025</div>

          {/* Timeline */}
          <div style={{ position: "relative", paddingLeft: 64 }}>
            {/* Animated vertical line */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ position: "absolute", left: 31, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom, rgba(128,82,255,0.4) 0%, rgba(128,82,255,0.1) 100%)", transformOrigin: "top" }}
            />

            {filtered.map((event, i) => {
              const color = typeColors[event.event_type] || "#8052ff";
              const petColor = petColors[event.pet || ""] || "#9a9a9a";

              return (
                <motion.div
                  key={event.id || `${event.title}-${i}`}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.1 }}
                  style={{ position: "relative", marginBottom: 8 }}
                >
                  {/* Dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: [0, 1.3, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    style={{ position: "absolute", left: -44, top: 22, width: 20, height: 20, borderRadius: "50%", border: `1px solid ${color}`, background: `${color}1A`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 10px ${color}66` }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                  </motion.div>

                  {/* Card */}
                  <div
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "20px 24px", marginLeft: 16, cursor: "pointer", transition: "all 0.2s ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
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
        </>
      )}
    </div>
  );
}
