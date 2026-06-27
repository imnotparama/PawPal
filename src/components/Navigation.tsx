import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50"
      style={{
        backgroundColor: scrolled ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0)",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div className="mx-auto px-6 lg:px-10 h-[60px] flex items-center justify-between">
        {/* Logo LEFT — PawPal + paw icon */}
        <Link to="/" className="flex items-center gap-1.5">
          <img src="/pawpal-logo.png" alt="PawPal" style={{ width: 28, height: 28, borderRadius: 6 }} />
          <span className="text-bone" style={{ fontWeight: 600, fontSize: 18 }}>
            PawPal
          </span>
        </Link>

        {/* Links + CTA RIGHT */}
        <div className="flex items-center gap-7">
          <a
            href="#how-it-works"
            className="hidden md:inline text-smoke hover:text-bone transition-colors duration-200"
            style={{ fontSize: 12, letterSpacing: "0.03em", fontWeight: 400 }}
          >
            HOW IT WORKS
          </a>

          <a
            href="#pet-tips"
            className="hidden md:inline text-smoke hover:text-bone transition-colors duration-200"
            style={{ fontSize: 12, letterSpacing: "0.03em", fontWeight: 400 }}
          >
            PET TIPS
          </a>

          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="inline-flex items-center justify-center rounded-full"
            style={{
              padding: "8px 16px",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              backgroundColor: "#8052ff",
              color: "#ffffff",
              borderRadius: "24px",
            }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
