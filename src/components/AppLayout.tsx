import { Link, useLocation, useNavigate, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CursorGlow } from "@/components/CursorGlow";
import { 
  LayoutDashboard, 
  Heart, 
  MessageSquare, 
  Syringe, 
  FileText, 
  History, 
  User,
  HelpCircle,
  Info
} from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/app", icon: LayoutDashboard },
  { label: "My Pets", to: "/app/pets", icon: Heart },
  { label: "AI Chat", to: "/app/chat", icon: MessageSquare },
  { label: "Vaccinations", to: "/app/vaccinations", icon: Syringe },
  { label: "Medical Records", to: "/app/records", icon: FileText },
  { label: "Health Timeline", to: "/app/timeline", icon: History },
  { label: "Profile", to: "/dashboard/profile", icon: User },
  { label: "Help & Support", to: "/dashboard/support", icon: HelpCircle },
];

const playSound = (type: "hover" | "click") => {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (type === "hover") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.012, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    }
  } catch (e) {
    // browser auto-play policy blocker
  }
};

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [signOutHovered, setSignOutHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-plum-voltage animate-pulse" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans" style={{ background: "#000000", color: "#ffffff" }}>
      {/* Mobile Top Bar */}
      <header
        className="md:hidden flex items-center justify-between px-6 h-16 border-b z-40 sticky top-0"
        style={{ backgroundColor: "#000000", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <Link to="/" className="flex items-center gap-2" style={{ textDecoration: "none" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#8052ff">
            <path d="M12 2C8 2 4 6 4 10c0 2 1 4 2 5l6 7 6-7c1-1 2-3 2-5 0-4-4-8-8-8zm-4 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm8 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm-4 2a2 2 0 110 4 2 2 0 010-4z"/>
          </svg>
          <span style={{ fontSize: 16, fontWeight: 600, color: "#ffffff", letterSpacing: "-0.02em" }}>PawPal</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", padding: 8, display: "flex", alignItems: "center", justifyContent: "center" }}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
          style={{ backdropFilter: "blur(4px)" }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 h-screen w-[220px] flex flex-col py-8 px-4 z-50 transition-transform duration-300 md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: "#000000", borderRight: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8 px-2" style={{ textDecoration: "none" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#8052ff">
            <path d="M12 2C8 2 4 6 4 10c0 2 1 4 2 5l6 7 6-7c1-1 2-3 2-5 0-4-4-8-8-8zm-4 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm8 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm-4 2a2 2 0 110 4 2 2 0 010-4z"/>
          </svg>
          <span style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", letterSpacing: "-0.02em" }}>PawPal</span>
        </Link>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item) => {
            const isActive =
              item.to === "/app"
                ? location.pathname === "/app" || location.pathname === "/app/"
                : location.pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  playSound("click");
                }}
                onMouseEnter={() => {
                  setHoveredItem(item.to);
                  playSound("hover");
                }}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  position: "relative",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  fontSize: 14,
                  fontWeight: 400,
                  color: isActive ? "#ffffff" : "#9a9a9a",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: isActive ? "rgba(128,82,255,0.15)" : "transparent",
                  borderLeft: isActive ? "2px solid #8052ff" : "2px solid transparent",
                  transition: "color 0.2s, border-color 0.2s, background 0.2s",
                }}
              >
                {/* Glow backdrop behind hovered item */}
                {hoveredItem === item.to && !isActive && (
                  <motion.div
                    layoutId="sidebar-hover"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "8px",
                      zIndex: 0,
                      pointerEvents: "none"
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                
                <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 12 }}>
                  <item.icon size={16} style={{ opacity: isActive ? 1 : 0.7 }} />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Mini Badge */}
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 12, padding: "0 8px", marginBottom: 16, paddingTop: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0, background: "#222" }}>
            {user.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #8052ff, #5030cc)", color: "#fff", fontSize: 14, fontWeight: 600 }}>
                {(user.user_metadata?.display_name || user.email || "?")[0].toUpperCase()}
              </div>
            )}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ color: "#ffffff", fontSize: 13, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.user_metadata?.display_name || "PawPal User"}
            </p>
            <p style={{ color: "#9a9a9a", fontSize: 11, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.email}
            </p>
          </div>
        </div>

        {/* Sign out & About Info Row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              signOut();
            }}
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 400,
              color: signOutHovered ? "#ff4444" : "#9a9a9a",
              textAlign: "left",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              transition: "color 0.2s"
            }}
            onMouseEnter={() => setSignOutHovered(true)}
            onMouseLeave={() => setSignOutHovered(false)}
          >
            Sign out
          </button>
          
          <button
            onClick={() => setShowAboutModal(true)}
            style={{
              padding: "8px",
              borderRadius: "50%",
              background: "transparent",
              border: "none",
              color: "#9a9a9a",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s"
            }}
            className="hover:text-[#8052ff] hover:bg-white/5"
            title="About PawPal AI"
          >
            <Info size={16} />
          </button>
        </div>
      </aside>

      {/* About Modal */}
      {showAboutModal && (
        <div 
          style={{ 
            position: "fixed", 
            inset: 0, 
            zIndex: 100, 
            background: "rgba(0,0,0,0.85)", 
            backdropFilter: "blur(20px)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center" 
          }} 
          onClick={() => setShowAboutModal(false)}
        >
          <div
            style={{
              background: "rgba(10,10,10,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: 24,
              width: "calc(100% - 32px)",
              maxWidth: 400,
              boxShadow: "0 0 40px rgba(128,82,255,0.15)",
              position: "relative",
              fontFamily: "'Space Grotesk', sans-serif"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowAboutModal(false)} 
              style={{ 
                position: "absolute", 
                top: 16, 
                right: 16, 
                background: "none", 
                border: "none", 
                color: "#9a9a9a", 
                fontSize: 18, 
                cursor: "pointer" 
              }}
            >
              ✕
            </button>

            <h3 style={{ fontSize: 20, fontWeight: 600, color: "#ffffff", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <span>🐾</span> PawPal AI
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#9a9a9a" }}>Version</span>
                <span style={{ fontSize: 13, color: "#ffffff" }}>1.0.0</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#9a9a9a" }}>Built for</span>
                <span style={{ fontSize: 13, color: "#ffffff" }}>Hack the Kitty 2026</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#9a9a9a" }}>Stack</span>
                <span style={{ fontSize: 13, color: "#ffffff" }}>React 19 + Supabase + Gemini</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a 
                href="https://github.com/imnotparama/PawPal" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between", 
                  background: "rgba(255,255,255,0.03)", 
                  border: "1px solid rgba(255,255,255,0.08)", 
                  borderRadius: 10, 
                  padding: "10px 14px", 
                  color: "#ffffff", 
                  textDecoration: "none", 
                  fontSize: 13,
                  transition: "all 0.2s"
                }}
                className="hover:border-[#8052ff]/50 hover:bg-[#8052ff]/5"
              >
                <span>GitHub Repository</span>
                <span>→</span>
              </a>
              <a 
                href="https://pawpal-wheat.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between", 
                  background: "rgba(255,255,255,0.03)", 
                  border: "1px solid rgba(255,255,255,0.08)", 
                  borderRadius: 10, 
                  padding: "10px 14px", 
                  color: "#ffffff", 
                  textDecoration: "none", 
                  fontSize: 13,
                  transition: "all 0.2s"
                }}
                className="hover:border-[#8052ff]/50 hover:bg-[#8052ff]/5"
              >
                <span>Live Deployment</span>
                <span>→</span>
              </a>
              <a 
                href="https://github.com/imnotparama/PawPal#readme" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between", 
                  background: "rgba(128,82,255,0.1)", 
                  border: "1px solid rgba(128,82,255,0.25)", 
                  borderRadius: 10, 
                  padding: "10px 14px", 
                  color: "#ffffff", 
                  textDecoration: "none", 
                  fontSize: 13,
                  fontWeight: 600,
                  transition: "all 0.2s"
                }}
                className="hover:bg-[#8052ff]/20"
              >
                <span>View Full Documentation</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="md:ml-[220px] flex-1 min-h-screen p-6 md:p-12" style={{ background: "#000000" }}>
        <CursorGlow />
        <Outlet />
      </main>
    </div>
  );
}
