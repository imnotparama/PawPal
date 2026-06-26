import { createFileRoute, Outlet, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";

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
    <div className="flex min-h-screen bg-void text-bone font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-[220px] bg-void border-r border-white/10 flex flex-col py-8 px-4 z-50">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 rounded-full bg-plum-voltage flex items-center justify-center text-bone font-bold text-sm">
            P
          </div>
          <span className="text-lg font-semibold tracking-tight">PawPal</span>
        </Link>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              item.to === "/app"
                ? location.pathname === "/app" || location.pathname === "/app/"
                : location.pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-plum-voltage/10 text-plum-voltage"
                    : "text-smoke hover:text-bone hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="mt-auto pt-8">
          <p className="text-smoke text-xs px-3 mb-2 truncate">{user.email}</p>
          <button
            onClick={() => signOut()}
            className="w-full px-3 py-2.5 rounded-xl text-sm font-medium text-smoke hover:text-bone hover:bg-white/5 transition-colors text-left"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-[220px] flex-1 p-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
