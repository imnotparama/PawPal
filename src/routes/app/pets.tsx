import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { CometCard } from "@/components/ui/comet-card";

export const Route = createFileRoute("/app/pets")({
  component: PetsPage,
});

const pets = [
  {
    name: "Max",
    breed: "Golden Retriever",
    age: "7y",
    initial: "M",
    photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
  },
  {
    name: "Luna",
    breed: "Siamese Cat",
    age: "3y",
    initial: "L",
    photo: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=400",
  },
  {
    name: "Milo",
    breed: "French Bulldog",
    age: "2y",
    initial: "Mi",
    photo: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400",
  },
];

function PetCard({ pet, index }: { pet: typeof pets[0]; index: number }) {
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
            <img
              src={pet.photo}
              alt={pet.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
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
            <p style={{ fontSize: 13, color: "#9a9a9a", marginTop: 2 }}>{pet.breed} · {pet.age}</p>
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

function PetsPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 300, color: "#ffffff", marginBottom: 4 }}>My Pets</h1>
          <p style={{ fontSize: 15, color: "#9a9a9a" }}>Manage profiles for all your furry companions.</p>
        </div>
        <motion.button
          animate={{ boxShadow: ["0 0 0px rgba(128,82,255,0)", "0 0 20px rgba(128,82,255,0.4)", "0 0 0px rgba(128,82,255,0)"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "#8052ff", color: "#fff", borderRadius: 24, padding: "12px 24px", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}
        >
          Add Pet +
        </motion.button>
      </div>

      {/* Pet Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 280px)", gap: 24 }}>
        {pets.map((pet, i) => (
          <PetCard key={pet.name} pet={pet} index={i} />
        ))}
      </div>
    </div>
  );
}
