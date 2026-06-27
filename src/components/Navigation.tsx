import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50"
        style={{
          backgroundColor: "transparent",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          transition: "background-color 0.3s ease",
          border: "none",
          borderBottom: "none",
          boxShadow: "none",
          outline: "none",
        }}
      >
        <div className="mx-auto px-6 lg:px-10 h-[60px] flex items-center justify-between" style={{ background: "transparent" }}>
          {/* Logo LEFT — PawPal + paw icon */}
          <Link to="/" className="flex items-center gap-1.5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#8052ff" aria-hidden="true">
              <ellipse cx="7" cy="5" rx="2.5" ry="3" />
              <ellipse cx="17" cy="5" rx="2.5" ry="3" />
              <ellipse cx="4" cy="12" rx="2" ry="2.5" />
              <ellipse cx="20" cy="12" rx="2" ry="2.5" />
              <path d="M12 22c-4 0-6-3-6-6 0-2 2-4 6-4s6 2 6 4c0 3-2 6-6 6z" />
            </svg>
            <span style={{ fontWeight: 600, fontSize: 18, color: "#ffffff" }}>PawPal</span>
          </Link>

          {/* Links + CTA RIGHT */}
          <div className="flex items-center gap-7">
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("scrollToPanel", { detail: { panel: 1 } }));
              }}
              className="hidden md:inline text-smoke hover:text-bone transition-colors duration-200"
              style={{ fontSize: 12, letterSpacing: "0.03em", fontWeight: 400 }}
            >
              HOW IT WORKS
            </a>

            <a
              href="#pet-tips"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("scrollToPanel", { detail: { panel: 2 } }));
              }}
              className="hidden md:inline text-smoke hover:text-bone transition-colors duration-200"
              style={{ fontSize: 12, letterSpacing: "0.03em", fontWeight: 400 }}
            >
              PET TIPS
            </a>

            <button
              onClick={() => setShowDeveloperModal(true)}
              className="hidden md:inline-flex items-center justify-center transition-all duration-300 relative px-4 py-1.5 rounded-full text-bone hover:text-white cursor-pointer"
              style={{
                fontSize: 11,
                letterSpacing: "0.05em",
                fontWeight: 600,
                textTransform: "uppercase",
                backgroundColor: "rgba(128,82,255,0.08)",
                border: "1px solid rgba(128,82,255,0.3)",
                boxShadow: "0 0 15px rgba(128,82,255,0.15), inset 0 0 10px rgba(128,82,255,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(128,82,255,0.7)";
                e.currentTarget.style.boxShadow = "0 0 22px rgba(128,82,255,0.3), inset 0 0 12px rgba(128,82,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(128,82,255,0.3)";
                e.currentTarget.style.boxShadow = "0 0 15px rgba(128,82,255,0.15), inset 0 0 10px rgba(128,82,255,0.1)";
              }}
            >
              About
            </button>
          </div>
        </div>
      </header>

      {/* Developer Profile Modal */}
      <AnimatePresence>
        {showDeveloperModal && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
            onClick={() => setShowDeveloperModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[460px] rounded-3xl p-8 overflow-hidden"
              style={{
                backgroundColor: "rgba(10, 10, 10, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(128, 82, 255, 0.15)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Ambient background glow inside the modal */}
              <div style={{
                position: 'absolute',
                right: '-20%',
                top: '-20%',
                width: '60%',
                height: '60%',
                background: 'radial-gradient(circle, rgba(128,82,255,0.2) 0%, transparent 70%)',
                filter: 'blur(30px)',
                pointerEvents: 'none',
                zIndex: 0
              }} />
              <div style={{
                position: 'absolute',
                left: '-20%',
                bottom: '-20%',
                width: '60%',
                height: '60%',
                background: 'radial-gradient(circle, rgba(21,132,110,0.15) 0%, transparent 70%)',
                filter: 'blur(30px)',
                pointerEvents: 'none',
                zIndex: 0
              }} />

              {/* Content container */}
              <div className="relative z-10">
                {/* Close Button */}
                <button
                  onClick={() => setShowDeveloperModal(false)}
                  className="absolute -top-2 -right-2 text-white/50 hover:text-white transition-colors cursor-pointer"
                  style={{ fontSize: 20, background: "none", border: "none" }}
                  aria-label="Close modal"
                >
                  ✕
                </button>

                {/* Developer Avatar SVG */}
                <div className="flex justify-center mb-6">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, rgba(128,82,255,0.2), rgba(21,132,110,0.2))",
                      border: "1px solid rgba(128,82,255,0.4)",
                      boxShadow: "0 0 20px rgba(128,82,255,0.2)"
                    }}
                  >
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d4c5ff" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                    </svg>
                  </div>
                </div>

                {/* Identity info */}
                <div className="text-center">
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#8052ff",
                      background: "rgba(128,82,255,0.1)",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      display: "inline-block",
                      marginBottom: 12
                    }}
                  >
                    Lead Developer
                  </span>
                  <h3 className="text-bone font-medium" style={{ fontSize: 28, letterSpacing: "-0.02em" }}>
                    imnotparama
                  </h3>
                  <p className="text-ash mt-2" style={{ fontSize: 14, lineHeight: 1.5, maxWidth: "340px", marginLeft: "auto", marginRight: "auto" }}>
                    Full Stack Creator & 3D Interactive Engineer. Obsessed with building gorgeous, high-fidelity digital interfaces and tactile code experiences.
                  </p>
                </div>

                <div className="mt-8 border-t border-white/5 pt-6 flex flex-col gap-4">
                  {/* Tech Stack Chips */}
                  <div>
                    <h4 style={{ fontSize: 11, color: "#9a9a9a", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>
                      Core Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {["React", "TypeScript", "Three.js", "Shaders", "TanStack", "Framer Motion"].map(tech => (
                        <span
                          key={tech}
                          style={{
                            fontSize: 11,
                            color: "#ffffff",
                            backgroundColor: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            padding: "3px 8px",
                            borderRadius: "6px"
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Github Link */}
                  <div className="mt-2">
                    <a
                      href="https://github.com/imnotparama"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full transition-colors duration-200"
                      style={{
                        padding: "12px",
                        borderRadius: "12px",
                        backgroundColor: "#8052ff",
                        color: "#ffffff",
                        fontSize: 13,
                        fontWeight: 600
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#6c3fe0"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#8052ff"; }}
                    >
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
                      </svg>
                      Follow imnotparama
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
