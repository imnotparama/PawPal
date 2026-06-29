import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { usePets } from "@/hooks/usePets";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";

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

function AddRecordModal({ pets, onClose, onSubmit }: { pets: any[]; onClose: () => void; onSubmit: (values: any) => void }) {
  const [petId, setPetId] = useState(pets[0]?.id || "");
  const [title, setTitle] = useState("");
  const [recordType, setRecordType] = useState("Checkup");
  const [doctor, setDoctor] = useState("");
  const [clinic, setClinic] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [dateError, setDateError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    let hasError = false;
    if (!title.trim()) { setTitleError(true); hasError = true; } else { setTitleError(false); }
    if (!date) { setDateError(true); hasError = true; } else { setDateError(false); }
    
    if (hasError) return;
    
    onSubmit({ pet_id: petId, title, record_type: recordType, doctor_name: doctor, clinic_name: clinic, date, notes });
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 24, width: "calc(100% - 32px)", maxWidth: 420, maxHeight: "90vh", overflowY: "auto" }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: "#ffffff", marginBottom: 24 }}>Add Medical Record</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: "#9a9a9a", display: "block", marginBottom: 6 }}>Pet</label>
            <select value={petId} onChange={(e) => setPetId(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none" }}>
              {pets.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: "#9a9a9a", display: "block", marginBottom: 6 }}>Title</label>
            <input 
              value={title} 
              onChange={(e) => { setTitle(e.target.value); setTitleError(false); }} 
              placeholder="e.g. Annual Checkup" 
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${titleError ? "#ff6b6b" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none" }} 
            />
            {titleError && <p style={{ fontSize: 12, color: "#ff6b6b", marginTop: 4 }}>Title is required</p>}
          </div>
          <div>
            <label style={{ fontSize: 13, color: "#9a9a9a", display: "block", marginBottom: 6 }}>Record Type</label>
            <select value={recordType} onChange={(e) => setRecordType(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none" }}>
              <option value="Checkup">Checkup</option>
              <option value="Surgery">Surgery</option>
              <option value="Treatment">Treatment</option>
              <option value="Consultation">Consultation</option>
              <option value="Wellness">Wellness</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: "#9a9a9a", display: "block", marginBottom: 6 }}>Doctor</label>
            <input value={doctor} onChange={(e) => setDoctor(e.target.value)} placeholder="Dr. Name" style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none" }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "#9a9a9a", display: "block", marginBottom: 6 }}>Clinic</label>
            <input value={clinic} onChange={(e) => setClinic(e.target.value)} placeholder="Clinic name" style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none" }} />
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
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" rows={3} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none", resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9a9a9a", borderRadius: 12, padding: "12px", fontSize: 14, cursor: "pointer" }}>Cancel</button>
            <button type="submit" style={{ flex: 1, background: "#8052ff", border: "none", color: "#fff", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Add Record</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RecordsPage() {
  const { pets } = usePets();
  const { records, loading, addRecord } = useMedicalRecords();
  const [petFilter, setPetFilter] = useState("All Pets");
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const petFilters = ["All Pets", ...pets.map((p) => p.name)];
  const typeFilters = ["All", "Checkup", "Surgery", "Treatment", "Consultation", "Wellness"];

  const filtered = records.filter((r) => {
    if (petFilter !== "All Pets" && r.pets?.name !== petFilter) return false;
    if (typeFilter !== "All" && r.record_type !== typeFilter) return false;
    if (search && !r.title?.toLowerCase().includes(search.toLowerCase()) && !(r.notes || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Get current year from data
  const currentYear = filtered.length > 0 
    ? new Date(filtered[0].date).getFullYear().toString() 
    : new Date().getFullYear().toString();

  const handleAddRecord = async (values: any) => {
    await addRecord(values);
    setShowModal(false);
  };

  if (loading) {
    return <p style={{ color: "#9a9a9a", fontSize: 15 }}>Loading...</p>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-start mb-6">
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 300, color: "#ffffff", marginBottom: 4 }}>Medical Records</h1>
          <p style={{ fontSize: 15, color: "#9a9a9a" }}>Complete history of vet visits, treatments, and procedures.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 24, padding: "10px 20px", fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}>Upload Record</button>
          <motion.button
            onClick={() => setShowModal(true)}
            animate={{ boxShadow: ["0 0 0px rgba(128,82,255,0)", "0 0 20px rgba(128,82,255,0.35)", "0 0 0px rgba(128,82,255,0)"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: "#8052ff", color: "#fff", borderRadius: 24, padding: "10px 20px", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}
          >
            Add Record +
          </motion.button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center mb-4">
        <input
          type="text"
          placeholder="Search records..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-[280px]"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 16px", color: "#ffffff", fontSize: 14, outline: "none" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#8052ff"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
        />
        <div className="flex gap-2 overflow-x-auto pb-1 max-w-full -mx-6 px-6 md:mx-0 md:px-0 scrollbar-none">
          {petFilters.map((f) => (
            <button key={f} onClick={() => setPetFilter(f)} style={{ background: petFilter === f ? "rgba(128,82,255,0.2)" : "rgba(255,255,255,0.05)", border: petFilter === f ? "1px solid #8052ff" : "1px solid rgba(255,255,255,0.08)", color: petFilter === f ? "#ffffff" : "#9a9a9a", borderRadius: 20, padding: "6px 14px", fontSize: 12, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Type filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 max-w-full -mx-6 px-6 md:mx-0 md:px-0 scrollbar-none mb-8">
        {typeFilters.map((f) => (
          <button key={f} onClick={() => setTypeFilter(f)} style={{ background: typeFilter === f ? "rgba(128,82,255,0.2)" : "rgba(255,255,255,0.05)", border: typeFilter === f ? "1px solid #8052ff" : "1px solid rgba(255,255,255,0.08)", color: typeFilter === f ? "#ffffff" : "#9a9a9a", borderRadius: 20, padding: "5px 12px", fontSize: 11, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}>{f}</button>
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
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(74,158,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4a9eff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", marginBottom: 6 }}>No Medical Records</h3>
            <p style={{ fontSize: 14, color: "#9a9a9a", maxWidth: 320, margin: "0 auto", lineHeight: 1.5 }}>
              Store clinic checkups, prescriptions, and surgery history to keep an organized timeline.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{ background: "#8052ff", color: "#fff", border: "none", borderRadius: 20, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 8 }}
          >
            Add Medical Record +
          </button>
        </motion.div>
      ) : (
        <>
          {/* Year label */}
          <div style={{ fontSize: 12, color: "#9a9a9a", letterSpacing: "0.07em", textTransform: "uppercase", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 8, marginBottom: 16 }}>{currentYear}</div>

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
              const color = typeColors[r.record_type] || "#8052ff";
              const provider = [r.doctor_name, r.clinic_name].filter(Boolean).join(" · ") || "—";
              return (
                <motion.div
                  key={r.id || `${r.title}-${r.pets?.name}`}
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
                        <span style={{ background: `${color}1F`, border: `1px solid ${color}40`, color, borderRadius: 20, padding: "3px 10px", fontSize: 11 }}>{r.record_type}</span>
                        <span style={{ fontSize: 16, fontWeight: 600, color: "#ffffff" }}>{r.title}</span>
                        <span style={{ fontSize: 16, fontWeight: 400, color: "#9a9a9a" }}>— {r.pets?.name || "Unknown"}</span>
                      </div>
                      <span style={{ fontSize: 13, color: "#9a9a9a" }}>{r.date ? new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</span>
                    </div>
                    {/* Provider */}
                    <p style={{ fontSize: 13, color: "#9a9a9a", marginBottom: 8 }}>{provider}</p>
                    {/* Notes */}
                    {r.notes && <p style={{ fontSize: 14, color: "#bdbdbd", lineHeight: 1.6 }}>{r.notes}</p>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {showModal && <AddRecordModal pets={pets} onClose={() => setShowModal(false)} onSubmit={handleAddRecord} />}
    </div>
  );
}
