import { createFileRoute, Outlet, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { CursorGlow } from "@/components/CursorGlow";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

const navItems = [
  { label: "Dashboard", to: "/app" },
  { label: "My Pets", to: "/app/pets" },
  { label: "AI Chat", to: "/app/chat" },
  { label: "Vaccinations", to: "/app/vaccinations" },
  { label: "Medical Records", to: "/app/records" },
  { label: "Health Timeline", to: "/app/timeline" },
];

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [signOutHovered, setSignOutHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

        {/* Date/Time Indicator */}
        <div style={{ padding: "0 8px", marginBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 16 }}>
          <div style={{ color: "#8052ff", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Current Time</div>
          <div style={{ color: "#ffffff", fontSize: 13, fontWeight: 600, marginTop: 4 }}>
            {currentDateTime.toLocaleDateString("en-US", { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
          <div style={{ color: "#9a9a9a", fontSize: 12, marginTop: 2 }}>
            {currentDateTime.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>

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
                onClick={() => setIsMobileMenuOpen(false)}
                style={
                  isActive
                    ? {
                        padding: "10px 16px",
                        borderRadius: "8px",
                        fontSize: 14,
                        fontWeight: 400,
                        background: "rgba(128,82,255,0.15)",
                        borderLeft: "2px solid #8052ff",
                        color: "#ffffff",
                        textDecoration: "none",
                        display: "block"
                      }
                    : {
                        padding: "10px 16px",
                        borderRadius: "8px",
                        fontSize: 14,
                        fontWeight: 400,
                        color: "#9a9a9a",
                        textDecoration: "none",
                        display: "block"
                      }
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = "#ffffff";
                    (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = "#9a9a9a";
                    (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  }
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div style={{ marginTop: "auto", paddingTop: 32 }}>
          <p style={{ color: "#9a9a9a", fontSize: 12, paddingLeft: 16, marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              signOut();
            }}
            style={{
              width: "100%",
              padding: "10px 16px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 400,
              color: signOutHovered ? "#ff4444" : "#9a9a9a",
              textAlign: "left",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={() => setSignOutHovered(true)}
            onMouseLeave={() => setSignOutHovered(false)}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="md:ml-[220px] flex-1 min-h-screen p-6 md:p-12" style={{ background: "#000000" }}>
        <CursorGlow />
        <Outlet />
      </main>
    </div>
  );
}
