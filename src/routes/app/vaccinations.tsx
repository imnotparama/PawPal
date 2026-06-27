import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";

export const Route = createFileRoute("/app/vaccinations")({
  component: VaccinationsPage,
});

const vaccinations = [
  { pet: "Max", petType: "dog", vaccine: "Rabies Booster", date: "Jul 15, 2025", status: "upcoming" },
  { pet: "Luna", petType: "cat", vaccine: "FVRCP", date: "Jul 28, 2025", status: "upcoming" },
  { pet: "Milo", petType: "dog", vaccine: "DHPP", date: "Jun 10, 2025", status: "completed" },
  { pet: "Max", petType: "dog", vaccine: "Bordetella", date: "May 22, 2025", status: "completed" },
  { pet: "Luna", petType: "cat", vaccine: "Rabies", date: "Apr 3, 2025", status: "completed" },
];

const summaryCards = [
  { label: "Upcoming", value: "2", color: "#ffb829", icon: "⏰" },
  { label: "Completed", value: "3", color: "#15846e", icon: "✓" },
  { label: "Overdue", value: "0", color: "#ff6b6b", icon: "⚠" },
];

const filters = ["All Pets", "Max", "Luna", "Milo"];

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    upcoming: { bg: "rgba(255,184,41,0.12)", color: "#ffb829", border: "rgba(255,184,41,0.2)" },
    completed: { bg: "rgba(21,132,110,0.12)", color: "#15846e", border: "rgba(21,132,110,0.2)" },
    overdue: { bg: "rgba(255,107,107,0.12)", color: "#ff6b6b", border: "rgba(255,107,107,0.2)" },
  };
  const s = styles[status] || styles.upcoming;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 500, textTransform: "capitalize" }}>
      {status}
    </span>
  );
}

function VaccinationsPage() {
  const [activeFilter, setActiveFilter] = useState("All Pets");

  const filtered = activeFilter === "All Pets"
    ? vaccinations
    : vaccinations.filter((v) => v.pet === activeFilter);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 300, color: "#ffffff", marginBottom: 4 }}>Vaccinations</h1>
          <p style={{ fontSize: 15, color: "#9a9a9a" }}>Track upcoming and past vaccinations for all your pets.</p>
        </div>
        <motion.button
          animate={{ boxShadow: ["0 0 0px rgba(128,82,255,0)", "0 0 20px rgba(128,82,255,0.35)", "0 0 0px rgba(128,82,255,0)"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "#8052ff", color: "#fff", borderRadius: 24, padding: "12px 24px", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}
        >
          Add Vaccination +
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
            style={{
              background: `${card.color}08`,
              border: `1px solid ${card.color}26`,
              borderRadius: 16,
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <span style={{ fontSize: 24 }}>{card.icon}</span>
            <div>
              <p style={{ fontSize: 12, color: "#9a9a9a", textTransform: "uppercase", letterSpacing: "0.05em" }}>{card.label}</p>
              <p style={{ fontSize: 32, fontWeight: 600, color: "#ffffff" }}>{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              background: activeFilter === f ? "rgba(128,82,255,0.2)" : "rgba(255,255,255,0.05)",
              border: activeFilter === f ? "1px solid #8052ff" : "1px solid rgba(255,255,255,0.08)",
              color: activeFilter === f ? "#ffffff" : "#9a9a9a",
              borderRadius: 20,
              padding: "6px 16px",
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table Header */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 2fr 1.5fr 1fr", gap: 16, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {["PET", "VACCINE", "DATE", "STATUS"].map((h) => (
          <span key={h} style={{ fontSize: 11, fontWeight: 400, color: "#9a9a9a", letterSpacing: "0.07em", textTransform: "uppercase" }}>{h}</span>
        ))}
      </div>

      {/* Table Rows */}
      {filtered.map((v, i) => (
        <motion.div
          key={`${v.pet}-${v.vaccine}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.05, duration: 0.35, ease: "easeOut" }}
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 2fr 1.5fr 1fr",
            gap: 16,
            padding: "16px 0",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            alignItems: "center",
            cursor: "pointer",
            transition: "background 0.15s ease",
          }}
          whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
        >
          {/* Pet */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: v.petType === "dog" ? "#8052ff" : "#15846e",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 600, color: "#fff"
            }}>
              {v.pet[0]}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#ffffff" }}>{v.pet}</span>
          </div>

          {/* Vaccine */}
          <span style={{ fontSize: 14, color: "#ffffff" }}>{v.vaccine}</span>

          {/* Date */}
          <span style={{ fontSize: 14, color: "#9a9a9a" }}>{v.date}</span>

          {/* Status */}
          <StatusPill status={v.status} />
        </motion.div>
      ))}
    </div>
  );
}
