import { LogoMark } from "@/components/LogoMark";

export function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3 group">
          <LogoMark />
          <span
            style={{ fontSize: 14, letterSpacing: "0.021em" }}
            className="text-smoke"
          >
            © 2026 PawPal AI — built quietly, for the loud ones at home.
          </span>
        </div>
        <div className="flex items-center gap-8">
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a
              key={l}
              href="#"
              className="dala-nav-link"
              style={{ fontSize: 13, letterSpacing: "0.021em" }}
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
