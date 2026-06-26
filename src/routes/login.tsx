import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccessMsg("Check your email to confirm your account, then sign in.");
        setIsSignUp(false);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        navigate({ to: "/app" });
      }
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-void flex items-center justify-center font-sans text-bone px-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-full bg-plum-voltage mx-auto mb-4 flex items-center justify-center text-bone font-bold text-lg">
            P
          </div>
          <h1 className="text-2xl font-semibold">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-smoke text-sm mt-2">
            {isSignUp ? "Sign up to start caring for your pets with AI" : "Sign in to your PawPal account"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-smoke uppercase tracking-wider block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-bone placeholder:text-smoke/50 outline-none focus:border-plum-voltage transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-xs text-smoke uppercase tracking-wider block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-bone placeholder:text-smoke/50 outline-none focus:border-plum-voltage transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-amber-spark text-sm">{error}</p>
          )}
          {successMsg && (
            <p className="text-lichen text-sm">{successMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-plum-voltage text-bone rounded-xl px-4 py-3 font-medium text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-smoke text-sm mt-6">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(""); setSuccessMsg(""); }}
            className="text-plum-voltage hover:underline"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>

        {/* Back to landing */}
        <p className="text-center mt-8">
          <a href="/" className="text-smoke text-xs hover:text-bone transition-colors">
            ← Back to homepage
          </a>
        </p>
      </div>
    </main>
  );
}
