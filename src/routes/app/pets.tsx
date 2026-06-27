import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { CometCard } from "@/components/ui/comet-card";
import { usePets } from "@/hooks/usePets";

export const Route = createFileRoute("/app/pets")({
  component: PetsPage,
});

function PetCard({ pet, index }: { pet: any; index: number }) {
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
          <div style={{ position: "relative", aspectRatio: "3/4", borderRadius: 14, overflow: "hidden" }}>
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
          </div>

          {/* Info */}
          <div style={{ padding: "12px 8px 8px" }}>
            <p style={{ fontSize: 18, fontWeight: 600, color: "#ffffff" }}>{pet.name}</p>
            <p style={{ fontSize: 13, color: "#9a9a9a", marginTop: 2 }}>{pet.breed} · {pet.age_years}y</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
              <span style={{ background: "rgba(128,82,255,0.15)", color: "#8052ff", borderRadius: 20, padding: "4px 10px", fontSize: 11 }}>
                Healthy
              </span>
              <span style={{ color: "#9a9a9a", fontSize: 14, opacity: hovered ? 1 : 0, transition: "opacity 0.2s" }}>→</span>
            </div>
          </div>
        </div>
      </CometCard>
    </motion.div>
  );
}

function AddPetModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (values: any) => void }) {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("Dog");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name, species, breed, age_years: Number(age) || 0 });
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32, width: 380 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: "#ffffff", marginBottom: 24 }}>Add New Pet</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: "#9a9a9a", display: "block", marginBottom: 6 }}>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Pet name" style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none" }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "#9a9a9a", display: "block", marginBottom: 6 }}>Species</label>
            <select value={species} onChange={(e) => setSpecies(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none" }}>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: "#9a9a9a", display: "block", marginBottom: 6 }}>Breed</label>
            <input value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Breed" style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none" }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "#9a9a9a", display: "block", marginBottom: 6 }}>Age (years)</label>
            <input value={age} onChange={(e) => setAge(e.target.value)} type="number" placeholder="Age" style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none" }} />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9a9a9a", borderRadius: 12, padding: "12px", fontSize: 14, cursor: "pointer" }}>Cancel</button>
            <button type="submit" style={{ flex: 1, background: "#8052ff", border: "none", color: "#fff", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Add Pet</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PetsPage() {
  const { pets, loading, addPet } = usePets();
  const [showModal, setShowModal] = useState(false);

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 300, color: "#ffffff", marginBottom: 4 }}>My Pets</h1>
          <p style={{ fontSize: 15, color: "#9a9a9a" }}>Manage profiles for all your furry companions.</p>
        </div>
        <motion.button
          onClick={() => setShowModal(true)}
          animate={{ boxShadow: ["0 0 0px rgba(128,82,255,0)", "0 0 20px rgba(128,82,255,0.4)", "0 0 0px rgba(128,82,255,0)"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "#8052ff", color: "#fff", borderRadius: 24, padding: "12px 24px", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}
        >
          Add Pet +
        </motion.button>
      </div>

      {/* Pet Cards Grid */}
      {pets.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ fontSize: 18, color: "#9a9a9a" }}>No pets yet. Add your first pet!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 280px)", gap: 24 }}>
          {pets.map((pet, i) => (
            <PetCard key={pet.id || pet.name} pet={pet} index={i} />
          ))}
        </div>
      )}

      {showModal && <AddPetModal onClose={() => setShowModal(false)} onSubmit={handleAddPet} />}
    </div>
  );
}
