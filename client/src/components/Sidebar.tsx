import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PawPrint,
  MessageCircle,
  Syringe,
  FileText,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/app/dashboard", icon: LayoutDashboard },
  { label: "My Pets", path: "/app/pets", icon: PawPrint },
  { label: "AI Chat", path: "/app/chat", icon: MessageCircle },
  { label: "Vaccinations", path: "/app/vaccinations", icon: Syringe },
  { label: "Medical Records", path: "/app/records", icon: FileText },
  { label: "Health Timeline", path: "/app/timeline", icon: Clock },
];

export function Sidebar({ className }: { className?: string }) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full w-[220px] bg-black border-r border-white/10 hidden md:block",
        className
      )}
    >
      <div className="p-6">
        <span className="font-acronym text-xl font-bold text-bone">
          PawPal AI
        </span>
      </div>

      <nav className="px-3 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "dala-interactive flex items-center gap-3 px-4 py-2.5 rounded-3xl text-body-sm font-medium",
                isActive
                  ? "bg-plum-voltage/10 text-plum-voltage"
                  : "dala-nav-link"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
