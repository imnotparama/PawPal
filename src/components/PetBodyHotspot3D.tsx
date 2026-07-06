import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

interface CategoryData {
  id: string;
  name: string;
  emoji: string;
  keywords: string;
  prompt: string;
  pinTop: string;
  pinLeft: string;
  animationDelay: number;
}

const categories: CategoryData[] = [
  {
    id: "skin_ears",
    name: "Skin & Ears",
    emoji: "🐾",
    keywords: "Scratching, rashes, tick check",
    prompt: "My pet has been scratching their ears and skin a lot. Could this be an infection or allergies?",
    pinTop: "18%",
    pinLeft: "52%",
    animationDelay: 0
  },
  {
    id: "digestion",
    name: "Digestion & Food",
    emoji: "🍖",
    keywords: "Loss of appetite, vomiting risk",
    prompt: "My pet hasn't been eating well and seems nauseous. What could be causing this?",
    pinTop: "52%",
    pinLeft: "45%",
    animationDelay: 0.5
  },
  {
    id: "energy_sleep",
    name: "Energy & Sleep",
    emoji: "⚡",
    keywords: "Lethargy, sleeping, stiff joints",
    prompt: "My pet seems lethargic and is sleeping more than usual. Should I be concerned?",
    pinTop: "72%",
    pinLeft: "35%",
    animationDelay: 1.0
  },
  {
    id: "vaccines_checks",
    name: "Vaccines & Checks",
    emoji: "💉",
    keywords: "Triage checks & routine guidelines",
    prompt: "Can you tell me what routine vaccinations and health checks my pet needs at their current age?",
    pinTop: "38%",
    pinLeft: "62%",
    animationDelay: 1.5
  }
];

// Helper canvas particles background
const ParticleField = () => {
  const mountRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = mountRef.current;
    if (!canvas) return;

    const width = 300;
    const height = 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2));

    const particlesCount = 80;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const velocities: number[] = [];

    for (let i = 0; i < particlesCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12; // X
      positions[i + 1] = (Math.random() - 0.5) * 12; // Y
      positions[i + 2] = (Math.random() - 0.5) * 10; // Z

      velocities.push(
        (Math.random() - 0.5) * 0.004,
        (Math.random() - 0.5) * 0.004,
        (Math.random() - 0.5) * 0.004
      );
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x8052ff,
      size: 0.15,
      transparent: true,
      opacity: 0.15,
      depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let rafId = 0;
    const animate = () => {
      const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
      const positionsArray = posAttr.array as Float32Array;

      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        positionsArray[i3] += velocities[i3];
        positionsArray[i3 + 1] += velocities[i3 + 1];
        positionsArray[i3 + 2] += velocities[i3 + 2];

        if (Math.abs(positionsArray[i3]) > 6) positionsArray[i3] = -positionsArray[i3];
        if (Math.abs(positionsArray[i3 + 1]) > 6) positionsArray[i3 + 1] = -positionsArray[i3 + 1];
        if (Math.abs(positionsArray[i3 + 2]) > 5) positionsArray[i3 + 2] = -positionsArray[i3 + 2];
      }

      posAttr.needsUpdate = true;

      points.rotation.y += 0.0004;
      points.rotation.x += 0.0002;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    const timeoutId = setTimeout(() => {
      animate();
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas 
      ref={mountRef} 
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 300,
        height: 320,
        zIndex: 0,
        pointerEvents: "none"
      }}
    />
  );
};

interface PetBodyHotspot3DProps {
  setInput: (val: string) => void;
  focusInput: () => void;
}

export function PetBodyHotspot3D({ setInput, focusInput }: PetBodyHotspot3DProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [rotation, setRotation] = useState({ x: 4, y: -8 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const rotY = ((mouseX / rect.width) - 0.5) * 20;
    const rotX = -((mouseY / rect.height) - 0.5) * 15;
    setRotation({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 4, y: -8 });
    setActiveCategory(null);
  };

  const handleSelect = (category: CategoryData) => {
    setSelectedCategory(category.name);
    setInput(category.prompt);
    // Slight timeout to let DOM render/update and then focus the input
    setTimeout(() => {
      focusInput();
    }, 50);
  };

  const pulseStyles = `
    @keyframes pinPulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.15); opacity: 0.8; }
      100% { transform: scale(1); opacity: 1; }
    }
  `;

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", maxWidth: 700, margin: "0 auto", background: "transparent" }}>
      <style dangerouslySetInnerHTML={{ __html: pulseStyles }} />
      <div className="flex flex-col md:flex-row gap-6 items-center justify-center w-full">
        
        {/* Left Side: 3D Pet Visual Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            width: 300,
            height: 320,
            position: "relative",
            perspective: 800,
            flexShrink: 0
          }}
        >
          {/* Particle Field Behind Pet */}
          <ParticleField />

          {/* Interactive Card Container */}
          <motion.div
            style={{
              width: "100%",
              height: "100%",
              rotateX: rotation.x,
              rotateY: rotation.y,
              transformStyle: "preserve-3d",
              position: "relative",
              zIndex: 1,
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(128,82,255,0.15)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
            }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            {/* Shaded Orange Cat Image */}
            <img
              src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300"
              alt="Orange Cat"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.85) contrast(1.1)",
                pointerEvents: "none",
                transform: "translateZ(-10px) scale(1.05)"
              }}
            />

            {/* Dark Sci-Fi Overlay Grid */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, rgba(128,82,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)",
                pointerEvents: "none"
              }}
            />

            {/* Hotspot Pins */}
            {categories.map((item, index) => {
              const isHovered = activeCategory === item.name;
              const isSelected = selectedCategory === item.name;
              const isHighlighted = isHovered || isSelected;

              return (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.15, type: "spring", stiffness: 150 }}
                  style={{
                    position: "absolute",
                    top: item.pinTop,
                    left: item.pinLeft,
                    width: 28,
                    height: 28,
                    transform: "translate(-50%, -50%) translateZ(20px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10
                  }}
                >
                  {/* Pin Circle Button */}
                  <button
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setActiveCategory(item.name)}
                    onMouseLeave={() => setActiveCategory(null)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: isHighlighted ? "rgba(128,82,255,0.45)" : "rgba(128,82,255,0.2)",
                      border: isHighlighted ? "2px solid rgba(128,82,255,0.9)" : "1px solid rgba(128,82,255,0.6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transform: `scale(${isHighlighted ? 1.3 : 1})`,
                      boxShadow: isHighlighted ? "0 0 16px rgba(128,82,255,0.6)" : "none",
                      animation: isHighlighted ? "none" : "pinPulse 2s infinite ease-in-out",
                      animationDelay: `${item.animationDelay}s`,
                      transition: "transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                      padding: 0
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: isHighlighted ? "#ffffff" : "#8052ff",
                        boxShadow: isHighlighted ? "0 0 12px #ffffff" : "0 0 8px rgba(128,82,255,0.8)",
                        transition: "background-color 0.2s ease, box-shadow 0.2s ease"
                      }}
                    />
                  </button>

                  {/* Pin label Tooltip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          position: "absolute",
                          bottom: "135%",
                          left: "50%",
                          transform: "translateX(-50%) translateZ(30px)",
                          background: "rgba(0,0,0,0.9)",
                          border: "1px solid rgba(128,82,255,0.3)",
                          borderRadius: "20px",
                          padding: "4px 10px",
                          color: "#ffffff",
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 500,
                          fontSize: 11,
                          whiteSpace: "nowrap",
                          pointerEvents: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                          zIndex: 100
                        }}
                      >
                        {item.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Right Side: Symptom Category Grid */}
        <div style={{ flex: 1, width: "100%", minWidth: 280, alignSelf: "stretch", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#9a9a9a",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 12,
              fontFamily: "'Space Grotesk', sans-serif"
            }}
          >
            SELECT SYMPTOM OR CLICK INTERACTIVE HOTSPOT:
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {categories.map((item, index) => {
              const isHovered = activeCategory === item.name;
              const isSelected = selectedCategory === item.name;
              const isHighlighted = isHovered || isSelected;

              return (
                <motion.div
                  key={item.id}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.08, duration: 0.4 }}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setActiveCategory(item.name)}
                  onMouseLeave={() => setActiveCategory(null)}
                  style={{
                    background: isSelected 
                      ? "rgba(128,82,255,0.15)" 
                      : isHovered 
                        ? "rgba(128,82,255,0.1)" 
                        : "rgba(255,255,255,0.04)",
                    borderColor: isSelected 
                      ? "#8052ff" 
                      : isHovered 
                        ? "rgba(128,82,255,0.4)" 
                        : "rgba(255,255,255,0.08)",
                    boxShadow: isSelected 
                      ? "0 0 0 1px #8052ff" 
                      : isHovered 
                        ? "0 4px 20px rgba(128,82,255,0.15)" 
                        : "none",
                    transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderRadius: 12,
                    padding: 16,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "100%",
                    minHeight: 84
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#ffffff",
                      fontFamily: "'Space Grotesk', sans-serif",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 4
                    }}
                  >
                    {item.name} <span style={{ fontSize: 16 }}>{item.emoji}</span>
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#9a9a9a",
                      fontFamily: "'Space Grotesk', sans-serif",
                      lineHeight: 1.3,
                      marginTop: 4
                    }}
                  >
                    {item.keywords}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
