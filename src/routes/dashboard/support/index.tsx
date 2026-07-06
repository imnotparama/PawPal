import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from "@/components/ui/accordion";
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  LayoutDashboard, 
  Heart, 
  MessageSquare, 
  Syringe, 
  FileText, 
  Activity, 
  User, 
  ChevronRight,
  HelpCircle
} from "lucide-react";

export const Route = createFileRoute("/dashboard/support/")({
  component: SupportPage,
});

const faqItems = [
  {
    q: "How does the AI health triage work?",
    a: "PawPal AI uses Google Gemini 1.5 Flash to analyze your pet's symptoms. You can describe symptoms in text, upload a photo of rashes or wounds, or use voice input. The AI provides structured triage advice — always recommend consulting a real vet for serious concerns."
  },
  {
    q: "Is my pet's health data private?",
    a: "Yes. Every table in our database is protected by Supabase Row Level Security (RLS). Your data is cryptographically scoped to your user ID — no other user can ever access your pets, records, or chat history."
  },
  {
    q: "How do I add a pet?",
    a: "Go to My Pets in the sidebar and click 'Add Pet +'. You can upload a photo, set the breed, age, and weight. Photos are compressed client-side before upload to save storage space."
  },
  {
    q: "Can I print my pet's health records?",
    a: "Yes — open any pet profile and click 'Passport' to generate a printable health document with vaccination history, medical records, and a QR verification stamp."
  },
  {
    q: "How is the Health Score calculated?",
    a: "Health Score is calculated as: (completed vaccinations ÷ expected vaccinations) × 99, adjusted for recent activity. A score above 80 is excellent. Overdue vaccinations lower the score."
  },
  {
    q: "Is the Gemini API key secure?",
    a: "Yes. The Gemini API key never reaches your browser. All AI requests are proxied through a TanStack Start Server Action running on Vercel's serverless infrastructure — the key only lives on the server."
  },
  {
    q: "What file types can I upload for medical records?",
    a: "JPG, PNG, WebP images and PDF documents up to 10MB. Files are stored securely in Supabase Storage, scoped to your user ID."
  },
  {
    q: "Does PawPal work on mobile?",
    a: "Yes — the dashboard is fully responsive. The 3D particle landing page reduces particle count on mobile for performance, and the UI adapts to all screen sizes."
  }
];

function SupportPage() {
  const navigate = useNavigate();
  const [issueType, setIssueType] = useState("Bug Report");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = "Help & Support — PawPal AI";
    }
  }, []);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Please describe the issue in detail.");
      return;
    }

    toast.success("Opening your email client...");
    const subject = encodeURIComponent(`PawPal AI — ${issueType}`);
    const body = encodeURIComponent(description);
    const mailtoUrl = `mailto:hunterparama@gmail.com?subject=${subject}&body=${body}`;
    
    if (typeof window !== "undefined") {
      window.location.href = mailtoUrl;
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 48px", background: "#000000", fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, fontWeight: 300, color: "#ffffff", marginBottom: 4, fontFamily: "'Space Grotesk', sans-serif" }}>Help & Support</h1>
        <p style={{ fontSize: 15, color: "#9a9a9a", fontFamily: "'Space Grotesk', sans-serif" }}>Get help, report issues, or reach out to the developer.</p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
        
        {/* LEFT COLUMN */}
        <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 32 }}>
          
          {/* CARD 1 — FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: 32
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "#ffffff", margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>Frequently Asked Questions</h2>
            <p style={{ fontSize: 13, color: "#9a9a9a", marginTop: 4, marginBottom: 20, fontFamily: "'Space Grotesk', sans-serif" }}>Quick answers to common questions</p>

            <Accordion type="single" collapsible style={{ width: "100%" }}>
              {faqItems.map((item, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <AccordionTrigger 
                    className="hover:no-underline group py-4"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 500,
                      fontSize: 14,
                      color: "#ffffff",
                      transition: "color 0.2s"
                    }}
                  >
                    <span className="group-data-[state=open]:text-[#8052ff] transition-colors">{item.q}</span>
                  </AccordionTrigger>
                  <AccordionContent 
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 400,
                      fontSize: 14,
                      color: "#bdbdbd",
                      lineHeight: 1.7,
                      paddingBottom: 16
                    }}
                  >
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* CARD 2 — Report an Issue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: 32
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "#ffffff", marginBottom: 20, fontFamily: "'Space Grotesk', sans-serif" }}>Report an Issue</h2>

            <form onSubmit={handleSubmitReport} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: "#9a9a9a", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.03em" }}>Issue Type</label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  style={{ 
                    width: "100%", 
                    background: "rgba(255,255,255,0.04)", 
                    border: "1px solid rgba(255,255,255,0.08)", 
                    borderRadius: 12, 
                    padding: "12px 16px", 
                    color: "#ffffff", 
                    fontSize: 14, 
                    outline: "none" 
                  }}
                >
                  <option value="Bug Report">Bug Report</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="AI Response Issue">AI Response Issue</option>
                  <option value="Account Problem">Account Problem</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, color: "#9a9a9a", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.03em" }}>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail..."
                  rows={4}
                  style={{ 
                    width: "100%", 
                    background: "rgba(255,255,255,0.04)", 
                    border: "1px solid rgba(255,255,255,0.08)", 
                    borderRadius: 12, 
                    padding: "12px 16px", 
                    color: "#ffffff", 
                    fontSize: 14, 
                    outline: "none", 
                    resize: "none",
                    transition: "all 0.2s"
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#8052ff"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                />
              </div>

              <div>
                <button
                  type="submit"
                  style={{
                    background: "transparent",
                    color: "#8052ff",
                    border: "1px solid #8052ff",
                    borderRadius: 24,
                    padding: "12px 24px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: "'Space Grotesk', sans-serif"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(128,82,255,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  Submit Report
                </button>
              </div>
            </form>
          </motion.div>

        </div>

        {/* RIGHT COLUMN */}
        <div style={{ width: 340, flexShrink: 0, display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* CARD 1 — Developer Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              background: "rgba(128,82,255,0.06)",
              border: "1px solid rgba(128,82,255,0.2)",
              borderRadius: 24,
              padding: 28
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 24, color: "#8052ff" }}>🐾</span>
            </div>
            
            <span style={{ display: "block", fontSize: 12, color: "#9a9a9a", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 16 }}>
              Built by
            </span>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: "#ffffff", margin: "8px 0 0 0", fontFamily: "'Space Grotesk', sans-serif" }}>
              Parameshwaran S
            </h3>
            <p style={{ fontSize: 13, color: "#9a9a9a", margin: "4px 0 0 0" }}>
              Full Stack Developer & AI Enthusiast
            </p>

            <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.08)", margin: "20px 0" }} />

            {/* Links List */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/in/parameshwaran-s-datascientist/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 12, 
                  padding: "10px 0", 
                  borderBottom: "1px solid rgba(255,255,255,0.05)", 
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "all 0.2s"
                }}
                className="group"
              >
                <Linkedin size={18} color="#0077b5" className="group-hover:text-[#8052ff] transition-colors" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#ffffff", display: "block" }} className="group-hover:text-[#8052ff] transition-colors">LinkedIn</span>
                  <span style={{ fontSize: 12, color: "#9a9a9a" }}>@Parameshwaran S</span>
                </div>
              </a>

              {/* GitHub */}
              <a 
                href="https://github.com/imnotparama"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 12, 
                  padding: "10px 0", 
                  borderBottom: "1px solid rgba(255,255,255,0.05)", 
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "all 0.2s"
                }}
                className="group"
              >
                <Github size={18} color="#ffffff" className="group-hover:text-[#8052ff] transition-colors" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#ffffff", display: "block" }} className="group-hover:text-[#8052ff] transition-colors">GitHub</span>
                  <span style={{ fontSize: 12, color: "#9a9a9a" }}>@imnotparama</span>
                </div>
              </a>

              {/* Email */}
              <a 
                href="mailto:hunterparama@gmail.com"
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 12, 
                  padding: "10px 0", 
                  borderBottom: "1px solid rgba(255,255,255,0.05)", 
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "all 0.2s"
                }}
                className="group"
              >
                <Mail size={18} color="#ffffff" className="group-hover:text-[#8052ff] transition-colors" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#ffffff", display: "block" }} className="group-hover:text-[#8052ff] transition-colors">Email</span>
                  <span style={{ fontSize: 12, color: "#9a9a9a", display: "block" }}>hunterparama@gmail.com</span>
                  <span style={{ fontSize: 11, color: "#9a9a9a", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400, marginTop: 2, display: "block" }}>
                    ⚡ Typically responds within 24 hours
                  </span>
                </div>
              </a>

              {/* Live Demo */}
              <a 
                href="https://pawpal-wheat.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 12, 
                  padding: "10px 0", 
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "all 0.2s"
                }}
                className="group"
              >
                <ExternalLink size={18} color="#ffffff" className="group-hover:text-[#8052ff] transition-colors" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#ffffff", display: "block" }} className="group-hover:text-[#8052ff] transition-colors">Live Demo</span>
                  <span style={{ fontSize: 12, color: "#9a9a9a" }}>pawpal-wheat.vercel.app</span>
                </div>
              </a>
            </div>

            {/* Badges */}
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <span style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#9a9a9a", borderRadius: 20, padding: "4px 12px", fontSize: 11 }}>
                PawPal AI v1.0
              </span>
              <span style={{ background: "rgba(128,82,255,0.1)", border: "1px solid rgba(128,82,255,0.2)", color: "#8052ff", borderRadius: 20, padding: "4px 12px", fontSize: 11 }}>
                Hack the Kitty 2026
              </span>
            </div>

            {/* System Status */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#15846e", display: "inline-block" }} />
              <span style={{ fontSize: 11, color: "#9a9a9a", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400 }}>
                All systems operational
              </span>
            </div>
          </motion.div>

          {/* CARD 2 — Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: 28
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#ffffff", margin: "0 0 16px 0", fontFamily: "'Space Grotesk', sans-serif" }}>Quick Links</h3>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
                { label: "My Pets", to: "/dashboard/pets", icon: Heart },
                { label: "AI Chat", to: "/dashboard/chat", icon: MessageSquare },
                { label: "Vaccinations", to: "/dashboard/vaccinations", icon: Syringe },
                { label: "Medical Records", to: "/dashboard/records", icon: FileText },
                { label: "Health Timeline", to: "/dashboard/timeline", icon: Activity },
                { label: "My Profile", to: "/dashboard/profile", icon: User }
              ].map((item) => (
                <div
                  key={item.label}
                  onClick={() => navigate({ to: item.to })}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    cursor: "pointer",
                    transition: "color 0.2s"
                  }}
                  className="group"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <item.icon size={16} color="#9a9a9a" className="group-hover:text-[#8052ff] transition-colors" />
                    <span style={{ fontSize: 14, color: "#bdbdbd" }} className="group-hover:text-[#8052ff] transition-colors">{item.label}</span>
                  </div>
                  <ChevronRight size={14} color="#9a9a9a" className="group-hover:text-[#8052ff] transition-colors" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* CARD 3 — App Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: 28
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#ffffff", margin: "0 0 16px 0", fontFamily: "'Space Grotesk', sans-serif" }}>About PawPal AI</h3>
            <p style={{ fontSize: 12, color: "#9a9a9a", lineHeight: 1.5, marginBottom: 16 }}>
              Cats already run the internet. Now it's time they run everything. PawPal AI is built to support our future feline overlords with state-of-the-art clinical compliance.
            </p>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { label: "Version", value: "1.0.0" },
                { label: "Built with", value: "React 19 + Supabase" },
                { label: "AI Model", value: "Gemini 1.5 Flash" },
                { label: "Hackathon", value: "Hack the Kitty 2026" },
                { label: "Theme", value: "Wholesome Kitty Domination" },
                { label: "License", value: "MIT" },
                { label: "Last Updated", value: "July 2026" }
              ].map((row) => (
                <div 
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.05)"
                  }}
                >
                  <span style={{ fontSize: 13, color: "#9a9a9a" }}>{row.label}</span>
                  <span style={{ fontSize: 13, color: "#ffffff", fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
