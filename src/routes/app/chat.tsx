import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { usePets } from "@/hooks/usePets";
import { useChat } from "@/hooks/useChat";
import { toast } from "sonner";
import { PawPrint } from "lucide-react";
import * as THREE from "three";

export const Route = createFileRoute("/app/chat")({
  component: ChatPage,
});

const suggestions = [
  "Is my pet's ear scratching serious?",
  "What vaccines does my pet need this year?",
  "My dog won't eat today, what should I do?",
  "How do I check for ticks on my cat?",
];

function renderMessageContent(content: string) {
  if (!content) return "";
  
  // Check if content contains triple backtick code blocks
  if (content.includes("```")) {
    const segments = content.split("```");
    return segments.map((segment, idx) => {
      if (idx % 2 === 1) {
        // It's a code block
        const lines = segment.split("\n");
        const language = lines[0].trim();
        const code = lines.slice(1).join("\n");
        return (
          <pre key={idx} style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, overflowX: "auto", fontFamily: "monospace", fontSize: 13, color: "#d4c5ff", margin: "12px 0" }}>
            {language && <div style={{ fontSize: 10, color: "#9a9a9a", textTransform: "uppercase", marginBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 4 }}>{language}</div>}
            <code>{code}</code>
          </pre>
        );
      }
      return renderMarkdownText(segment);
    });
  }

  return renderMarkdownText(content);
}

function renderMarkdownText(text: string) {
  const lines = text.split("\n");
  let inList = false;
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  
  const parseFormatting = (t: string) => {
    const parts = t.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={idx} style={{ fontWeight: 600, color: "#ffffff" }}>{part.slice(2, -2)}</strong>;
      } else if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={idx} style={{ fontStyle: "italic", color: "#bdbdbd" }}>{part.slice(1, -1)}</em>;
      } else if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={idx} style={{ background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: 4, fontFamily: "monospace", fontSize: 13, color: "#e0d5ff" }}>{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ")) {
      if (inList) {
        elements.push(<ul key={`list-${index}`} style={{ margin: "8px 0" }}>{listItems}</ul>);
        inList = false;
      }
      elements.push(<h3 key={index} style={{ fontSize: 16, fontWeight: 600, color: "#ffffff", marginTop: 12, marginBottom: 6 }}>{parseFormatting(trimmed.substring(4))}</h3>);
    } else if (trimmed.startsWith("## ")) {
      if (inList) {
        elements.push(<ul key={`list-${index}`} style={{ margin: "8px 0" }}>{listItems}</ul>);
        inList = false;
      }
      elements.push(<h2 key={index} style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", marginTop: 16, marginBottom: 8 }}>{parseFormatting(trimmed.substring(3))}</h2>);
    } else if (trimmed.startsWith("# ")) {
      if (inList) {
        elements.push(<ul key={`list-${index}`} style={{ margin: "8px 0" }}>{listItems}</ul>);
        inList = false;
      }
      elements.push(<h1 key={index} style={{ fontSize: 20, fontWeight: 600, color: "#ffffff", marginTop: 20, marginBottom: 10 }}>{parseFormatting(trimmed.substring(2))}</h1>);
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) {
        inList = true;
        listItems = [];
      }
      listItems.push(
        <li key={index} style={{ marginBottom: 4, listStyleType: "none", display: "flex", alignItems: "flex-start", gap: 8 }}>
          <span style={{ color: "#8052ff", flexShrink: 0 }}>•</span>
          <div>{parseFormatting(trimmed.substring(2))}</div>
        </li>
      );
    } else {
      if (inList) {
        elements.push(<ul key={`list-${index}`} style={{ margin: "8px 0" }}>{listItems}</ul>);
        inList = false;
      }
      if (trimmed) {
        elements.push(<p key={index} style={{ marginBottom: 8 }}>{parseFormatting(trimmed)}</p>);
      }
    }
  });
  
  if (inList) {
    elements.push(<ul key="list-final" style={{ margin: "8px 0" }}>{listItems}</ul>);
  }
  return elements;
}

function renderUserMessage(content: string) {
  if (content.startsWith("||IMAGE:")) {
    const parts = content.split("||");
    const imageData = parts[1].replace("IMAGE:", "");
    const textContent = parts.slice(2).join("||");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <img src={imageData} alt="Attached symptom" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 12, display: "block" }} />
        {textContent && <p style={{ margin: 0 }}>{textContent}</p>}
      </div>
    );
  }
  return content;
}

function ThreeDBodyMap({ setInput }: { setInput: (val: string) => void }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = 280;
    const height = 160;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10);
    camera.position.set(0, 0, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x8052ff,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });

    const headGeo = new THREE.SphereGeometry(0.7, 10, 10);
    const headMesh = new THREE.Mesh(headGeo, wireMaterial);
    group.add(headMesh);

    const muzzleGeo = new THREE.CylinderGeometry(0.22, 0.3, 0.5, 8);
    const muzzleMesh = new THREE.Mesh(muzzleGeo, wireMaterial);
    muzzleMesh.position.set(0, -0.15, 0.55);
    muzzleMesh.rotation.x = Math.PI / 2.3;
    group.add(muzzleMesh);

    const earGeo = new THREE.BoxGeometry(0.3, 0.5, 0.2);
    const leftEar = new THREE.Mesh(earGeo, wireMaterial);
    leftEar.position.set(-0.65, 0.4, 0);
    leftEar.rotation.z = 0.2;
    group.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, wireMaterial);
    rightEar.position.set(0.65, 0.4, 0);
    rightEar.rotation.z = -0.2;
    group.add(rightEar);

    const nodesData = [
      { id: "ears", label: "Ears 👂", x: 0.65, y: 0.5, z: 0.1, prompt: "My pet is shaking their head, scratching their ears, and has some discharge. What could this indicate, and how should I clean their ears?" },
      { id: "eyes", label: "Eyes/Face 👁️", x: 0, y: 0.15, z: 0.7, prompt: "I'm noticing redness and watering in my pet's eyes, and their nose feels dry. What are normal facial health signs to check?" },
      { id: "stomach", label: "Digestion 🥩", x: 0, y: -0.4, z: 0.5, prompt: "My pet's stomach feels hard, and they are trying to vomit but nothing is coming out. What should I check, and is this bloat?" },
      { id: "paws", label: "Paws/Skin 🐾", x: -0.5, y: -0.8, z: 0.2, prompt: "My pet is constantly chewing and licking their paws, and the skin looks raw. Is this likely allergies, and how can I soothe it?" },
      { id: "joints", label: "Spine/Joints 🦴", x: 0, y: -0.5, z: -0.5, prompt: "My pet is hesitating to jump, limping slightly on their hind legs, or showing stiffness when getting up. How can I support their joints?" }
    ];

    const nodeMeshes: THREE.Mesh[] = [];
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0x8052ff,
      transparent: true,
      opacity: 0.8
    });

    nodesData.forEach((data) => {
      const geo = new THREE.SphereGeometry(0.08, 8, 8);
      const mesh = new THREE.Mesh(geo, nodeMaterial.clone());
      mesh.position.set(data.x, data.y, data.z);
      (mesh as any).nodeId = data.id;
      (mesh as any).nodeLabel = data.label;
      (mesh as any).nodePrompt = data.prompt;
      group.add(mesh);
      nodeMeshes.push(mesh);
    });

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x8052ff,
      transparent: true,
      opacity: 0.25
    });

    const points = nodeMeshes.map(m => m.position);
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      points[0], points[1],
      points[1], points[2],
      points[2], points[3],
      points[3], points[4],
      points[4], points[0],
      points[1], points[3]
    ]);
    const lines = new THREE.LineSegments(lineGeo, lineMaterial);
    group.add(lines);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let currentHoveredMesh: THREE.Mesh | null = null;

    const onPointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        if (currentHoveredMesh !== hitMesh) {
          if (currentHoveredMesh) {
            currentHoveredMesh.scale.set(1, 1, 1);
            (currentHoveredMesh.material as THREE.MeshBasicMaterial).color.setHex(0x8052ff);
          }
          currentHoveredMesh = hitMesh;
          currentHoveredMesh.scale.set(1.5, 1.5, 1.5);
          (currentHoveredMesh.material as THREE.MeshBasicMaterial).color.setHex(0xffffff);
          setHoveredLabel((currentHoveredMesh as any).nodeLabel);
          renderer.domElement.style.cursor = "pointer";
        }
      } else {
        if (currentHoveredMesh) {
          currentHoveredMesh.scale.set(1, 1, 1);
          (currentHoveredMesh.material as THREE.MeshBasicMaterial).color.setHex(0x8052ff);
          currentHoveredMesh = null;
          setHoveredLabel(null);
          renderer.domElement.style.cursor = "default";
        }
      }
    };

    const onClick = () => {
      if (currentHoveredMesh) {
        setInput((currentHoveredMesh as any).nodePrompt);
      }
    };

    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("click", onClick);

    let rafId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const time = clock.getElapsedTime();
      group.rotation.y = Math.sin(time * 0.4) * 0.35;
      group.rotation.x = Math.cos(time * 0.35) * 0.12;

      nodeMeshes.forEach((mesh) => {
        if (mesh !== currentHoveredMesh) {
          const pulse = 1 + Math.sin(time * 3 + mesh.position.x * 10) * 0.15;
          mesh.scale.set(pulse, pulse, pulse);
        }
      });

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("click", onClick);
      renderer.dispose();
      headGeo.dispose();
      muzzleGeo.dispose();
      earGeo.dispose();
      wireMaterial.dispose();
      nodeMaterial.dispose();
      lineMaterial.dispose();
      lineGeo.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [setInput]);

  return (
    <div 
      style={{
        width: 280,
        height: 160,
        background: "rgba(128,82,255,0.02)",
        border: "1px solid rgba(128,82,255,0.1)",
        borderRadius: 20,
        position: "relative",
        overflow: "hidden",
        flexShrink: 0
      }}
    >
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
      {hoveredLabel && (
        <div 
          style={{
            position: "absolute",
            bottom: 8,
            left: 0,
            right: 0,
            textAlign: "center",
            color: "#ffffff",
            fontSize: 11,
            fontWeight: 600,
            fontFamily: "'Space Grotesk', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            pointerEvents: "none",
            background: "rgba(0,0,0,0.7)",
            padding: "2px 8px",
            borderRadius: 8,
            width: "fit-content",
            margin: "0 auto"
          }}
        >
          {hoveredLabel}
        </div>
      )}
    </div>
  );
}

function ChatPage() {
  const { pets } = usePets();
  const [selectedPetId, setSelectedPetId] = useState<string | undefined>(undefined);
  const { messages, sending, error, sendMessage, clearHistory } = useChat(selectedPetId);
  const [input, setInput] = useState("");
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [showPetMenu, setShowPetMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastSendTimeRef = useRef<number>(0);
  const [attachedImage, setAttachedImage] = useState<{ mimeType: string; data: string; previewUrl: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const resultStr = reader.result as string;
      const base64Data = resultStr.split(",")[1];
      setAttachedImage({
        mimeType: file.type,
        data: base64Data,
        previewUrl: resultStr
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = "AI Chat — PawPal AI";
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US";

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        setRecognition(rec);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser. Please try Google Chrome or Safari.");
      return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleSend = () => {
    if ((!input.trim() && !attachedImage) || sending) return;

    const now = Date.now();
    if (now - lastSendTimeRef.current < 2000) {
      toast.error("Please wait a moment before sending another message.");
      return;
    }
    lastSendTimeRef.current = now;

    sendMessage(
      input,
      selectedPetId,
      attachedImage ? { mimeType: attachedImage.mimeType, data: attachedImage.data } : undefined
    );
    setInput("");
    setAttachedImage(null);
  };

  const selectedPet = pets.find((p) => p.id === selectedPetId);

  return (
    <div style={{ background: "#000000", height: "calc(100vh - 100px)", display: "flex", flexDirection: "column", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", overflow: "hidden" }}>
      {/* Pet Selection Header Bar */}
      <div style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 24px", display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: "#9a9a9a" }}>Chatting about:</span>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowPetMenu(!showPetMenu)}
              style={{
                background: "rgba(128,82,255,0.1)",
                border: "1px solid rgba(128,82,255,0.3)",
                color: "#ffffff",
                borderRadius: "20px",
                padding: "6px 14px",
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontWeight: 600
              }}
            >
              {selectedPet ? (
                <>
                  {selectedPet.photo_url ? (
                    <img src={selectedPet.photo_url} alt={selectedPet.name} style={{ width: 18, height: 18, borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#8052ff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>{selectedPet.name[0]}</span>
                  )}
                  {selectedPet.name}
                </>
              ) : (
                "All Pets"
              )}
              <span>▾</span>
            </button>
            {showPetMenu && (
              <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 4, background: "#111111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 4, zIndex: 30, minWidth: 160 }}>
                <button
                  onClick={() => { setSelectedPetId(undefined); setShowPetMenu(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", background: !selectedPetId ? "rgba(128,82,255,0.2)" : "transparent", border: "none", color: "#fff", padding: "8px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}
                >
                  All Pets
                </button>
                {pets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedPetId(p.id); setShowPetMenu(false); }}
                    style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", background: selectedPetId === p.id ? "rgba(128,82,255,0.2)" : "transparent", border: "none", color: "#fff", padding: "8px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}
                  >
                    {p.photo_url ? (
                      <img src={p.photo_url} alt={p.name} style={{ width: 16, height: 16, borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ width: 16, height: 16, borderRadius: "50%", background: "#8052ff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>{p.name[0]}</span>
                    )}
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button onClick={clearHistory} style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", color: "#ff6b6b", borderRadius: 20, padding: "6px 14px", fontSize: 12, cursor: "pointer" }}>Clear Chat</button>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        {error && (
          <div style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: 12, padding: "12px 16px", color: "#ff6b6b", fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Error loading messages: {error}</span>
            <button onClick={() => window.location.reload()} style={{ background: "#ff6b6b", border: "none", color: "#fff", padding: "4px 8px", borderRadius: 8, fontSize: 11, cursor: "pointer" }}>Retry</button>
          </div>
        )}

        {messages.length === 0 && !sending ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            height: "100%",
            minHeight: 0,
            gap: 24,
            padding: "48px 0"
          }}>
            
            {/* Paw Illustration with Breathing Animation */}
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              style={{
                width: 80,
                height: 80,
                background: "rgba(128,82,255,0.1)",
                border: "1px solid rgba(128,82,255,0.2)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <PawPrint size={36} color="#8052ff" />
            </motion.div>

            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 18, color: "#ffffff", textAlign: "center", margin: 0, fontWeight: 500, fontFamily: "'Space Grotesk', sans-serif" }}>Ask PawPal AI anything about your pet's health.</p>
              <p style={{ fontSize: 12, color: "#9a9a9a", textAlign: "center", marginTop: 8, marginBottom: 0, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400 }}>
                Powered by Google Gemini · Responses are not a substitute for professional veterinary advice.
              </p>
            </div>

            {/* AI Feature Pills Row */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 8 }}>
              {[
                "🎤 Voice Input",
                "📷 Photo Analysis",
                "🐾 Per-Pet Context"
              ].map((pill) => (
                <span 
                  key={pill} 
                  style={{ 
                    background: "rgba(255,255,255,0.04)", 
                    border: "1px solid rgba(255,255,255,0.08)", 
                    color: "#9a9a9a", 
                    borderRadius: "20px", 
                    padding: "4px 12px", 
                    fontSize: 12,
                    fontFamily: "'Space Grotesk', sans-serif" 
                  }}
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* Triage Dashboard Container */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center w-full max-w-4xl mt-3">
              {/* 3D Blueprint Body Map */}
              <ThreeDBodyMap setInput={setInput} />

              {/* Symptom Quick-Triage Hub */}
              <div style={{ flex: 1, width: "100%", maxWidth: 440 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#9a9a9a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12, fontFamily: "'Space Grotesk', sans-serif" }}>
                  Select symptom or click interactive 3D hotspot:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    {
                      title: "Skin & Ears 🐾",
                      desc: "Scratching, rashes, tick check",
                      prompt: "My pet is scratching their ears and shaking their head frequently. What are common causes, and how do I examine their ears safely?"
                    },
                    {
                      title: "Digestion & Food 🥩",
                      desc: "Loss of appetite, vomiting risk",
                      prompt: "My pet has lost their appetite today and isn't eating. What symptoms should I watch for, and when is it a veterinary emergency?"
                    },
                    {
                      title: "Energy & Sleep ⚡",
                      desc: "Lethargy, sleeping, stiff joints",
                      prompt: "My pet seems unusually lethargic and is sleeping much more than normal. How can I check their vital signs at home?"
                    },
                    {
                      title: "Vaccines & Checks 🩺",
                      desc: "Triage checks & routine guidelines",
                      prompt: "How often does my pet need vaccinations, and what is the best way to inspect them for ticks and fleas after outdoor play?"
                    }
                  ].map((s) => (
                    <button
                      key={s.title}
                      onClick={() => setInput(s.prompt)}
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 16,
                        padding: "12px 16px",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#8052ff";
                        e.currentTarget.style.background = "rgba(128,82,255,0.05)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#ffffff", fontFamily: "'Space Grotesk', sans-serif" }}>{s.title}</span>
                      <span style={{ fontSize: 10, color: "#9a9a9a", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.3 }}>{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id || i}
                initial={{ opacity: 0, x: msg.role === "user" ? 12 : -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, maxWidth: msg.role === "user" ? "70%" : "75%", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: msg.role === "user" ? "#8052ff" : "rgba(255,255,255,0.1)", border: msg.role === "user" ? "none" : "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, fontWeight: "bold", color: "#fff" }}>
                    {msg.role === "user" ? "U" : "AI"}
                  </div>
                  <div style={{
                    background: msg.role === "user" ? "#8052ff" : "rgba(255,255,255,0.04)",
                    border: msg.role === "user" ? "none" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: msg.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                    padding: "14px 18px",
                    fontSize: 15,
                    color: msg.role === "user" ? "#ffffff" : "#e0e0e0",
                    lineHeight: 1.6,
                  }}>
                    {msg.role === "user" ? renderUserMessage(msg.content) : renderMessageContent(msg.content)}
                  </div>
                </div>
                <span style={{ fontSize: 11, color: msg.role === "user" ? "rgba(255,255,255,0.5)" : "#9a9a9a", marginTop: 4, marginLeft: msg.role === "assistant" ? 44 : 0, marginRight: msg.role === "user" ? 44 : 0, textAlign: msg.role === "user" ? "right" : "left" }}>
                  {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                </span>
              </motion.div>
            ))}
            {/* Typing indicator */}
            {sending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(128,82,255,0.2)", border: "1px solid rgba(128,82,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span>AI</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px 18px 18px 18px", padding: "14px 18px", display: "flex", gap: 4 }}>
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} style={{ width: 6, height: 6, borderRadius: "50%", background: "#8052ff" }} />
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} style={{ width: 6, height: 6, borderRadius: "50%", background: "#8052ff" }} />
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} style={{ width: 6, height: 6, borderRadius: "50%", background: "#8052ff" }} />
                </div>
              </motion.div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attached Image Preview */}
      {attachedImage && (
        <div style={{ padding: "12px 24px", background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <div style={{ position: "relative", width: 60, height: 60 }}>
            <img src={attachedImage.previewUrl} alt="Preview" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, border: "1px solid #8052ff" }} />
            <button
              onClick={() => setAttachedImage(null)}
              style={{ position: "absolute", top: -6, right: -6, background: "#ff6b6b", border: "none", color: "#ffffff", width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, cursor: "pointer", fontWeight: "bold" }}
            >
              ✕
            </button>
          </div>
          <span style={{ fontSize: 12, color: "#9a9a9a" }}>Image attached. Submit query to analyze symptoms.</span>
        </div>
      )}

      {/* Input Bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)", padding: "16px 24px", display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
        <button onClick={() => fileInputRef.current?.click()} style={{ background: "none", border: "none", color: "#9a9a9a", cursor: "pointer", fontSize: 18 }} title="Attach Image">📎</button>
        <button
          onClick={toggleListening}
          style={{
            background: isListening ? "rgba(255,80,80,0.15)" : "none",
            border: isListening ? "1px solid rgba(255,80,80,0.4)" : "none",
            color: isListening ? "#ff6b6b" : "#9a9a9a",
            cursor: "pointer",
            fontSize: 18,
            width: 32,
            height: 32,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative"
          }}
          title={isListening ? "Stop listening" : "Ask by voice"}
        >
          {isListening ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b6b] animate-ping absolute" />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <rect x="9" y="9" width="6" height="6" />
              </svg>
            </>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          )}
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          placeholder="Describe your pet's symptoms..."
          style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "14px 20px", fontSize: 15, color: "#ffffff", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#8052ff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(128,82,255,0.1)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
        />
        <motion.button
          onClick={handleSend}
          whileHover={{ boxShadow: "0 0 16px rgba(128,82,255,0.5)" }}
          whileTap={{ scale: 0.9 }}
          disabled={(!input.trim() && !attachedImage) || sending}
          style={{ width: 44, height: 44, borderRadius: "50%", background: (input.trim() || attachedImage) && !sending ? "#8052ff" : "rgba(128,82,255,0.3)", border: "none", color: "#fff", cursor: (input.trim() || attachedImage) && !sending ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, transition: "background 0.2s" }}
        >
          {sending ? (
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            "✈"
          )}
        </motion.button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} accept="image/*" />
      </div>
      <p style={{ textAlign: "center", fontSize: 11, color: "#9a9a9a", opacity: 0.6, padding: "6px 0 12px", margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
        PawPal AI can make mistakes. Always consult a vet for medical decisions.
        <br />
        🔒 Your conversations are encrypted and stored securely. Gemini API key never reaches your browser.
      </p>
    </div>
  );
}
