import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { CometCard } from "@/components/ui/comet-card";
import { usePets } from "@/hooks/usePets";
import { z } from "zod";
import { toast } from "sonner";
import { NoiseBackground } from "@/components/ui/noise-background";

export const Route = createFileRoute("/app/pets")({
  component: PetsPage,
});

function PassportModal({ pet, onClose }: { pet: any; onClose: () => void }) {
  const passportId = `PP-${pet.species.toUpperCase().slice(0, 3)}-${(pet.id || crypto.randomUUID()).slice(0, 8).toUpperCase()}`;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{ background: "#0a0a0a", border: "1px solid rgba(128,82,255,0.25)", borderRadius: 24, padding: 32, width: "calc(100% - 32px)", maxWidth: 480, boxShadow: "0 0 40px rgba(128,82,255,0.15)", position: "relative" }}
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
                <span style={{ fontSize: 14, fontWeight: 600, color: "#ffffff" }}>{pet.weight_kg ? `${pet.weight_kg} kg` : "—"}</span>
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
              <span style={{ fontSize: 16, fontWeight: 700, color: "#15846e" }}>90% COMPLIANT</span>
            </div>
            <div style={{ background: "#ffffff", padding: 4, borderRadius: 4, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#000">
                <path d="M0 0h6v6H0zm2 2v2h2V2zm0 6h4v4H2zm8-8h6v6h-6zm2 2v2h2V2zm0 6h4v4h-4zm-10 8h6v6H0zm2 2v2h2V2zm16-8h4v4h-4zm-8 8h4v4h-4zm8 4h4v4h-4z" />
              </svg>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#ffffff", borderRadius: 20, padding: "10px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            style={{ flex: 1, background: "#8052ff", border: "none", color: "#ffffff", borderRadius: 20, padding: "10px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 0 15px rgba(128,82,255,0.4)" }}
          >
            Print Passport 🖨️
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

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

function PetCard({ pet, index, onDelete, onOpenPassport }: { pet: any; index: number; onDelete: (id: string) => Promise<void>; onOpenPassport: (pet: any) => void }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: "50%", y: "50%" });

  const handleMouse = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x: `${x}%`, y: `${y}%` });
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
          {/* Photo */}
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
            {/* Hover overlay */}
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
            {/* Comet shine */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle at ${mousePos.x} ${mousePos.y}, rgba(255,255,255,0.08) 0%, transparent 60%)`,
                pointerEvents: "none",
                borderRadius: "inherit",
              }}
            />
            {/* Delete button overlay on hover */}
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

          {/* Info */}
          <div style={{ padding: "12px 8px 8px" }}>
            <p style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", userSelect: "none" }}>{pet.name}</p>
            <p style={{ fontSize: 13, color: "#9a9a9a", marginTop: 2, userSelect: "none" }}>{pet.breed} · {pet.age_years}y</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ background: "rgba(128,82,255,0.15)", color: "#8052ff", borderRadius: 20, padding: "4px 10px", fontSize: 11, userSelect: "none" }}>
                  Healthy
                </span>
                <span style={{ background: "rgba(255,184,41,0.1)", border: "1px solid rgba(255,184,41,0.2)", color: "#ffb829", borderRadius: 20, padding: "3px 10px", fontSize: 11, userSelect: "none" }}>
                  {getPetLifePhase(pet.age_years, pet.species)}
                </span>
              </div>
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
  const [species, setSpecies] = useState("Dog");
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
    
    // Zod Validation Schema
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
        {/* Close button */}
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#9a9a9a", fontSize: 18, cursor: "pointer" }}>✕</button>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#8052ff" style={{ marginBottom: 8 }}>
            <ellipse cx="7" cy="5" rx="2.5" ry="3" />
            <ellipse cx="17" cy="5" rx="2.5" ry="3" />
            <ellipse cx="4" cy="12" rx="2" ry="2.5" />
            <ellipse cx="20" cy="12" rx="2" ry="2.5" />
            <path d="M12 22c-4 0-6-3-6-6 0-2 2-4 6-4s6 2 6 4c0 3-2 6-6 6z" />
          </svg>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: "#ffffff" }}>Add New Pet</h2>
          <p style={{ fontSize: 13, color: "#9a9a9a", marginTop: 4 }}>Tell us about your furry companion</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Photo upload */}
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

          {/* Name */}
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

          {/* Species toggle */}
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

          {/* Breed */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#9a9a9a", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>BREED</label>
            <input value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="e.g. Golden Retriever" style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", transition: "all 0.2s" }} onFocus={(e) => { e.currentTarget.style.borderColor = "#8052ff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(128,82,255,0.12)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }} />
          </div>

          {/* Age + Weight row */}
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

          {/* Buttons */}
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
      {/* Header */}
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

      {/* Pet Cards Grid */}
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
