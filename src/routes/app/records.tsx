import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";

export const Route = createFileRoute("/app/records")({
  component: RecordsPage,
});

const typeColors: Record<string, string> = {
  Checkup: "#8052ff",
  Surgery: "#ff6b6b",
  Treatment: "#ffb829",
  Consultation: "#15846e",
  Wellness: "#4a9eff",
};

const records = [
  { type: "Checkup", title: "Annual Checkup", pet: "Max", provider: "Dr. Sarah Chen · Valley Vet Clinic", date: "Jun 12, 2025", notes: "All vitals normal. Weight stable at 32kg. Slight tartar buildup — dental cleaning recommended." },
  { type: "Treatment", title: "Ear Infection Treatment", pet: "Max", provider: "Dr. Sarah Chen · Valley Vet Clinic", date: "May 28, 2025", notes: "Prescribed Otomax drops for 10 days. Follow-up in 2 weeks." },
  { type: "Surgery", title: "Spay Surgery", pet: "Luna", provider: "Dr. James Park · Downtown Animal Hospital", date: "Apr 15, 2025", notes: "Surgery successful. Recovery normal. Stitches removed Apr 25." },
  { type: "Wellness", title: "Puppy Wellness Visit", pet: "Milo", provider: "Dr. Sarah Chen · Valley Vet Clinic", date: "Mar 3, 2025", notes: "First visit. Healthy puppy, 4.2kg. Deworming administered. Next vaccines scheduled." },
  { type: "Consultation", title: "Allergy Consultation", pet: "Max", provider: "Dr. Lisa Wong · Pet Dermatology Specialists", date: "Feb 10, 2025", notes: "Suspected environmental allergies. Started on Apoquel 16mg daily." },
];

const petFilters = ["All Pets", "Max", "Luna", "Milo"];
const typeFilters = ["All", "Checkup", "Surgery", "Treatment", "Consultation", "Wellness"];

function RecordsPage() {
  const [petFilter, setPetFilter] = useState("All Pets");
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = records.filter((r) => {
    if (petFilter !== "All Pets" && r.pet !== petFilter) return false;
    if (typeFilter !== "All" && r.type !== typeFilter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.notes.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 300, color: "#ffffff", marginBottom: 4 }}>Medical Records</h1>
          <p style={{ fontSize: 15, color: "#9a9a9a" }}>Complete history of vet visits, treatments, and procedures.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 24, padding: "10px 20px", fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}>Upload Record</button>
          <motion.button
            animate={{ boxShadow: ["0 0 0px rgba(128,82,255,0)", "0 0 20px rgba(128,82,255,0.35)", "0 0 0px rgba(128,82,255,0)"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: "#8052ff", color: "#fff", borderRadius: 24, padding: "10px 20px", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}
          >
            Add Record +
          </motion.button>
        </div>
      </div>

      {/* Search + Filters */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search records..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 280, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 16px", color: "#ffffff", fontSize: 14, outline: "none" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#8052ff"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          {petFilters.map((f) => (
            <button key={f} onClick={() => setPetFilter(f)} style={{ background: petFilter === f ? "rgba(128,82,255,0.2)" : "rgba(255,255,255,0.05)", border: petFilter === f ? "1px solid #8052ff" : "1px solid rgba(255,255,255,0.08)", color: petFilter === f ? "#ffffff" : "#9a9a9a", borderRadius: 20, padding: "6px 14px", fontSize: 12, cursor: "pointer", transition: "all 0.15s" }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Type filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
        {typeFilters.map((f) => (
          <button key={f} onClick={() => setTypeFilter(f)} style={{ background: typeFilter === f ? "rgba(128,82,255,0.2)" : "rgba(255,255,255,0.05)", border: typeFilter === f ? "1px solid #8052ff" : "1px solid rgba(255,255,255,0.08)", color: typeFilter === f ? "#ffffff" : "#9a9a9a", borderRadius: 20, padding: "5px 12px", fontSize: 11, cursor: "pointer", transition: "all 0.15s" }}>{f}</button>
        ))}
      </div>

      {/* Year label */}
      <div style={{ fontSize: 12, color: "#9a9a9a", letterSpacing: "0.07em", textTransform: "uppercase", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 8, marginBottom: 16 }}>2025</div>

      {/* Timeline */}
      <div style={{ position: "relative", paddingLeft: 32 }}>
        {/* Vertical line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ position: "absolute", left: 16, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.08)", transformOrigin: "top" }}
        />

        {/* Records */}
        {filtered.map((r, i) => {
          const color = typeColors[r.type] || "#8052ff";
          return (
            <motion.div
              key={`${r.title}-${r.pet}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.4, ease: "easeOut" }}
              style={{ position: "relative", marginBottom: 12 }}
            >
              {/* Timeline dot */}
              <div style={{ position: "absolute", left: -21, top: 24, width: 10, height: 10, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}80` }} />

              {/* Card */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "20px 24px", transition: "all 0.2s ease", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                {/* Top row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ background: `${color}1F`, border: `1px solid ${color}40`, color, borderRadius: 20, padding: "3px 10px", fontSize: 11 }}>{r.type}</span>
                    <span style={{ fontSize: 16, fontWeight: 600, color: "#ffffff" }}>{r.title}</span>
                    <span style={{ fontSize: 16, fontWeight: 400, color: "#9a9a9a" }}>— {r.pet}</span>
                  </div>
                  <span style={{ fontSize: 13, color: "#9a9a9a" }}>{r.date}</span>
                </div>
                {/* Provider */}
                <p style={{ fontSize: 13, color: "#9a9a9a", marginBottom: 8 }}>{r.provider}</p>
                {/* Notes */}
                <p style={{ fontSize: 14, color: "#bdbdbd", lineHeight: 1.6 }}>{r.notes}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
