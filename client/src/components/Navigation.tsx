import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { label: "FEATURES", href: "#features" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },
];

export function Navigation({ className }: { className?: string }) {
  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-void border-b border-white/10 ${className ?? ""}`}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 h-16">
        {/* Logo */}
        <a
          href="/"
          className="font-acronym text-xl font-semibold text-bone tracking-tight"
        >
          PawPal AI
        </a>

        {/* Nav Links - hidden on mobile */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-caption font-semibold uppercase tracking-caption text-smoke hover:text-bone transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <Button variant="primary" size="sm">
          GET STARTED
        </Button>
      </div>
    </nav>
  );
}
