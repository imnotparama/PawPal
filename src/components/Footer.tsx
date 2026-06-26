export function Footer() {
  return (
    <footer
      className="w-full"
      style={{
        backgroundColor: "#000000",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "24px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Left — Logo */}
      <div className="flex items-center gap-1.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#8052ff" aria-hidden="true">
          <ellipse cx="7" cy="5" rx="2.5" ry="3" />
          <ellipse cx="17" cy="5" rx="2.5" ry="3" />
          <ellipse cx="4" cy="12" rx="2" ry="2.5" />
          <ellipse cx="20" cy="12" rx="2" ry="2.5" />
          <path d="M12 22c-4 0-6-3-6-6 0-2 2-4 6-4s6 2 6 4c0 3-2 6-6 6z" />
        </svg>
        <span style={{ fontWeight: 600, fontSize: 14, color: "#ffffff" }}>
          PawPal AI
        </span>
      </div>

      {/* Center — Copyright */}
      <span style={{ fontWeight: 400, fontSize: 12, color: "#9a9a9a" }}>
        © 2025 PawPal AI. All rights reserved.
      </span>

      {/* Right — Builder credit */}
      <span style={{ fontWeight: 400, fontSize: 12, color: "#9a9a9a" }}>
        Built by{" "}
        <a
          href="https://www.linkedin.com/in/parameshwaran-s-datascientist/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-200"
          style={{ color: "#9a9a9a", textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#8052ff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9a9a9a")}
        >
          Parameshwaran S
        </a>
      </span>
    </footer>
  );
}
