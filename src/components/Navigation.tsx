import { Link } from "@tanstack/react-router";
import { LogoMark } from "@/components/LogoMark";

export function Navigation() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto px-6 lg:px-10 h-[60px] flex items-center justify-between animate-fade-in">
        {/* Logo LEFT */}
        <Link to="/" className="flex items-center gap-2 group">
          <LogoMark />
          <span className="text-bone" style={{ fontWeight: 500, fontSize: 15 }}>
            PawPal
          </span>
        </Link>

        {/* Links + CTA RIGHT — like Dala */}
        <div className="flex items-center gap-7">
          {["MANIFESTO", "TEAM", "BLOG"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="hidden md:inline text-smoke hover:text-bone transition-colors duration-200"
              style={{ fontSize: 12, letterSpacing: "0.03em", fontWeight: 400 }}
            >
              {l}
            </a>
          ))}
          <Link
            to="/app"
            className="inline-flex items-center justify-center rounded-full border border-plum-voltage text-bone hover:bg-plum-voltage/10 transition-colors"
            style={{ padding: "8px 16px", fontSize: 11, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}
          >
            Request Access
          </Link>
        </div>
      </div>
    </header>
  );
}
