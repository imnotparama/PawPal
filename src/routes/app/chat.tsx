import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { usePets } from "@/hooks/usePets";
import { useChat } from "@/hooks/useChat";

export const Route = createFileRoute("/app/chat")({
  component: ChatPage,
});

const suggestions = [
  "Is my pet's ear scratching serious?",
  "What vaccines does my pet need this year?",
  "My dog won't eat today, what should I do?",
  "How do I check for ticks on my cat?",
];

function ChatPage() {
  const { pets } = usePets();
  const [selectedPetId, setSelectedPetId] = useState<string | undefined>(undefined);
  const { messages, sending, sendMessage, clearHistory } = useChat();
  const [input, setInput] = useState("");
  const [showPetMenu, setShowPetMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleSend = () => {
    if (!input.trim() || sending) return;
    sendMessage(input, selectedPetId);
    setInput("");
  };

  const selectedPet = pets.find((p) => p.id === selectedPetId);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-[calc(100vh-96px)] -m-6 md:-m-12 bg-black">
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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={clearHistory} style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", color: "#ff6b6b", borderRadius: 20, padding: "6px 14px", fontSize: 12, cursor: "pointer" }}>Clear</button>
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowPetMenu(!showPetMenu)} style={{ background: "rgba(128,82,255,0.1)", border: "1px solid rgba(128,82,255,0.3)", color: "#ffffff", borderRadius: 20, padding: "6px 14px", fontSize: 13, cursor: "pointer" }}>
              Asking about: {selectedPet?.name || "All Pets"} ▾
            </button>
            {showPetMenu && (
              <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 4, background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 4, zIndex: 10, minWidth: 140 }}>
                <button onClick={() => { setSelectedPetId(undefined); setShowPetMenu(false); }} style={{ display: "block", width: "100%", textAlign: "left", background: !selectedPetId ? "rgba(128,82,255,0.2)" : "transparent", border: "none", color: "#fff", padding: "8px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>All Pets</button>
                {pets.map((p) => (
                  <button key={p.id} onClick={() => { setSelectedPetId(p.id); setShowPetMenu(false); }} style={{ display: "block", width: "100%", textAlign: "left", background: selectedPetId === p.id ? "rgba(128,82,255,0.2)" : "transparent", border: "none", color: "#fff", padding: "8px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>{p.name}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.length === 0 && !sending ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
            <p style={{ fontSize: 18, color: "#9a9a9a" }}>Ask PawPal AI anything about your pet's health.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 500 }}>
              {suggestions.map((s) => (
                <button key={s} onClick={() => { setInput(s); }} style={{ background: "rgba(128,82,255,0.1)", border: "1px solid rgba(128,82,255,0.3)", color: "#ffffff", borderRadius: 20, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>{s}</button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id || i}
                initial={{ opacity: 0, x: msg.role === "user" ? 12 : -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, maxWidth: msg.role === "user" ? "60%" : "65%", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                  {msg.role === "assistant" && (
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
                <span style={{ fontSize: 11, color: msg.role === "user" ? "rgba(255,255,255,0.5)" : "#9a9a9a", marginTop: 4, marginLeft: msg.role === "assistant" ? 44 : 0, textAlign: msg.role === "user" ? "right" : "left" }}>
                  {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                </span>
              </motion.div>
            ))}
            {/* Typing indicator */}
            {sending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(128,82,255,0.2)", border: "1px solid rgba(128,82,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#8052ff">
                    <ellipse cx="7" cy="5" rx="2.5" ry="3" />
                    <ellipse cx="17" cy="5" rx="2.5" ry="3" />
                    <path d="M12 22c-4 0-6-3-6-6 0-2 2-4 6-4s6 2 6 4c0 3-2 6-6 6z" />
                  </svg>
                </div>
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px 18px 18px 18px", padding: "14px 18px", display: "flex", gap: 4 }}>
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} style={{ width: 6, height: 6, borderRadius: "50%", background: "#8052ff" }} />
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} style={{ width: 6, height: 6, borderRadius: "50%", background: "#8052ff" }} />
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} style={{ width: 6, height: 6, borderRadius: "50%", background: "#8052ff" }} />
                </div>
              </motion.div>
            )}
          </>
        )}
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
          disabled={!input.trim() || sending}
          style={{ width: 44, height: 44, borderRadius: "50%", background: input.trim() && !sending ? "#8052ff" : "rgba(128,82,255,0.3)", border: "none", color: "#fff", cursor: input.trim() && !sending ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, transition: "background 0.2s" }}
        >
          ↑
        </motion.button>
      </div>
      <p style={{ textAlign: "center", fontSize: 11, color: "#9a9a9a", opacity: 0.6, padding: "6px 0 12px" }}>PawPal AI can make mistakes. Always consult a vet for medical decisions.</p>
    </div>
  );
}
