import { Link } from "react-router-dom";
import { LogoMark } from "@/components/LogoMark";
import { MagneticButton } from "@/components/MagneticButton";

const NAV_LINKS = ["MANIFESTO", "PRODUCT", "TEAM", "BLOG"];

export function Navigation() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-[1300px] px-6 lg:px-10 h-[64px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <LogoMark />
          <span className="text-bone" style={{ fontWeight: 600, fontSize: 16, letterSpacing: "0.01em" }}>
            PawPal<span className="text-plum-voltage">.</span>ai
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-smoke transition-colors duration-200 hover:text-bone"
              style={{ fontSize: 13, letterSpacing: "0.02em", fontWeight: 400 }}
            >
              {l}
            </a>
          ))}
        </nav>

        <MagneticButton strength={0.25}>
          <Link
            to="/app"
            className="dala-btn-primary inline-flex items-center justify-center rounded-3xl"
            style={{ padding: "10px 18px", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}
          >
            Request Access
          </Link>
        </MagneticButton>
      </div>
    </header>
  );
}
