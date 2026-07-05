import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect, useRef, type MouseEvent } from "react";
import { useAuth } from "@/lib/auth";
import { usePets } from "@/hooks/usePets";
import { useVaccinations } from "@/hooks/useVaccinations";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { useChat } from "@/hooks/useChat";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function HealthArc({ score }: { score: number | null }) {
  const numericScore = score !== null ? score : 0;
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setProgress(numericScore), 100);
    return () => clearTimeout(timer);
  }, [numericScore]);
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <div style={{ position: "relative", width: 60, height: 60 }}>
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r={radius} fill="none" stroke="rgba(128,82,255,0.1)" strokeWidth="4" />
          {score !== null && (
            <circle cx="30" cy="30" r={radius} fill="none" stroke="#8052ff" strokeWidth="4" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 1s ease-out", transform: "rotate(-90deg)", transformOrigin: "center" }} />
          )}
        </svg>
        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: score !== null ? "#8052ff" : "#9a9a9a" }}>
          {score !== null ? `${score}%` : "—"}
        </span>
      </div>
      {score === null && (
        <span style={{ fontSize: 11, color: "#9a9a9a", marginTop: 8 }}>Add pets to calculate</span>
      )}
    </div>
  );
}

function MagneticCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });
  const [hovered, setHovered] = useState(false);

  const handleMouse = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) * 0.06;
    const dy = (e.clientY - rect.top - rect.height / 2) * 0.06;
    x.set(Math.max(-8, Math.min(8, dx)));
    y.set(Math.max(-8, Math.min(8, dy)));
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, borderColor: hovered ? "rgba(128,82,255,0.3)" : "rgba(255,255,255,0.08)", boxShadow: hovered ? "inset 0 0 30px rgba(128,82,255,0.08), 0 0 40px rgba(128,82,255,0.06)" : "none", transition: "border-color 0.2s, box-shadow 0.2s", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, cursor: "pointer", textAlign: "center" as const }}
      onMouseMove={handleMouse}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { x.set(0); y.set(0); setHovered(false); }}
    >
      {children}
    </motion.div>
  );
}

function PurrTherapyWidget() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [frequency, setFrequency] = useState(25); // base pitch (Hz)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const baseGainNodeRef = useRef<GainNode | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const modRef = useRef<OscillatorNode | null>(null);
  const breathRef = useRef<OscillatorNode | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const startPurring = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // 1. Base carriers (purr vibrations)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = "sine";
      osc2.type = "triangle";
      
      osc1.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc2.frequency.setValueAtTime(frequency * 1.5, ctx.currentTime);
      
      osc1Ref.current = osc1;
      osc2Ref.current = osc2;

      // 2. Modulators
      const mod = ctx.createOscillator();
      mod.type = "sine";
      mod.frequency.setValueAtTime(23, ctx.currentTime);
      modRef.current = mod;

      const modGain = ctx.createGain();
      modGain.gain.setValueAtTime(frequency * 0.35, ctx.currentTime); // sweep range

      mod.connect(modGain);
      modGain.connect(osc1.frequency);

      // 3. Breathing cycle modulator (slow swell)
      const breath = ctx.createOscillator();
      breath.type = "sine";
      breath.frequency.setValueAtTime(0.18, ctx.currentTime); // ~5 seconds cycle
      breathRef.current = breath;

      const breathGain = ctx.createGain();
      breathGain.gain.setValueAtTime(0.3, ctx.currentTime); // mod range

      const carrier1Gain = ctx.createGain();
      carrier1Gain.gain.setValueAtTime(0.4, ctx.currentTime);
      const carrier2Gain = ctx.createGain();
      carrier2Gain.gain.setValueAtTime(0.2, ctx.currentTime);

      const baseGain = ctx.createGain();
      baseGain.gain.setValueAtTime(volume * 0.8, ctx.currentTime);
      baseGainRef.current = baseGain;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(80, ctx.currentTime);

      osc1.connect(carrier1Gain);
      osc2.connect(carrier2Gain);
      
      carrier1Gain.connect(baseGain);
      carrier2Gain.connect(baseGain);

      breath.connect(breathGain);
      breathGain.connect(baseGain.gain);

      baseGain.connect(filter);
      filter.connect(ctx.destination);

      osc1.start();
      osc2.start();
      mod.start();
      breath.start();

      setIsPlaying(true);
    } catch (e) {
      console.error("Web Audio API not supported", e);
    }
  };

  const stopPurring = () => {
    try {
      osc1Ref.current?.stop();
      osc2Ref.current?.stop();
      modRef.current?.stop();
      breathRef.current?.stop();
      audioCtxRef.current?.close();
    } catch (e) {}
    setIsPlaying(false);
  };

  const togglePurr = () => {
    if (isPlaying) {
      stopPurring();
    } else {
      startPurring();
    }
  };

  useEffect(() => {
    if (baseGainNodeRef.current && audioCtxRef.current) {
      baseGainNodeRef.current.gain.setValueAtTime(volume * 0.8, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  useEffect(() => {
    if (osc1Ref.current && osc2Ref.current && audioCtxRef.current) {
      osc1Ref.current.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);
      osc2Ref.current.frequency.setValueAtTime(frequency * 1.5, audioCtxRef.current.currentTime);
    }
  }, [frequency]);

  useEffect(() => {
    return () => {
      try {
        osc1Ref.current?.stop();
        osc2Ref.current?.stop();
        modRef.current?.stop();
        breathRef.current?.stop();
        audioCtxRef.current?.close();
      } catch (e) {}
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) return;

    let phrase = 0;
    const draw = () => {
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      
      const breathingCycle = isPlaying ? (Math.sin(Date.now() * 0.0012) * 0.5 + 0.5) : 0;
      
      if (isPlaying) {
        const glowGradient = canvasCtx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 5,
          canvas.width / 2, canvas.height / 2, (canvas.width / 2) * (0.5 + breathingCycle * 0.5)
        );
        glowGradient.addColorStop(0, "rgba(128,82,255,0.12)");
        glowGradient.addColorStop(0.5, "rgba(128,82,255,0.03)");
        glowGradient.addColorStop(1, "transparent");
        canvasCtx.fillStyle = glowGradient;
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const waveCount = isPlaying ? 3 : 1;
      for (let w = 0; w < waveCount; w++) {
        canvasCtx.beginPath();
        canvasCtx.lineWidth = w === 0 ? 2 : 1;
        
        let strokeColor = "#8052ff";
        if (w === 1) strokeColor = "rgba(128,82,255,0.4)";
        if (w === 2) strokeColor = "rgba(255,184,41,0.3)";
        
        canvasCtx.strokeStyle = isPlaying ? strokeColor : "rgba(255,255,255,0.15)";
        
        const sliceWidth = canvas.width / 100;
        let x = 0;
        
        for (let i = 0; i < 100; i++) {
          const phaseOffset = w * Math.PI * 0.25;
          const amplitudeMod = isPlaying ? (Math.sin(phrase * 0.04 + w * 0.5) * 0.35 + 0.65) * (0.6 + breathingCycle * 0.4) : 0.1;
          const vibration = isPlaying ? Math.sin(x * 0.12 - phrase + phaseOffset) * (8 + w * 4) : 0;
          const wave = vibration * amplitudeMod;
          
          const y = canvas.height / 2 + wave;
          
          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        canvasCtx.stroke();
      }
      
      phrase += isPlaying ? (frequency * 0.25) : 0.05;
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, frequency]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🐈‍⬛</span>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#ffffff", margin: 0 }}>Cat Purr Therapy</h3>
            <p style={{ fontSize: 11, color: "#9a9a9a", margin: "2px 0 0" }}>Vibrational stress relief synthesizer</p>
          </div>
        </div>
        <button
          onClick={togglePurr}
          style={{
            background: isPlaying ? "rgba(255,107,107,0.15)" : "#8052ff",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 12,
            color: "#fff",
            boxShadow: isPlaying ? "0 0 10px rgba(255,107,107,0.3)" : "0 0 10px rgba(128,82,255,0.4)",
            transition: "all 0.2s"
          }}
          title={isPlaying ? "Stop Purr" : "Play Purr"}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={300}
        height={40}
        style={{
          width: "100%",
          height: 40,
          background: "rgba(0,0,0,0.2)",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.05)"
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9a9a9a" }}>
          <span>Volume</span>
          <span>{Math.round(volume * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          style={{
            width: "100%",
            accentColor: "#8052ff",
            background: "rgba(255,255,255,0.1)",
            height: 4,
            borderRadius: 2
          }}
        />
        
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9a9a9a", marginTop: 4 }}>
          <span>Vibration Pitch</span>
          <span>{Math.round(frequency)} Hz</span>
        </div>
        <input
          type="range"
          min="20"
          max="40"
          step="1"
          value={frequency}
          onChange={(e) => setFrequency(parseInt(e.target.value))}
          style={{
            width: "100%",
            accentColor: "#8052ff",
            background: "rgba(255,255,255,0.1)",
            height: 4,
            borderRadius: 2
          }}
        />
      </div>
    </div>
  );
}

const getLifePhase = (age: number, species: string) => {
  if (species.toLowerCase() !== "cat") {
    if (age <= 1) return { phase: "Puppy", advice: "Ensure standard core puppy vaccinations (DHPP, Rabies) are up to date. Focus on early training and growth diet." };
    if (age <= 7) return { phase: "Adult", advice: "Maintain annual checkups and heartworm prevention. Ensure active exercise." };
    return { phase: "Senior", advice: "Schedule bi-annual senior blood screenings. Focus on joint health and weight management." };
  }
  
  if (age < 0.5) return { phase: "Kitten (Infancy)", advice: "Critical immunization window! Feed high-protein kitten formulation. Focus on socialization." };
  if (age <= 2) return { phase: "Junior (Adolescence)", advice: "Ensure spay/neuter is complete. Monitor behavior changes and transition to adult food." };
  if (age <= 6) return { phase: "Prime (Adult)", advice: "Focus on weight maintenance and active play to prevent obesity. Annual dental checks recommended." };
  if (age <= 10) return { phase: "Mature", advice: "Schedule senior diagnostic baselines. Monitor mobility and check joints for early arthritis signs." };
  if (age <= 14) return { phase: "Senior", advice: "Bi-annual geriatric vet visits are key. Keep resource access paths level. Monitor thyroid and kidneys." };
  return { phase: "Geriatric", advice: "Tailor comfortable environments. Check for cognitive dysfunction, kidney function, and pain management." };
};

function Dashboard() {
  const { user } = useAuth();
  const { pets, loading: petsLoading } = usePets();
  const { vaccinations, loading: vacsLoading } = useVaccinations();
  const { records, loading: recsLoading } = useMedicalRecords();
  const { messages } = useChat();
  const loading = petsLoading || vacsLoading || recsLoading;

  const [firstName, setFirstName] = useState("there");
  const [isJudgeView, setIsJudgeView] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      setIsJudgeView(searchParams.get("judgeview") === "true");
    }
  }, []);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        const fullName = currentUser?.user_metadata?.full_name;
        const name = fullName?.split(' ')[0] ?? currentUser?.email?.split('@')[0] ?? 'there';
        setFirstName(name);
      } catch (err) {
        console.error("Error fetching user name:", err);
      }
    }
    fetchUser();
  }, []);

  const completedVaccinesCount = vaccinations.filter(v => v.status === "Completed").length;
  const expectedVaccinesCount = vaccinations.length;
  const healthScore = expectedVaccinesCount > 0 ? Math.round((completedVaccinesCount / expectedVaccinesCount) * 100) : 100;

  const upcomingCount = vaccinations.filter(v => v.status === "Upcoming").length;
  const checkupsCount = records.filter(r => r.type?.toLowerCase() === "checkup").length;
  const overdueCount = vaccinations.filter((v) => v.status === "Upcoming" && new Date(v.date) < new Date()).length;

  const nextVaccines = vaccinations
    .filter(v => v.status === "Upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const getVaccineStatusDetails = (v: any) => {
    const dueDate = new Date(v.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { color: "#ff6b6b", text: "Overdue", bg: "rgba(255, 107, 107, 0.1)" };
    } else if (diffDays <= 7) {
      return { color: "#ffb829", text: `Due in ${diffDays} days`, bg: "rgba(255, 184, 41, 0.1)" };
    } else {
      return { color: "#15846e", text: "OK", bg: "rgba(21, 132, 110, 0.1)" };
    }
  };

  const recentActivity = [
    ...vaccinations.map((v) => ({ text: `${v.pets?.name || "Pet"}'s vaccination: ${v.vaccine_name}`, time: v.created_at, date: v.created_at })),
    ...records.map((r) => ({ text: `${r.pets?.name || "Pet"}: ${r.title}`, time: r.created_at, date: r.created_at })),
  ]
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    .slice(0, 4)
    .map((item) => ({
      text: item.text,
      time: item.time ? getRelativeTime(new Date(item.time)) : "",
    }));

  if (loading) {
    return (
      <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff", padding: "40px 48px", fontFamily: "'Space Grotesk', sans-serif" }}>
        <style>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>

        {isJudgeView && (
          <div
            style={{
              height: 36,
              background: "linear-gradient(90deg, rgba(128,82,255,0.1) 0%, rgba(128,82,255,0.05) 100%)",
              borderBottom: "1px solid rgba(128,82,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: 20,
              borderRadius: 8
            }}
          >
            <span style={{ fontSize: 14 }}>🐱</span>
            <span style={{ fontSize: 12, color: "#9a9a9a" }}>Built for Hack the Kitty 2026</span>
            <a 
              href="https://pawpal-wheat.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ fontSize: 12, color: "#8052ff", textDecoration: "none", fontWeight: 500 }}
            >
              View Live Demo →
            </a>
          </div>
        )}

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, fontWeight: 300, color: "#ffffff", marginBottom: 6 }}>
            Welcome back, <span style={{ color: '#8052ff', fontWeight: 500 }}>there</span>.
          </h1>
          <p style={{ fontSize: 15, color: "#9a9a9a" }}>
            Here is your pet care compliance report for today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              style={{
                background: "linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 100%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite linear",
                borderRadius: "16px",
                height: 106
              }}
            />
          ))}
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", padding: 24, marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#ffffff", marginBottom: 20 }}>Companion Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  background: "linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 100%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s infinite linear",
                  borderRadius: "16px",
                  height: 180
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff", fontFamily: "'Space Grotesk', sans-serif" }}>
      {isJudgeView && (
        <div
          style={{
            height: 36,
            background: "linear-gradient(90deg, rgba(128,82,255,0.1) 0%, rgba(128,82,255,0.05) 100%)",
            borderBottom: "1px solid rgba(128,82,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 20,
            borderRadius: 8
          }}
        >
          <span style={{ fontSize: 14 }}>🐱</span>
          <span style={{ fontSize: 12, color: "#9a9a9a" }}>Built for Hack the Kitty 2026</span>
          <a 
            href="https://pawpal-wheat.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ fontSize: 12, color: "#8052ff", textDecoration: "none", fontWeight: 500 }}
          >
            View Live Demo →
          </a>
        </div>
      )}
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          style={{ fontSize: 36, fontWeight: 300, color: "#ffffff", marginBottom: 6 }}
        >
          Welcome back, <span style={{ color: '#8052ff', fontWeight: 500 }}>{firstName}</span>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
          style={{ fontSize: 15, color: "#9a9a9a" }}
        >
          Here is your pet care compliance report for today.
        </motion.p>
      </div>

      {/* Alert Banner */}
      {overdueCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{
            background: "rgba(255,107,107,0.06)",
            border: "1px solid rgba(255,107,107,0.2)",
            borderRadius: "24px",
            padding: "16px 20px",
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: "#ffffff", margin: 0 }}>Urgent Health Alert</h4>
              <p style={{ fontSize: 13, color: "#ff6b6b", margin: "2px 0 0" }}>
                You have {overdueCount} overdue vaccination{overdueCount > 1 ? "s" : ""} requiring attention.
              </p>
            </div>
          </div>
          <Link
            to="/app/vaccinations"
            style={{
              color: "#ffffff",
              background: "#ff6b6b",
              borderRadius: "24px",
              padding: "8px 16px",
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
              cursor: "pointer",
              boxShadow: "0 0 10px rgba(255,107,107,0.3)"
            }}
          >
            Resolve Now
          </Link>
        </motion.div>
      )}

      {/* Hero Section: Health Score + Purr Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Health Score Widget */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(128,82,255,0.15)",
            borderRadius: "24px",
            padding: 32,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: "#9a9a9a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Health Score</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 78, fontWeight: 700, color: "#ffffff", lineHeight: 1 }}>
              {healthScore}
            </span>
            <span style={{ fontSize: 24, fontWeight: 500, color: "#8052ff" }}>%</span>
          </div>
          
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9a9a9a", marginBottom: 6 }}>
              <span>Immunization Compliance</span>
              <span>{completedVaccinesCount} / {expectedVaccinesCount} Vaccines</span>
            </div>
            <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${healthScore}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{ height: "100%", background: "#8052ff", borderRadius: 4 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Purr Therapy Widget */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.25 }}
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "24px",
            padding: 32,
          }}
        >
          <PurrTherapyWidget />
        </motion.div>
      </div>

      {/* Quick Stats Grid (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stat 1: Total Pets */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <div>
            <p style={{ fontSize: 12, fontWeight: 500, color: "#9a9a9a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Total Pets</p>
            <p style={{ fontSize: 36, fontWeight: 600, color: "#ffffff", margin: 0 }}>{pets.length}</p>
          </div>
          <span style={{ fontSize: 32 }}>🐾</span>
        </motion.div>

        {/* Stat 2: Overdue/Upcoming Vaccines */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.35 }}
          whileHover={{ scale: 1.02 }}
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <div>
            <p style={{ fontSize: 12, fontWeight: 500, color: "#9a9a9a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Upcoming Vaccines</p>
            <p style={{ fontSize: 36, fontWeight: 600, color: "#ffb829", margin: 0 }}>{upcomingCount}</p>
          </div>
          <span style={{ fontSize: 32 }}>⚠️</span>
        </motion.div>

        {/* Stat 3: Completed Checkups */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <div>
            <p style={{ fontSize: 12, fontWeight: 500, color: "#9a9a9a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Completed Checkups</p>
            <p style={{ fontSize: 36, fontWeight: 600, color: "#15846e", margin: 0 }}>{checkupsCount}</p>
          </div>
          <span style={{ fontSize: 32 }}>🩺</span>
        </motion.div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Life Phase Care Advisor Card */}
          {pets.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
              style={{
                background: "linear-gradient(135deg, rgba(128,82,255,0.08), rgba(0,0,0,0))",
                border: "1px solid rgba(128,82,255,0.15)",
                borderRadius: "24px",
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 12
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>🌟</span>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "#ffffff", margin: 0 }}>
                      Life Phase Advisor: <span style={{ color: "#d4c5ff" }}>{pets[0].name}</span>
                    </h3>
                    <span style={{ fontSize: 12, color: "#8052ff", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {getLifePhase(pets[0].age_years, pets[0].species).phase} Phase
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: 12, color: "#9a9a9a" }}>{pets[0].species} • {pets[0].age_years} yrs old</span>
              </div>
              <p style={{ fontSize: 13, color: "#bdbdbd", lineHeight: 1.5, margin: 0 }}>
                {getLifePhase(pets[0].age_years, pets[0].species).advice}
              </p>
            </motion.div>
          )}

          {/* Pet Health Cards Grid */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.45 }}
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", padding: 24 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", margin: 0 }}>Your Pets</h2>
              <Link to="/app/pets" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff", borderRadius: "24px", padding: "6px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer", textDecoration: "none" }}>Manage Pets</Link>
            </div>
            {pets.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 160, padding: "24px 0" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="rgba(128,82,255,0.3)">
                  <circle cx="7.5" cy="5.5" r="1.5" />
                  <circle cx="12" cy="4" r="1.5" />
                  <circle cx="16.5" cy="5.5" r="1.5" />
                  <circle cx="4.5" cy="9.5" r="1.2" />
                  <circle cx="19.5" cy="9.5" r="1.2" />
                  <path d="M12 22c-4 0-6-3-6-6 0-2 2-4 6-4s6 2 6 4c0 3-2 6-6 6z" />
                </svg>
                <h3 style={{ fontSize: 16, fontWeight: 500, color: "#ffffff", marginTop: 12, fontFamily: "'Space Grotesk', sans-serif" }}>
                  No pets added yet
                </h3>
                <p style={{ fontSize: 13, color: "#9a9a9a", marginTop: 6, textAlign: "center" }}>
                  Add your first pet to start tracking their health
                </p>
                <div style={{ marginTop: 16 }}>
                  <Link
                    to="/app/pets"
                    style={{
                      background: "#8052ff",
                      color: "#ffffff",
                      borderRadius: "24px",
                      padding: "10px 20px",
                      fontSize: 13,
                      fontWeight: 600,
                      textDecoration: "none",
                      display: "inline-block"
                    }}
                  >
                    Add Pet +
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {pets.map((pet, i) => (
                  <Link to="/app/pets" key={pet.id} style={{ textDecoration: "none" }}>
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 + i * 0.08 }}
                    >
                      <MagneticCard>
                        {pet.photo_url ? (
                          <img src={pet.photo_url} alt={pet.name} style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", margin: "0 auto 12px", border: "2px solid #8052ff" }} />
                        ) : (
                          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #8052ff, #5030cc)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 24, fontWeight: 600, color: "#fff" }}>{pet.name?.[0] || "?"}</div>
                        )}
                        <p style={{ fontSize: 16, fontWeight: 600, color: "#ffffff", margin: 0 }}>{pet.name}</p>
                        <p style={{ fontSize: 13, color: "#9a9a9a", marginTop: 2, marginBottom: 8 }}>{pet.breed || "Mixed Breed"}</p>
                        <span style={{ display: "inline-block", background: "rgba(21, 132, 110, 0.15)", color: "#15846e", borderRadius: "24px", padding: "3px 10px", fontSize: 11, fontWeight: 500 }}>{pet.age_years} yrs</span>
                      </MagneticCard>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", padding: 24 }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", marginBottom: 16 }}>Quick Actions</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/app/chat" style={{ flex: 1, background: "#8052ff", color: "#fff", borderRadius: "24px", padding: "12px 20px", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "block", textAlign: "center" }}>Ask AI Triage</Link>
              <Link to="/app/vaccinations" style={{ flex: 1, border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: "24px", padding: "11px 20px", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "block", textAlign: "center" }}>Add Vaccination</Link>
              <Link to="/app/records" style={{ flex: 1, border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: "24px", padding: "11px 20px", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "block", textAlign: "center" }}>Upload Record</Link>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Upcoming Vaccines Alert Section */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.55 }}
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", padding: 24 }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", marginBottom: 16 }}>Upcoming Vaccines</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {nextVaccines.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 0" }}>
                  <p style={{ fontSize: 13, color: "#9a9a9a", margin: 0 }}>No upcoming vaccinations scheduled</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {nextVaccines.map((v, idx) => {
                    const statusDetails = getVaccineStatusDetails(v);
                    return (
                      <motion.div
                        key={v.id || idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx, duration: 0.4 }}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 16px",
                          background: "rgba(255,255,255,0.01)",
                          border: "1px solid rgba(255,255,255,0.04)",
                          borderRadius: "16px"
                        }}
                      >
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "#ffffff", margin: 0 }}>{v.vaccine_name}</p>
                          <p style={{ fontSize: 12, color: "#9a9a9a", margin: "2px 0 0" }}>{v.pets?.name || "Pet"}</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                          <span style={{ fontSize: 11, color: "#9a9a9a" }}>
                            {v.date ? new Date(v.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                          </span>
                          <span style={{
                            background: statusDetails.bg,
                            color: statusDetails.color,
                            borderRadius: "12px",
                            padding: "3px 8px",
                            fontSize: 10,
                            fontWeight: 600,
                            border: `1px solid ${statusDetails.color}33`
                          }}>
                            {statusDetails.text}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.6 }}
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", padding: 24 }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", marginBottom: 16 }}>Recent Activity</h2>
            <div>
              {recentActivity.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 0" }}>
                  <p style={{ fontSize: 13, color: "#9a9a9a", margin: 0 }}>Activity will appear here</p>
                </div>
              ) : (
                recentActivity.map((item, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#8052ff", marginTop: 6, flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 13, color: "#ffffff", margin: 0 }}>{item.text}</p>
                        <p style={{ fontSize: 11, color: "#9a9a9a", marginTop: 2, margin: 0 }}>{item.time}</p>
                      </div>
                    </div>
                    {i < recentActivity.length - 1 && <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />}
                  </div>
                ))
              )}
              <Link to="/app/timeline" style={{ display: "block", marginTop: 12, fontSize: 13, color: "#8052ff", cursor: "pointer", textDecoration: "none" }}>View all →</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
