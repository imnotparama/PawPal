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
        <img src="/pawpal-logo.png" alt="PawPal" style={{ width: 20, height: 20, borderRadius: 4 }} />
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
