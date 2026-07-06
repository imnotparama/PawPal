import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth/")({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: (search.mode as string) || "signup",
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const [tab, setTab] = useState<"signup" | "signin">(mode === "signin" ? "signin" : "signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setTab(mode === "signin" ? "signin" : "signup");
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    if (tab === "signup") {
      const { error } = await signUp(email, password);
      if (error) setError(error.message);
      else {
        setSuccessMsg("Check your email to confirm your account, then sign in.");
        setTab("signin");
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
      else navigate({ to: "/dashboard" });
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center font-sans" style={{ backgroundColor: "#000000" }}>
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "24px",
          padding: "48px",
          width: "100%",
          maxWidth: "420px",
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#8052ff" aria-hidden="true">
            <ellipse cx="7" cy="5" rx="2.5" ry="3" />
            <ellipse cx="17" cy="5" rx="2.5" ry="3" />
            <ellipse cx="4" cy="12" rx="2" ry="2.5" />
            <ellipse cx="20" cy="12" rx="2" ry="2.5" />
            <path d="M12 22c-4 0-6-3-6-6 0-2 2-4 6-4s6 2 6 4c0 3-2 6-6 6z" />
          </svg>
          <span style={{ fontWeight: 600, fontSize: 18, color: "#ffffff" }}>PawPal</span>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 mb-8 p-1 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
          <button
            onClick={() => { setTab("signup"); setError(""); setSuccessMsg(""); }}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: tab === "signup" ? "#8052ff" : "transparent",
              color: tab === "signup" ? "#ffffff" : "#9a9a9a",
            }}
          >
            Sign Up
          </button>
          <button
            onClick={() => { setTab("signin"); setError(""); setSuccessMsg(""); }}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: tab === "signin" ? "#8052ff" : "transparent",
              color: tab === "signin" ? "#ffffff" : "#9a9a9a",
            }}
          >
            Sign In
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === "signup" && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full outline-none transition-colors focus:border-[#8052ff]"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#ffffff",
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "14px",
              }}
            />
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="w-full outline-none transition-colors focus:border-[#8052ff]"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#ffffff",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
            }}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Password"
            className="w-full outline-none transition-colors focus:border-[#8052ff]"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#ffffff",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
            }}
          />

          {error && <p style={{ color: "#ffb829", fontSize: 13 }}>{error}</p>}
          {successMsg && <p style={{ color: "#15846e", fontSize: 13 }}>{successMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-medium transition-all hover:brightness-110 disabled:opacity-50"
            style={{
              backgroundColor: "#8052ff",
              color: "#ffffff",
              borderRadius: "24px",
              padding: "14px 24px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {loading ? "..." : tab === "signup" ? "Create Account" : "Sign In"}
          </button>
        </form>

        {tab === "signin" && (
          <p className="text-center mt-4">
            <a href="#" style={{ fontSize: 12, color: "#8052ff" }}>Forgot password?</a>
          </p>
        )}

        <p className="text-center mt-6" style={{ fontSize: 12, color: "#9a9a9a" }}>
          By signing up you agree to our Terms and Privacy Policy
        </p>

        {/* Back link */}
        <p className="text-center mt-6">
          <a href="/" style={{ fontSize: 12, color: "#9a9a9a" }} className="hover:text-bone transition-colors">
            ← Back to homepage
          </a>
        </p>
      </div>
    </main>
  );
}
