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
          <span className="text-bone" style={{ fontWeight: 600, fontSize: 18 }}>
            PawPal
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#8052ff" aria-hidden="true">
            <ellipse cx="7" cy="5" rx="2.5" ry="3" />
            <ellipse cx="17" cy="5" rx="2.5" ry="3" />
            <ellipse cx="4" cy="12" rx="2" ry="2.5" />
            <ellipse cx="20" cy="12" rx="2" ry="2.5" />
            <path d="M12 22c-4 0-6-3-6-6 0-2 2-4 6-4s6 2 6 4c0 3-2 6-6 6z" />
          </svg>
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

          {/* Developer — dropdown-style with two links */}
          <div className="hidden md:inline-flex items-center gap-3">
            <span className="text-smoke" style={{ fontSize: 12, letterSpacing: "0.03em" }}>
              Parameshwaran S
            </span>
            <a
              href="https://github.com/imnotparama"
              target="_blank"
              rel="noopener noreferrer"
              className="text-smoke hover:text-bone transition-colors"
              title="GitHub"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016.02 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/parameshwaran-s-datascientist/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-smoke hover:text-bone transition-colors"
              title="LinkedIn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 11.01-4.12 2.06 2.06 0 01-.01 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0z"/>
              </svg>
            </a>
          </div>

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
