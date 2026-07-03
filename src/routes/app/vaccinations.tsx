import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { usePets } from "@/hooks/usePets";
import { useVaccinations } from "@/hooks/useVaccinations";

export const Route = createFileRoute("/app/vaccinations")({
  component: VaccinationsPage,
});

function StatusPill({ status }: { status: string }) {
  const normalized = status?.toLowerCase() || "upcoming";
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    upcoming: { bg: "rgba(255,184,41,0.12)", color: "#ffb829", border: "rgba(255,184,41,0.2)" },
    completed: { bg: "rgba(21,132,110,0.12)", color: "#15846e", border: "rgba(21,132,110,0.2)" },
    overdue: { bg: "rgba(255,107,107,0.12)", color: "#ff6b6b", border: "rgba(255,107,107,0.2)" },
  };
  const s = styles[normalized] || styles.upcoming;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 500, textTransform: "capitalize" }}>
      {status}
    </span>
  );
}

function AddVaccinationModal({ pets, onClose, onSubmit, submitting }: { pets: any[]; onClose: () => void; onSubmit: (values: any) => void; submitting: boolean }) {
  const [petId, setPetId] = useState(pets[0]?.id || "");
  const [vaccineName, setVaccineName] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [vaccineError, setVaccineError] = useState(false);
  const [dateError, setDateError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    let hasError = false;
    if (!vaccineName.trim()) { setVaccineError(true); hasError = true; } else { setVaccineError(false); }
    if (!date) { setDateError(true); hasError = true; } else { setDateError(false); }
    
    if (hasError) return;
    
    onSubmit({ pet_id: petId, vaccine_name: vaccineName, date, notes });
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32, width: 380 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: "#ffffff", marginBottom: 24 }}>Add Vaccination</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: "#9a9a9a", display: "block", marginBottom: 6 }}>Pet</label>
            <select value={petId} onChange={(e) => setPetId(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none" }}>
              {pets.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: "#9a9a9a", display: "block", marginBottom: 6 }}>Vaccine Name</label>
            <input 
              value={vaccineName} 
              onChange={(e) => { setVaccineName(e.target.value); setVaccineError(false); }} 
              placeholder="e.g. Rabies Booster" 
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${vaccineError ? "#ff6b6b" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none" }} 
            />
            {vaccineError && <p style={{ fontSize: 12, color: "#ff6b6b", marginTop: 4 }}>Vaccine name is required</p>}
          </div>
          <div>
            <label style={{ fontSize: 13, color: "#9a9a9a", display: "block", marginBottom: 6 }}>Date</label>
            <input 
              value={date} 
              onChange={(e) => { setDate(e.target.value); setDateError(false); }} 
              type="date" 
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${dateError ? "#ff6b6b" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none" }} 
            />
            {dateError && <p style={{ fontSize: 12, color: "#ff6b6b", marginTop: 4 }}>Date is required</p>}
          </div>
          <div>
            <label style={{ fontSize: 13, color: "#9a9a9a", display: "block", marginBottom: 6 }}>Notes</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none" }} />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button type="button" onClick={onClose} disabled={submitting} style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9a9a9a", borderRadius: 12, padding: "12px", fontSize: 14, cursor: submitting ? "not-allowed" : "pointer" }}>Cancel</button>
            <button type="submit" disabled={submitting} style={{ flex: 1, background: submitting ? "rgba(128,82,255,0.5)" : "#8052ff", border: "none", color: "#fff", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer" }}>
              {submitting ? "Adding..." : "Add Vaccination"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VaccinationsPage() {
  const { pets } = usePets();
  const { vaccinations, loading, adding, addVaccination, markComplete } = useVaccinations();
  const [activeFilter, setActiveFilter] = useState("All Pets");
  const [showModal, setShowModal] = useState(false);

  const filters = ["All Pets", ...pets.map((p) => p.name)];

  const filtered = activeFilter === "All Pets"
    ? vaccinations
    : vaccinations.filter((v) => v.pets?.name === activeFilter);

  const upcomingCount = vaccinations.filter((v) => v.status === "Upcoming").length;
  const completedCount = vaccinations.filter((v) => v.status === "Completed").length;
  const overdueCount = vaccinations.filter((v) => v.status === "Overdue").length;

  const summaryCards = [
    { label: "Upcoming", value: String(upcomingCount), color: "#ffb829", icon: "⏰" },
    { label: "Completed", value: String(completedCount), color: "#15846e", icon: "✓" },
    { label: "Overdue", value: String(overdueCount), color: "#ff6b6b", icon: "⚠" },
  ];

  const handleAddVaccination = async (values: any) => {
    await addVaccination(values);
    setShowModal(false);
  };

  if (loading) {
    return <p style={{ color: "#9a9a9a", fontSize: 15 }}>Loading...</p>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-start mb-8">
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 300, color: "#ffffff", marginBottom: 4 }}>Vaccinations</h1>
          <p style={{ fontSize: 15, color: "#9a9a9a" }}>Track upcoming and past vaccinations for all your pets.</p>
        </div>
        <motion.button
          onClick={() => setShowModal(true)}
          animate={{ boxShadow: ["0 0 0px rgba(128,82,255,0)", "0 0 20px rgba(128,82,255,0.35)", "0 0 0px rgba(128,82,255,0)"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "#8052ff", color: "#fff", borderRadius: 24, padding: "12px 24px", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", alignSelf: "flex-start" }}
        >
          Add Vaccination +
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
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
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,184,41,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffb829" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", marginBottom: 6 }}>No Vaccinations Tracked</h3>
            <p style={{ fontSize: 14, color: "#9a9a9a", maxWidth: 320, margin: "0 auto", lineHeight: 1.5 }}>
              Record vaccination logs or due dates to automatically check status updates (Overdue, Due, or Completed).
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{ background: "#8052ff", color: "#fff", border: "none", borderRadius: 20, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 8 }}
          >
            Add Vaccination Log +
          </button>
        </motion.div>
      ) : (
        <div style={{ overflowX: "auto" }} className="w-full">
          <div style={{ minWidth: 600 }}>
            {/* Table Header */}
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 2fr 1.5fr 1fr 1fr", gap: 16, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["PET", "VACCINE", "DATE", "STATUS", "ACTION"].map((h) => (
                <span key={h} style={{ fontSize: 11, fontWeight: 400, color: "#9a9a9a", letterSpacing: "0.07em", textTransform: "uppercase" }}>{h}</span>
              ))}
            </div>

            {/* Table Rows */}
            {filtered.map((v, i) => (
              <motion.div
                key={v.id || `${v.pets?.name}-${v.vaccine_name}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.35, ease: "easeOut" }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 2fr 1.5fr 1fr 1fr",
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
                    background: v.pets?.species === "Cat" ? "#15846e" : "#8052ff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 600, color: "#fff"
                  }}>
                    {(v.pets?.name || "?")[0]}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#ffffff" }}>{v.pets?.name || "Unknown"}</span>
                </div>

                {/* Vaccine */}
                <span style={{ fontSize: 14, color: "#ffffff" }}>{v.vaccine_name}</span>

                {/* Date */}
                <span style={{ fontSize: 14, color: "#9a9a9a" }}>{v.date ? new Date(v.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</span>

                {/* Status */}
                <div>
                  <StatusPill status={v.status} />
                </div>

                {/* Action */}
                <div>
                  {v.status !== "Completed" ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markComplete(v.id);
                      }}
                      style={{
                        background: "rgba(21,132,110,0.15)",
                        border: "1px solid rgba(21,132,110,0.3)",
                        color: "#15846e",
                        borderRadius: 16,
                        padding: "6px 12px",
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s"
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#15846e"; e.currentTarget.style.color = "#ffffff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(21,132,110,0.15)"; e.currentTarget.style.color = "#15846e"; }}
                    >
                      Mark Done ✓
                    </button>
                  ) : (
                    <span style={{ color: "#15846e", fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                      Done ✓
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {showModal && <AddVaccinationModal pets={pets} onClose={() => setShowModal(false)} onSubmit={handleAddVaccination} submitting={adding} />}
    </div>
  );
}
