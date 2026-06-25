import { Link } from "react-router-dom";
import { LogoMark } from "@/components/LogoMark";
import { MagneticButton } from "@/components/MagneticButton";

const NAV_LINKS = ["MANIFESTO", "PRODUCT", "PRICING", "BLOG"];

export function Navigation() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-sm bg-void/60">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <LogoMark />
          <span
            className="text-bone"
            style={{ fontWeight: 600, fontSize: 18, letterSpacing: "0.01em" }}
          >
            PawPal<span className="text-plum-voltage">.</span>ai
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="dala-nav-link"
              style={{ fontSize: 14, letterSpacing: "0.021em", fontWeight: 400 }}
            >
              {l}
            </a>
          ))}
        </nav>

        <MagneticButton strength={0.3}>
          <a
            href="#request"
            className="dala-btn-primary glow-btn inline-flex items-center justify-center rounded-3xl"
            style={{
              padding: "12px 18px",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Request access
          </a>
        </MagneticButton>
      </div>
    </header>
  );
}
