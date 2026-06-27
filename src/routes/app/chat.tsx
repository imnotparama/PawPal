import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export const Route = createFileRoute("/app/chat")({
  component: ChatPage,
});

interface Message {
  role: "user" | "ai";
  content: string;
  time: string;
}

const initialMessages: Message[] = [
  { role: "user", content: "My golden retriever has been scratching his ears a lot and shaking his head. Should I be worried?", time: "10:32 AM" },
  { role: "ai", content: "Frequent ear scratching and head shaking in golden retrievers often indicates an ear infection or allergies. Check for redness, odor, or discharge inside the ear flap. If you notice any of these, I'd recommend scheduling a vet visit within the next few days. In the meantime, avoid putting anything in the ear canal.", time: "10:32 AM" },
  { role: "user", content: "There's a bit of brown discharge. Is that serious?", time: "10:34 AM" },
  { role: "ai", content: "Brown discharge typically suggests a yeast or bacterial ear infection — common in floppy-eared breeds like goldens. It's treatable but does need veterinary attention for proper diagnosis and medication. I'd recommend booking an appointment within 24–48 hours. I've flagged this in Max's health timeline for your records.", time: "10:34 AM" },
];

const suggestions = [
  "Is Max's ear scratching serious?",
  "What vaccines does Luna need this year?",
  "My dog won't eat today, what should I do?",
  "How do I check for ticks on my cat?",
];

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input, time: "Now" }]);
    setInput("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 80px)", margin: "-40px -48px", background: "#000000" }}>
      {/* Chat Header */}
      <div style={{ height: 60, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#8052ff">
              <ellipse cx="7" cy="5" rx="2.5" ry="3" />
              <ellipse cx="17" cy="5" rx="2.5" ry="3" />
              <ellipse cx="4" cy="12" rx="2" ry="2.5" />
              <ellipse cx="20" cy="12" rx="2" ry="2.5" />
              <path d="M12 22c-4 0-6-3-6-6 0-2 2-4 6-4s6 2 6 4c0 3-2 6-6 6z" />
            </svg>
          </motion.div>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#ffffff" }}>PawPal AI</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#15846e" }} />
            <span style={{ fontSize: 12, color: "#9a9a9a" }}>Online</span>
          </div>
        </div>
        <div style={{ background: "rgba(128,82,255,0.1)", border: "1px solid rgba(128,82,255,0.3)", color: "#ffffff", borderRadius: 20, padding: "6px 14px", fontSize: 13 }}>
          Asking about: Max ▾
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: msg.role === "user" ? 12 : -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, maxWidth: msg.role === "user" ? "60%" : "65%", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
              {msg.role === "ai" && (
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(128,82,255,0.2)", border: "1px solid rgba(128,82,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#8052ff">
                    <ellipse cx="7" cy="5" rx="2.5" ry="3" />
                    <ellipse cx="17" cy="5" rx="2.5" ry="3" />
                    <path d="M12 22c-4 0-6-3-6-6 0-2 2-4 6-4s6 2 6 4c0 3-2 6-6 6z" />
                  </svg>
                </div>
              )}
              <div style={{
                background: msg.role === "user" ? "#8052ff" : "rgba(255,255,255,0.04)",
                border: msg.role === "user" ? "none" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: msg.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                padding: "14px 18px",
                fontSize: 15,
                color: msg.role === "user" ? "#ffffff" : "#e0e0e0",
                lineHeight: 1.6,
              }}>
                {msg.content}
              </div>
            </div>
            <span style={{ fontSize: 11, color: msg.role === "user" ? "rgba(255,255,255,0.5)" : "#9a9a9a", marginTop: 4, marginLeft: msg.role === "ai" ? 44 : 0, textAlign: msg.role === "user" ? "right" : "left" }}>{msg.time}</span>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div style={{ height: 80, borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)", padding: "16px 24px", display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
        <button style={{ background: "none", border: "none", color: "#9a9a9a", cursor: "pointer", fontSize: 18 }} title="Attach">📎</button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          placeholder="Ask about your pet's health..."
          style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "14px 20px", fontSize: 15, color: "#ffffff", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#8052ff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(128,82,255,0.1)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
        />
        <motion.button
          onClick={handleSend}
          whileHover={{ boxShadow: "0 0 16px rgba(128,82,255,0.5)" }}
          whileTap={{ scale: 0.9 }}
          disabled={!input.trim()}
          style={{ width: 44, height: 44, borderRadius: "50%", background: input.trim() ? "#8052ff" : "rgba(128,82,255,0.3)", border: "none", color: "#fff", cursor: input.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, transition: "background 0.2s" }}
        >
          ↑
        </motion.button>
      </div>
      <p style={{ textAlign: "center", fontSize: 11, color: "#9a9a9a", opacity: 0.6, padding: "6px 0 12px" }}>PawPal AI can make mistakes. Always consult a vet for medical decisions.</p>
    </div>
  );
}
