import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { CometCard } from "@/components/ui/comet-card";
import { usePets } from "@/hooks/usePets";
import { useVaccinations } from "@/hooks/useVaccinations";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { z } from "zod";
import { toast } from "sonner";
import { NoiseBackground } from "@/components/ui/noise-background";

export const Route = createFileRoute("/dashboard/pets/")({
  component: PetsPage,
});

const getPetLifePhase = (age: number, species: string) => {
  const isCat = species?.toLowerCase() === "cat";
  if (isCat) {
    if (age <= 1) return "Kitten";
    if (age <= 6) return "Junior";
    if (age <= 10) return "Mature";
    if (age <= 15) return "Senior";
    return "Geriatric";
  } else {
    if (age <= 1) return "Puppy";
    if (age <= 3) return "Junior";
    if (age <= 7) return "Adult";
    if (age <= 10) return "Senior";
    return "Geriatric";
  }
};

function PassportModal({ pet, onClose }: { pet: any; onClose: () => void }) {
  const passportId = `PP-${pet.species.toUpperCase().slice(0, 3)}-${(pet.id || crypto.randomUUID()).slice(0, 8).toUpperCase()}`;
  
  const { vaccinations, loading: vacsLoading } = useVaccinations();
  const { records, loading: recsLoading, addRecord } = useMedicalRecords();

  const [activeTab, setActiveTab] = useState<"clinical" | "weight">("clinical");
  const [newWeight, setNewWeight] = useState("");
  const [newWeightDate, setNewWeightDate] = useState(new Date().toISOString().split("T")[0]);
  const [loggingWeight, setLoggingWeight] = useState(false);

  const petVaccines = vaccinations.filter(v => v.pet_id === pet.id);
  const petRecords = records.filter(r => r.pet_id === pet.id);

  // Compute health compliance score
  const completedVaccines = petVaccines.filter(v => v.status === "Completed").length;
  const expectedVaccines = petVaccines.length;
  const healthScore = expectedVaccines > 0 ? Math.round((completedVaccines / expectedVaccines) * 100) : 100;

  const weightLogs = petRecords
    .filter(r => r.record_type === 'Weight')
    .map(r => ({
      id: r.id,
      weight: parseFloat(r.notes || "0") || parseFloat(r.title.match(/[\d.]+/)?.[0] || "0"),
      date: r.date
    }))
    .filter(w => w.weight > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleLogWeightSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newWeight);
    if (isNaN(val) || val <= 0) {
      toast.error("Please enter a valid weight");
      return;
    }
    setLoggingWeight(true);
    try {
      await addRecord({
        pet_id: pet.id,
        title: `Weight Check-in: ${val} kg`,
        record_type: "Weight",
        date: newWeightDate,
        notes: String(val)
      });
      setNewWeight("");
      toast.success("Weight logged successfully!");
    } catch (err) {
      toast.error("Failed to log weight check-in");
    } finally {
      setLoggingWeight(false);
    }
  };

  const drawWeightChart = () => {
    if (weightLogs.length === 0) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 100, background: "rgba(0,0,0,0.2)", borderRadius: 8, border: "1px dashed rgba(255,255,255,0.08)", color: "#9a9a9a", fontSize: 11, fontStyle: "italic" }}>
          <span>No weight points logged yet.</span>
        </div>
      );
    }

    const chartWidth = 444;
    const chartHeight = 90;
    const padX = 24;
    const padY = 16;

    const weightsVal = weightLogs.map(w => w.weight);
    const minW = Math.min(...weightsVal) * 0.9;
    const maxW = Math.max(...weightsVal) * 1.1;
    const wRange = maxW - minW || 1;

    const pts = weightLogs.map((w, idx) => {
      const x = padX + (idx / Math.max(1, weightLogs.length - 1)) * (chartWidth - padX * 2);
      const y = chartHeight - padY - ((w.weight - minW) / wRange) * (chartHeight - padY * 2);
      return { x, y, val: w.weight, d: w.date };
    });

    const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaD = pts.length > 0
      ? `${pathD} L ${pts[pts.length - 1].x} ${chartHeight - padY} L ${pts[0].x} ${chartHeight - padY} Z`
      : "";

    return (
      <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ overflow: "visible", background: "rgba(0,0,0,0.2)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)", padding: "4px 8px" }}>
        <defs>
          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8052ff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#8052ff" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        
        <line x1={padX} y1={padY} x2={chartWidth - padX} y2={padY} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
        <line x1={padX} y1={chartHeight / 2} x2={chartWidth - padX} y2={chartHeight / 2} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
        <line x1={padX} y1={chartHeight - padY} x2={chartWidth - padX} y2={chartHeight - padY} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />

        {areaD && <path d={areaD} fill="url(#chartGlow)" />}
        {pathD && <path d={pathD} fill="none" stroke="#8052ff" strokeWidth={2} />}

        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={4} fill="#8052ff" stroke="#ffffff" strokeWidth={1} />
            <text x={p.x} y={p.y - 8} fill="#ffffff" fontSize={9} textAnchor="middle" fontWeight={600}>
              {p.val}kg
            </text>
          </g>
        ))}
      </svg>
    );
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleDownloadImage = () => {
    const element = document.getElementById("printable-passport");
    if (!element) return;

    const canvas = document.createElement("canvas");
    canvas.width = 540;
    canvas.height = 680;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#0c0c0c";
    ctx.fillRect(0, 0, 540, 680);

    // Border
    ctx.strokeStyle = "#8052ff";
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, 520, 660);

    // Header
    ctx.font = "bold 20px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#8052ff";
    ctx.fillText("PAWPAL HEALTH PASSPORT", 30, 48);
    ctx.font = "10px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#9a9a9a";
    ctx.fillText("OFFICIAL PET COMPLIANCE CO.", 30, 66);

    // Pet details text
    ctx.font = "12px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#9a9a9a";
    ctx.fillText("NAME OF PET", 160, 110);
    ctx.font = "bold 16px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(pet.name, 160, 130);

    // Breed/Type
    ctx.font = "12px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#9a9a9a";
    ctx.fillText("BREED / TYPE", 160, 170);
    ctx.font = "bold 15px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(pet.breed || "Mixed breed", 160, 190);

    // Age/Species
    ctx.font = "12px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#9a9a9a";
    ctx.fillText("AGE & SPECIES", 340, 110);
    ctx.font = "bold 15px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`${pet.age_years} yrs old · ${pet.species}`, 340, 130);

    // Document ID
    ctx.font = "12px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#9a9a9a";
    ctx.fillText("DOCUMENT ID", 340, 170);
    ctx.font = "bold 13px monospace";
    ctx.fillStyle = "#8052ff";
    ctx.fillText(passportId, 340, 190);

    // Health Score
    ctx.font = "11px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#9a9a9a";
    ctx.fillText("AUTHORIZED HEALTH SCORE", 30, 260);
    ctx.font = "bold 18px 'Space Grotesk', sans-serif";
    ctx.fillStyle = healthScore >= 80 ? "#15846e" : "#ffb829";
    ctx.fillText(`${healthScore}% COMPLIANT`, 30, 285);

    // Draw Mock QR code
    const qrX = 430;
    const qrY = 230;
    const qrSize = 56;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(qrX, qrY, qrSize, qrSize);
    ctx.fillStyle = "#000000";
    ctx.fillRect(qrX + 3, qrY + 3, 14, 14);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(qrX + 6, qrY + 6, 8, 8);
    ctx.fillStyle = "#000000";
    ctx.fillRect(qrX + 8, qrY + 8, 4, 4);

    for (let x = 0; x < qrSize - 6; x += 4) {
      for (let y = 0; y < qrSize - 6; y += 4) {
        if (x < 16 && y < 16) continue;
        if (Math.random() > 0.5) {
          ctx.fillStyle = "#000000";
          ctx.fillRect(qrX + 3 + x, qrY + 3 + y, 4, 4);
        }
      }
    }

    // Health History Title
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(30, 320, 480, 2);
    ctx.font = "bold 14px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("IMMUNIZATION & CLINICAL RECORD HISTORY", 30, 350);

    // Draw Table
    ctx.font = "bold 11px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#9a9a9a";
    ctx.fillText("EVENT / LOG", 30, 385);
    ctx.fillText("DATE", 280, 385);
    ctx.fillText("STATUS / TYPE", 400, 385);

    let currentY = 410;
    const allEvents = [
      ...petVaccines.map(v => ({ title: v.vaccine_name, date: v.date, status: v.status })),
      ...petRecords.map(r => ({ title: r.title, date: r.date, status: r.record_type }))
    ].slice(0, 5);

    allEvents.forEach((ev) => {
      ctx.font = "13px 'Space Grotesk', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(ev.title.length > 25 ? ev.title.slice(0, 22) + "..." : ev.title, 30, currentY);
      
      ctx.font = "13px 'Space Grotesk', sans-serif";
      ctx.fillStyle = "#bdbdbd";
      ctx.fillText(ev.date ? new Date(ev.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—", 280, currentY);
      
      ctx.font = "12px 'Space Grotesk', sans-serif";
      ctx.fillStyle = ev.status === "Completed" ? "#15846e" : ev.status === "Upcoming" ? "#ffb829" : "#8052ff";
      ctx.fillText(ev.status, 400, currentY);
      
      currentY += 32;
    });

    if (allEvents.length === 0) {
      ctx.font = "italic 13px 'Space Grotesk', sans-serif";
      ctx.fillStyle = "#9a9a9a";
      ctx.fillText("No clinical history found.", 30, 420);
    }

    // Watermark
    ctx.font = "10px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillText("POWERED BY PAWPAL AI · HACK THE KITTY 2026", 30, 640);

    // Draw Avatar image
    if (pet.photo_url) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = pet.photo_url;
      img.onload = () => {
        ctx.drawImage(img, 30, 96, 100, 130);
        triggerDownload();
      };
      img.onerror = () => {
        drawFallbackPlaceholder();
        triggerDownload();
      };
    } else {
      drawFallbackPlaceholder();
      triggerDownload();
    }

    function drawFallbackPlaceholder() {
      ctx.fillStyle = "#8052ff";
      ctx.fillRect(30, 96, 100, 130);
      ctx.font = "bold 36px 'Space Grotesk', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(pet.name[0], 80, 175);
      ctx.textAlign = "left";
    }

    function triggerDownload() {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${pet.name}_Passport.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success("Passport Image downloaded!");
        }
      }, "image/png");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-passport, #printable-passport * {
            visibility: visible;
          }
          #printable-passport {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{ background: "#0a0a0a", border: "1px solid rgba(128,82,255,0.25)", borderRadius: 24, padding: 32, width: "calc(100% - 32px)", maxWidth: 540, boxShadow: "0 0 40px rgba(128,82,255,0.15)", position: "relative" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#9a9a9a", fontSize: 20, cursor: "pointer" }}>✕</button>

        <div id="printable-passport" style={{ background: "linear-gradient(145deg, #121212, #080808)", border: "2px solid #8052ff", borderRadius: 16, padding: 24, color: "#fff", position: "relative", overflow: "hidden", marginBottom: 20 }}>
          <div style={{ position: "absolute", bottom: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(128,82,255,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16, marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#8052ff", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>PawPal Health Passport</h2>
              <span style={{ fontSize: 11, color: "#9a9a9a" }}>OFFICIAL PET COMPLIANCE CO.</span>
            </div>
            <span style={{ fontSize: 24 }}>🐾</span>
          </div>

          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ width: 100, height: 130, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.2)", flexShrink: 0, background: "#222" }}>
              {pet.photo_url ? (
                <img src={pet.photo_url} alt={pet.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "rgba(255,255,255,0.15)", background: "linear-gradient(135deg, #8052ff, #5030cc)" }}>{pet.name?.[0] || "?"}</div>
              )}
            </div>

            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 8px" }}>
              <div>
                <span style={{ display: "block", fontSize: 9, color: "#9a9a9a", textTransform: "uppercase" }}>Name of Pet</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#ffffff" }}>{pet.name}</span>
              </div>
              <div>
                <span style={{ display: "block", fontSize: 9, color: "#9a9a9a", textTransform: "uppercase" }}>Species</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#ffffff" }}>{pet.species}</span>
              </div>
              <div>
                <span style={{ display: "block", fontSize: 9, color: "#9a9a9a", textTransform: "uppercase" }}>Breed / Type</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#ffffff" }}>{pet.breed || "Mixed breed"}</span>
              </div>
              <div>
                <span style={{ display: "block", fontSize: 9, color: "#9a9a9a", textTransform: "uppercase" }}>Age</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#ffffff" }}>{pet.age_years} yrs</span>
              </div>
              <div>
                <span style={{ display: "block", fontSize: 9, color: "#9a9a9a", textTransform: "uppercase" }}>Weight</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#ffffff" }}>{weightLogs.length > 0 ? `${weightLogs[weightLogs.length - 1].weight} kg` : pet.weight_kg ? `${pet.weight_kg} kg` : "—"}</span>
              </div>
              <div>
                <span style={{ display: "block", fontSize: 9, color: "#9a9a9a", textTransform: "uppercase" }}>Document ID</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#8052ff", fontFamily: "monospace" }}>{passportId}</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 16, paddingTop: 16 }}>
            <div>
              <span style={{ display: "block", fontSize: 9, color: "#9a9a9a", textTransform: "uppercase" }}>Authorized Health Score</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: healthScore >= 80 ? "#15846e" : "#ffb829" }}>{healthScore}% COMPLIANT</span>
            </div>
            <div style={{ background: "#ffffff", padding: 4, borderRadius: 4, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#000">
                <path d="M0 0h6v6H0zm2 2v2h2V2zm0 6h4v4H2zm8-8h6v6h-6zm2 2v2h2V2zm0 6h4v4h-4zm-10 8h6v6H0zm2 2v2h2V2zm16-8h4v4h-4zm-8 8h4v4h-4zm8 4h4v4h-4z" />
              </svg>
            </div>
          </div>

          {/* Toggle structure */}
          <div style={{ marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16 }}>
            <div style={{ display: "flex", gap: 16, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 8, marginBottom: 12 }}>
              <button
                type="button"
                onClick={() => setActiveTab("clinical")}
                style={{
                  background: "none",
                  border: "none",
                  color: activeTab === "clinical" ? "#8052ff" : "#9a9a9a",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  borderBottom: activeTab === "clinical" ? "2px solid #8052ff" : "none",
                  paddingBottom: 4
                }}
              >
                Clinical Logs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("weight")}
                style={{
                  background: "none",
                  border: "none",
                  color: activeTab === "weight" ? "#8052ff" : "#9a9a9a",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  borderBottom: activeTab === "weight" ? "2px solid #8052ff" : "none",
                  paddingBottom: 4
                }}
              >
                Weight Tracker
              </button>
            </div>

            {activeTab === "clinical" ? (
              <div>
                <span style={{ display: "block", fontSize: 10, color: "#9a9a9a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, fontWeight: 600 }}>Clinical Logs Summary</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 120, overflowY: "auto" }}>
                  {[
                    ...petVaccines.map(v => ({ title: v.vaccine_name, date: v.date, status: v.status })),
                    ...petRecords.map(r => ({ title: r.title, date: r.date, status: r.record_type }))
                  ].slice(0, 4).map((ev, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: 4 }}>
                      <span style={{ color: "#ffffff", fontWeight: 500 }}>{ev.title}</span>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <span style={{ color: "#9a9a9a" }}>{ev.date ? new Date(ev.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</span>
                        <span style={{ 
                          color: ev.status === "Completed" ? "#15846e" : ev.status === "Upcoming" ? "#ffb829" : "#8052ff", 
                          fontSize: 10, 
                          fontWeight: 600, 
                          textTransform: "uppercase" 
                        }}>{ev.status}</span>
                      </div>
                    </div>
                  ))}
                  {petVaccines.length === 0 && petRecords.length === 0 && (
                    <span style={{ color: "#9a9a9a", fontSize: 11, fontStyle: "italic" }}>No vaccination or checkup history logged.</span>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {drawWeightChart()}

                <form onSubmit={handleLogWeightSubmit} style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 4 }}>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Weight (kg)"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    style={{
                      flex: 1,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 12,
                      padding: "8px 12px",
                      color: "#fff",
                      fontSize: 13,
                      outline: "none"
                    }}
                  />
                  <input
                    type="date"
                    value={newWeightDate}
                    onChange={(e) => setNewWeightDate(e.target.value)}
                    style={{
                      width: 120,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 12,
                      padding: "8px 12px",
                      color: "#fff",
                      fontSize: 13,
                      outline: "none"
                    }}
                  />
                  <button
                    type="submit"
                    disabled={loggingWeight}
                    style={{
                      background: "#8052ff",
                      color: "#fff",
                      border: "none",
                      borderRadius: 12,
                      padding: "8px 16px",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: loggingWeight ? "not-allowed" : "pointer"
                    }}
                  >
                    {loggingWeight ? "..." : "Log +"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#ffffff", borderRadius: 20, padding: "12px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Close
          </button>
          <button
            onClick={handleDownloadImage}
            style={{ flex: 1, background: "rgba(128,82,255,0.15)", border: "1px solid rgba(128,82,255,0.3)", color: "#ffffff", borderRadius: 20, padding: "12px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Download Image 📥
          </button>
          <button
            onClick={handlePrint}
            style={{ flex: 1, background: "#8052ff", border: "none", color: "#ffffff", borderRadius: 20, padding: "12px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 0 15px rgba(128,82,255,0.4)" }}
          >
            Print Passport 🖨️
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PetCard({ pet, index, onDelete, onOpenPassport }: { pet: any; index: number; onDelete: (id: string) => Promise<void>; onOpenPassport: (pet: any) => void }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: "50%", y: "50%" });
  
  const { vaccinations } = useVaccinations();
  const petVaccines = vaccinations.filter(v => v.pet_id === pet.id);
  const completedCount = petVaccines.filter(v => v.status === "Completed").length;
  const expectedCount = petVaccines.length;
  const healthScore = expectedCount > 0 ? Math.round((completedCount / expectedCount) * 100) : 100;

  const lastVacc = petVaccines
    .filter(v => v.status === "Completed")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const lastVaccineText = lastVacc 
    ? `${lastVacc.vaccine_name} (${new Date(lastVacc.date).toLocaleDateString()})` 
    : "No vaccination logged";

  const handleMouse = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x: `${x}%`, y: `${y}%` });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0c0c0c";
    ctx.fillRect(0, 0, 600, 400);

    ctx.strokeStyle = "rgba(128, 82, 255, 0.2)";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 580, 380);

    ctx.font = "bold 20px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#8052ff";
    ctx.fillText("🐾 PAWPAL AI", 30, 45);

    ctx.font = "12px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#9a9a9a";
    ctx.fillText("OFFICIAL HEALTH CARD", 30, 65);

    ctx.font = "32px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(pet.name, 30, 120);

    ctx.font = "14px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#bdbdbd";
    ctx.fillText(`Species: ${pet.species}`, 30, 150);
    ctx.fillText(`Breed: ${pet.breed || "Mixed Breed"}`, 30, 175);
    ctx.fillText(`Age: ${pet.age_years} years`, 30, 200);
    
    const lifePhase = getPetLifePhase(pet.age_years, pet.species);
    ctx.fillText(`Life Phase: ${lifePhase}`, 30, 225);

    ctx.strokeStyle = "rgba(128, 82, 255, 0.1)";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(480, 140, 60, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.strokeStyle = "#8052ff";
    const endAngle = -Math.PI / 2 + (healthScore / 100) * 2 * Math.PI;
    ctx.beginPath();
    ctx.arc(480, 140, 60, -Math.PI / 2, endAngle);
    ctx.stroke();

    ctx.font = "bold 28px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(`${healthScore}%`, 480, 145);
    
    ctx.font = "10px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#9a9a9a";
    ctx.fillText("COMPLIANCE", 480, 170);
    ctx.textAlign = "left";

    ctx.font = "12px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#9a9a9a";
    ctx.fillText("LAST VACCINATION DATE", 30, 270);
    ctx.font = "bold 16px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(lastVaccineText, 30, 292);

    const qrX = 490;
    const qrY = 270;
    const qrSize = 64;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(qrX, qrY, qrSize, qrSize);

    ctx.fillStyle = "#000000";
    ctx.fillRect(qrX + 2, qrY + 2, 16, 16);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(qrX + 5, qrY + 5, 10, 10);
    ctx.fillStyle = "#000000";
    ctx.fillRect(qrX + 7, qrY + 7, 6, 6);

    for (let xOffset = 0; xOffset < qrSize - 4; xOffset += 4) {
      for (let yOffset = 0; yOffset < qrSize - 4; yOffset += 4) {
        if (xOffset < 16 && yOffset < 16) continue;
        if (Math.random() > 0.5) {
          ctx.fillStyle = "#000000";
          ctx.fillRect(qrX + 2 + xOffset, qrY + 2 + yOffset, 4, 4);
        }
      }
    }

    ctx.font = "8px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#9a9a9a";
    ctx.fillText("Scan to verify", qrX, qrY + qrSize + 12);
    ctx.fillText("pawpal-wheat.vercel.app", qrX - 45, qrY + qrSize + 22);

    ctx.font = "10px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fillText("POWERED BY PAWPAL AI", 30, 360);

    if (pet.photo_url) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = pet.photo_url;
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(280, 175, 45, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(img, 235, 130, 90, 90);
        ctx.restore();
        triggerDownload();
      };
      img.onerror = () => {
        drawFallbackPhotoCircle();
        triggerDownload();
      };
    } else {
      drawFallbackPhotoCircle();
      triggerDownload();
    }

    function drawFallbackPhotoCircle() {
      ctx.fillStyle = "#8052ff";
      ctx.beginPath();
      ctx.arc(280, 175, 45, 0, 2 * Math.PI);
      ctx.fill();
      ctx.font = "bold 32px 'Space Grotesk', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(pet.name[0], 280, 185);
      ctx.textAlign = "left";
    }

    function triggerDownload() {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${pet.name}_health_card.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success("Share Card downloaded!");
        }
      }, "image/png");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
    >
      <CometCard>
        <div
          ref={cardRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onMouseMove={handleMouse}
          style={{
            background: "#111111",
            border: `1px solid ${hovered ? "rgba(128,82,255,0.3)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 20,
            padding: 12,
            cursor: "pointer",
            width: 280,
            transition: "border-color 0.2s ease",
          }}
        >
          <div style={{ position: "relative", aspectRatio: "16/10", borderRadius: 12, overflow: "hidden" }}>
            {pet.photo_url ? (
              <img
                src={pet.photo_url}
                alt={pet.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #8052ff, #5030cc)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, fontWeight: 700, color: "#fff" }}>
                {pet.name?.[0] || "?"}
              </div>
            )}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
                opacity: hovered ? 1 : 0,
                transition: "opacity 0.2s ease",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle at ${mousePos.x} ${mousePos.y}, rgba(255,255,255,0.08) 0%, transparent 60%)`,
                pointerEvents: "none",
                borderRadius: "inherit",
              }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Are you sure you want to delete ${pet.name}?`)) {
                  onDelete(pet.id);
                }
              }}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "rgba(0, 0, 0, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#ff6b6b",
                display: hovered ? "flex" : "none",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontWeight: "bold",
                fontSize: 12,
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ff6b6b";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.6)";
                e.currentTarget.style.color = "#ff6b6b";
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ padding: "12px 8px 8px" }}>
            <p style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", userSelect: "none" }}>{pet.name}</p>
            <p style={{ fontSize: 13, color: "#9a9a9a", marginTop: 2, userSelect: "none" }}>{pet.breed} · {pet.age_years}y</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ background: "rgba(255,184,41,0.1)", border: "1px solid rgba(255,184,41,0.2)", color: "#ffb829", borderRadius: 20, padding: "3px 10px", fontSize: 11, userSelect: "none" }}>
                  {getPetLifePhase(pet.age_years, pet.species)}
                </span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={handleShare}
                  title="Share Card"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#ffffff", borderRadius: 20, padding: "4px 8px", fontSize: 11, cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#8052ff"; e.currentTarget.style.background = "rgba(128,82,255,0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                >
                  Share 📤
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenPassport(pet);
                  }}
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#ffffff", borderRadius: 20, padding: "4px 10px", fontSize: 11, cursor: "pointer", transition: "all 0.15s", userSelect: "none" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#8052ff"; e.currentTarget.style.background = "rgba(128,82,255,0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                >
                  Passport 📖
                </button>
              </div>
            </div>
          </div>
          
          <div 
            style={{ 
              textAlign: "center", 
              color: "#8052ff", 
              fontFamily: "'Space Grotesk', sans-serif", 
              fontWeight: 500, 
              fontSize: 13, 
              opacity: hovered ? 1 : 0, 
              transition: "opacity 0.2s ease, transform 0.2s ease",
              transform: hovered ? "translateY(0)" : "translateY(4px)",
              paddingTop: 4,
              paddingBottom: 4,
              marginTop: 4,
            }}
          >
            View Profile →
          </div>
        </div>
      </CometCard>
    </motion.div>
  );
}

function AddPetModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (values: any) => Promise<void> | void }) {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("Cat");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [weightError, setWeightError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const petSchema = z.object({
      name: z.string().min(1, "Pet name is required").max(30, "Name is too long"),
      species: z.enum(["Dog", "Cat"]),
      breed: z.string().max(50, "Breed is too long").optional().or(z.literal("")),
      age_years: z.coerce.number().min(0, "Age cannot be negative").max(30, "Age must be less than 30"),
      weight_kg: z.coerce.number().min(0, "Weight cannot be negative").max(200, "Weight must be less than 200").optional().nullable()
    });

    const parsedAge = age === "" ? undefined : Number(age);
    const parsedWeight = weight === "" ? undefined : Number(weight);

    const validationResult = petSchema.safeParse({
      name,
      species,
      breed,
      age_years: parsedAge,
      weight_kg: parsedWeight
    });

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.format();
      if (formattedErrors.name) setNameError(true);
      if (formattedErrors.age_years) setAgeError(true);
      if (formattedErrors.weight_kg) setWeightError(true);
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    setNameError(false);
    setAgeError(false);
    setWeightError(false);
    
    setSubmitting(true);
    try {
      await onSubmit({
        name,
        species,
        breed,
        age_years: Number(age),
        weight_kg: weight ? Number(weight) : undefined,
        photo: photo || undefined
      });
      toast.success(`${name} has been added successfully!`);
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch (err: any) {
      toast.error(err.message || "Failed to add pet");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 32, textAlign: "center", width: "calc(100% - 32px)", maxWidth: 380 }}>
          <motion.svg initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ margin: "0 auto 16px" }}>
            <circle cx="32" cy="32" r="28" stroke="rgba(128,82,255,0.2)" strokeWidth="3" />
            <motion.path d="M20 32 L28 40 L44 24" stroke="#8052ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.3 }} />
          </motion.svg>
          <p style={{ fontSize: 20, fontWeight: 600, color: "#ffffff" }}>Welcome, {name}! 🐾</p>
          <p style={{ fontSize: 14, color: "#9a9a9a", marginTop: 8 }}>Your pet profile has been created.</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 24, width: "calc(100% - 32px)", maxWidth: 440, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 0 60px rgba(128,82,255,0.08)", position: "relative" }}
      >
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#9a9a9a", fontSize: 18, cursor: "pointer" }}>✕</button>

        <div style={{ marginBottom: 24 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#8052ff" style={{ marginBottom: 8 }}>
            <ellipse cx="7" cy="5" rx="2.5" ry="3" />
            <ellipse cx="17" cy="5" rx="2.5" ry="3" />
            <path d="M12 22c-4 0-6-3-6-6 0-2 2-4 6-4s6 2 6 4c0 3-2 6-6 6z" />
          </svg>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: "#ffffff" }}>Add New Pet</h2>
          <p style={{ fontSize: 13, color: "#9a9a9a", marginTop: 4 }}>Tell us about your furry companion</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 8 }}>
            <motion.label whileHover={{ scale: 1.05 }} style={{ width: 96, height: 96, borderRadius: "50%", background: photoPreview ? "none" : "rgba(128,82,255,0.08)", border: photoPreview ? "2px solid #8052ff" : "2px dashed rgba(128,82,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", transition: "all 0.2s" }}>
              {photoPreview ? (
                <img src={photoPreview} alt="Pet" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8052ff" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="12" cy="12" r="3" /><path d="M3 8h2l1-2h12l1 2h2" /></svg>
              )}
              <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
            </motion.label>
            <span style={{ fontSize: 12, color: "#9a9a9a", marginTop: 6 }}>{photoPreview ? "Photo added ✓" : "Upload photo"}</span>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#9a9a9a", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>PET NAME</label>
            <motion.input
              animate={nameError ? { x: [0, -8, 8, -6, 6, 0] } : {}}
              transition={{ duration: 0.4 }}
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(false); }}
              placeholder="What's their name?"
              style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${nameError ? "#ff6b6b" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", transition: "all 0.2s" }}
              onFocus={(e) => { if (!nameError) e.currentTarget.style.borderColor = "#8052ff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(128,82,255,0.12)"; }}
              onBlur={(e) => { if (!nameError) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
            />
            {nameError && <p style={{ fontSize: 12, color: "#ff6b6b", marginTop: 4 }}>Pet name is required</p>}
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#9a9a9a", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>SPECIES</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["Dog", "Cat"].map((s) => (
                <motion.button
                  key={s}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSpecies(s)}
                  style={{ flex: 1, padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: "pointer", background: species === s ? "rgba(128,82,255,0.2)" : "rgba(255,255,255,0.04)", border: species === s ? "1px solid #8052ff" : "1px solid rgba(255,255,255,0.08)", color: species === s ? "#ffffff" : "#9a9a9a", transition: "all 0.2s" }}
                >
                  {s === "Dog" ? "🐶" : "🐱"} {s}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#9a9a9a", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>BREED</label>
            <input value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="e.g. Golden Retriever" style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", transition: "all 0.2s" }} onFocus={(e) => { e.currentTarget.style.borderColor = "#8052ff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(128,82,255,0.12)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#9a9a9a", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>AGE (YEARS)</label>
              <motion.input
                animate={ageError ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                transition={{ duration: 0.4 }}
                value={age}
                onChange={(e) => { setAge(e.target.value); setAgeError(false); }}
                type="number"
                placeholder="Age"
                min="0"
                max="30"
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${ageError ? "#ff6b6b" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", transition: "all 0.2s" }}
                onFocus={(e) => { if (!ageError) e.currentTarget.style.borderColor = "#8052ff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(128,82,255,0.12)"; }}
                onBlur={(e) => { if (!ageError) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
              />
              {ageError && <p style={{ fontSize: 12, color: "#ff6b6b", marginTop: 4 }}>Please enter a valid age (0-30 years)</p>}
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#9a9a9a", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>WEIGHT (KG)</label>
              <motion.input
                animate={weightError ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                transition={{ duration: 0.4 }}
                value={weight}
                onChange={(e) => { setWeight(e.target.value); setWeightError(false); }}
                type="number"
                placeholder="Weight"
                min="0"
                max="200"
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${weightError ? "#ff6b6b" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", transition: "all 0.2s" }}
                onFocus={(e) => { if (!weightError) e.currentTarget.style.borderColor = "#8052ff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(128,82,255,0.12)"; }}
                onBlur={(e) => { if (!weightError) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
              />
              {weightError && <p style={{ fontSize: 12, color: "#ff6b6b", marginTop: 4 }}>Please enter a valid weight (0-200 kg)</p>}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "#9a9a9a", borderRadius: 24, padding: 14, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>Cancel</button>
            <motion.button
              type="submit"
              disabled={submitting}
              animate={submitting ? {} : { boxShadow: ["0 0 0px rgba(128,82,255,0)", "0 0 24px rgba(128,82,255,0.5)", "0 0 0px rgba(128,82,255,0)"] }}
              transition={submitting ? {} : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{ flex: 1, background: "#8052ff", border: "none", color: "#fff", borderRadius: 24, padding: 14, fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? "..." : "Add Pet"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function PetsPage() {
  const { pets, loading, addPet, deletePet } = usePets();
  const [showModal, setShowModal] = useState(false);
  const [selectedPassportPet, setSelectedPassportPet] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = "My Pets — PawPal AI";
      
      const handleAddPetCmd = () => {
        setShowModal(true);
      };
      window.addEventListener("pawpal_add_pet", handleAddPetCmd);
      return () => {
        window.removeEventListener("pawpal_add_pet", handleAddPetCmd);
      };
    }
  }, []);

  const handleAddPet = async (values: any) => {
    await addPet(values);
    setShowModal(false);
  };

  if (loading) {
    return <p style={{ color: "#9a9a9a", fontSize: 15 }}>Loading...</p>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-start mb-8">
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 300, color: "#ffffff", marginBottom: 4 }}>My Pets</h1>
          <p style={{ fontSize: 15, color: "#9a9a9a", userSelect: "none" }}>Manage profiles for all your furry companions.</p>
        </div>
        <NoiseBackground
          containerClassName="rounded-full w-fit p-[1.5px] self-start"
          gradientColors={["#8052ff", "#ff6b6b", "#ffb829"]}
        >
          <button
            onClick={() => setShowModal(true)}
            className="cursor-pointer rounded-full bg-black hover:bg-neutral-900 text-white px-5 py-2.5 transition-all duration-100 active:scale-98 text-xs font-semibold uppercase tracking-wider"
            style={{ border: "none" }}
          >
            Add Pet +
          </button>
        </NoiseBackground>
      </div>

      {pets.length === 0 ? (
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
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#8052ff" style={{ opacity: 0.8 }}>
              <ellipse cx="7" cy="5" rx="2.5" ry="3" />
              <ellipse cx="17" cy="5" rx="2.5" ry="3" />
              <path d="M12 22c-4 0-6-3-6-6 0-2 2-4 6-4s6 2 6 4c0 3-2 6-6 6z" />
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", marginBottom: 6 }}>No Pets Profiled</h3>
            <p style={{ fontSize: 14, color: "#9a9a9a", maxWidth: 320, margin: "0 auto", lineHeight: 1.5 }}>
              Add your pet's name, age, and breed to start monitoring their health score and vaccine due dates.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{ background: "#8052ff", color: "#fff", border: "none", borderRadius: 20, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 8 }}
          >
            Add Your First Pet +
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {pets.map((pet, i) => (
            <PetCard key={pet.id || pet.name} pet={pet} index={i} onDelete={deletePet} onOpenPassport={(p) => setSelectedPassportPet(p)} />
          ))}
        </div>
      )}

      {showModal && <AddPetModal onClose={() => setShowModal(false)} onSubmit={handleAddPet} />}
      {selectedPassportPet && <PassportModal pet={selectedPassportPet} onClose={() => setSelectedPassportPet(null)} />}
    </div>
  );
}
