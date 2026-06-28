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
    <div className="flex min-h-screen font-sans" style={{ background: "#000000", color: "#ffffff" }}>
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 h-screen w-[220px] flex flex-col py-8 px-4 z-50"
        style={{ backgroundColor: "#000000", borderRight: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-10 px-2" style={{ textDecoration: "none" }}>
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
            onClick={() => signOut()}
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
      <main className="ml-[220px] flex-1 min-h-screen" style={{ padding: "40px 48px", background: "#000000" }}>
        <CursorGlow />
        <Outlet />
      </main>
    </div>
  );
}
