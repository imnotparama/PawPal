import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { usePets } from "@/hooks/usePets";
import { useChat } from "@/hooks/useChat";
import { toast } from "sonner";
import { PawPrint } from "lucide-react";

export const Route = createFileRoute("/app/chat")({
  component: ChatPage,
});

const suggestions = [
  "Is my pet's ear scratching serious?",
  "What vaccines does my pet need this year?",
  "My dog won't eat today, what should I do?",
  "How do I check for ticks on my cat?",
];

function renderMessageContent(content: string) {
  if (!content) return "";
  
  // Check if content contains triple backtick code blocks
  if (content.includes("```")) {
    const segments = content.split("```");
    return segments.map((segment, idx) => {
      if (idx % 2 === 1) {
        // It's a code block
        const lines = segment.split("\n");
        const language = lines[0].trim();
        const code = lines.slice(1).join("\n");
        return (
          <pre key={idx} style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, overflowX: "auto", fontFamily: "monospace", fontSize: 13, color: "#d4c5ff", margin: "12px 0" }}>
            {language && <div style={{ fontSize: 10, color: "#9a9a9a", textTransform: "uppercase", marginBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 4 }}>{language}</div>}
            <code>{code}</code>
          </pre>
        );
      }
      return renderMarkdownText(segment);
    });
  }

  return renderMarkdownText(content);
}

function renderMarkdownText(text: string) {
  const lines = text.split("\n");
  let inList = false;
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  
  const parseFormatting = (t: string) => {
    const parts = t.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={idx} style={{ fontWeight: 600, color: "#ffffff" }}>{part.slice(2, -2)}</strong>;
      } else if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={idx} style={{ fontStyle: "italic", color: "#bdbdbd" }}>{part.slice(1, -1)}</em>;
      } else if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={idx} style={{ background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: 4, fontFamily: "monospace", fontSize: 13, color: "#e0d5ff" }}>{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ")) {
      if (inList) {
        elements.push(<ul key={`list-${index}`} style={{ margin: "8px 0" }}>{listItems}</ul>);
        inList = false;
      }
      elements.push(<h3 key={index} style={{ fontSize: 16, fontWeight: 600, color: "#ffffff", marginTop: 12, marginBottom: 6 }}>{parseFormatting(trimmed.substring(4))}</h3>);
    } else if (trimmed.startsWith("## ")) {
      if (inList) {
        elements.push(<ul key={`list-${index}`} style={{ margin: "8px 0" }}>{listItems}</ul>);
        inList = false;
      }
      elements.push(<h2 key={index} style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", marginTop: 16, marginBottom: 8 }}>{parseFormatting(trimmed.substring(3))}</h2>);
    } else if (trimmed.startsWith("# ")) {
      if (inList) {
        elements.push(<ul key={`list-${index}`} style={{ margin: "8px 0" }}>{listItems}</ul>);
        inList = false;
      }
      elements.push(<h1 key={index} style={{ fontSize: 20, fontWeight: 600, color: "#ffffff", marginTop: 20, marginBottom: 10 }}>{parseFormatting(trimmed.substring(2))}</h1>);
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) {
        inList = true;
        listItems = [];
      }
      listItems.push(
        <li key={index} style={{ marginBottom: 4, listStyleType: "none", display: "flex", alignItems: "flex-start", gap: 8 }}>
          <span style={{ color: "#8052ff", flexShrink: 0 }}>•</span>
          <div>{parseFormatting(trimmed.substring(2))}</div>
        </li>
      );
    } else {
      if (inList) {
        elements.push(<ul key={`list-${index}`} style={{ margin: "8px 0" }}>{listItems}</ul>);
        inList = false;
      }
      if (trimmed) {
        elements.push(<p key={index} style={{ marginBottom: 8 }}>{parseFormatting(trimmed)}</p>);
      }
    }
  });
  
  if (inList) {
    elements.push(<ul key="list-final" style={{ margin: "8px 0" }}>{listItems}</ul>);
  }
  return elements;
}

function renderUserMessage(content: string) {
  if (content.startsWith("||IMAGE:")) {
    const parts = content.split("||");
    const imageData = parts[1].replace("IMAGE:", "");
    const textContent = parts.slice(2).join("||");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <img src={imageData} alt="Attached symptom" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 12, display: "block" }} />
        {textContent && <p style={{ margin: 0 }}>{textContent}</p>}
      </div>
    );
  }
  return content;
}

function ChatPage() {
  const { pets } = usePets();
  const [selectedPetId, setSelectedPetId] = useState<string | undefined>(undefined);
  const { messages, sending, error, sendMessage, clearHistory } = useChat(selectedPetId);
  const [input, setInput] = useState("");
  const [showPetMenu, setShowPetMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastSendTimeRef = useRef<number>(0);
  const [attachedImage, setAttachedImage] = useState<{ mimeType: string; data: string; previewUrl: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const resultStr = reader.result as string;
      const base64Data = resultStr.split(",")[1];
      setAttachedImage({
        mimeType: file.type,
        data: base64Data,
        previewUrl: resultStr
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US";

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        setRecognition(rec);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser. Please try Google Chrome or Safari.");
      return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleSend = () => {
    if ((!input.trim() && !attachedImage) || sending) return;

    const now = Date.now();
    if (now - lastSendTimeRef.current < 2000) {
      toast.error("Please wait a moment before sending another message.");
      return;
    }
    lastSendTimeRef.current = now;

    sendMessage(
      input,
      selectedPetId,
      attachedImage ? { mimeType: attachedImage.mimeType, data: attachedImage.data } : undefined
    );
    setInput("");
    setAttachedImage(null);
  };

  const selectedPet = pets.find((p) => p.id === selectedPetId);

  return (
    <div style={{ background: "#000000", height: "calc(100vh - 100px)", display: "flex", flexDirection: "column", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", overflow: "hidden" }}>
      {/* Pet Selection Header Bar */}
      <div style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 24px", display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: "#9a9a9a" }}>Chatting about:</span>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowPetMenu(!showPetMenu)}
              style={{
                background: "rgba(128,82,255,0.1)",
                border: "1px solid rgba(128,82,255,0.3)",
                color: "#ffffff",
                borderRadius: "20px",
                padding: "6px 14px",
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontWeight: 600
              }}
            >
              {selectedPet ? (
                <>
                  {selectedPet.photo_url ? (
                    <img src={selectedPet.photo_url} alt={selectedPet.name} style={{ width: 18, height: 18, borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#8052ff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>{selectedPet.name[0]}</span>
                  )}
                  {selectedPet.name}
                </>
              ) : (
                "All Pets"
              )}
              <span>▾</span>
            </button>
            {showPetMenu && (
              <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 4, background: "#111111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 4, zIndex: 30, minWidth: 160 }}>
                <button
                  onClick={() => { setSelectedPetId(undefined); setShowPetMenu(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", background: !selectedPetId ? "rgba(128,82,255,0.2)" : "transparent", border: "none", color: "#fff", padding: "8px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}
                >
                  All Pets
                </button>
                {pets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedPetId(p.id); setShowPetMenu(false); }}
                    style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", background: selectedPetId === p.id ? "rgba(128,82,255,0.2)" : "transparent", border: "none", color: "#fff", padding: "8px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}
                  >
                    {p.photo_url ? (
                      <img src={p.photo_url} alt={p.name} style={{ width: 16, height: 16, borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ width: 16, height: 16, borderRadius: "50%", background: "#8052ff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>{p.name[0]}</span>
                    )}
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button onClick={clearHistory} style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", color: "#ff6b6b", borderRadius: 20, padding: "6px 14px", fontSize: 12, cursor: "pointer" }}>Clear Chat</button>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        {error && (
          <div style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: 12, padding: "12px 16px", color: "#ff6b6b", fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Error loading messages: {error}</span>
            <button onClick={() => window.location.reload()} style={{ background: "#ff6b6b", border: "none", color: "#fff", padding: "4px 8px", borderRadius: 8, fontSize: 11, cursor: "pointer" }}>Retry</button>
          </div>
        )}

        {messages.length === 0 && !sending ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: "48px 0", minHeight: "100%" }}>
            
            {/* Paw Illustration with Breathing Animation */}
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              style={{
                width: 80,
                height: 80,
                background: "rgba(128,82,255,0.1)",
                border: "1px solid rgba(128,82,255,0.2)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <PawPrint size={36} color="#8052ff" />
            </motion.div>

            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 18, color: "#ffffff", textAlign: "center", margin: 0, fontWeight: 500, fontFamily: "'Space Grotesk', sans-serif" }}>Ask PawPal AI anything about your pet's health.</p>
              <p style={{ fontSize: 12, color: "#9a9a9a", textAlign: "center", marginTop: 8, marginBottom: 0, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400 }}>
                Powered by Google Gemini · Responses are not a substitute for professional veterinary advice.
              </p>
            </div>

            {/* AI Feature Pills Row */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 8 }}>
              {[
                "🎤 Voice Input",
                "📷 Photo Analysis",
                "🐾 Per-Pet Context"
              ].map((pill) => (
                <span 
                  key={pill} 
                  style={{ 
                    background: "rgba(255,255,255,0.04)", 
                    border: "1px solid rgba(255,255,255,0.08)", 
                    color: "#9a9a9a", 
                    borderRadius: "20px", 
                    padding: "4px 12px", 
                    fontSize: 12,
                    fontFamily: "'Space Grotesk', sans-serif" 
                  }}
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* Suggestions Chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 500 }}>
              {suggestions.map((s) => (
                <button key={s} onClick={() => { setInput(s); }} style={{ background: "rgba(128,82,255,0.1)", border: "1px solid rgba(128,82,255,0.3)", color: "#ffffff", borderRadius: 20, padding: "8px 16px", fontSize: 13, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#8052ff" } onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(128,82,255,0.3)" }>{s}</button>
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
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, maxWidth: msg.role === "user" ? "70%" : "75%", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: msg.role === "user" ? "#8052ff" : "rgba(255,255,255,0.1)", border: msg.role === "user" ? "none" : "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, fontWeight: "bold", color: "#fff" }}>
                    {msg.role === "user" ? "U" : "AI"}
                  </div>
                  <div style={{
                    background: msg.role === "user" ? "#8052ff" : "rgba(255,255,255,0.04)",
                    border: msg.role === "user" ? "none" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: msg.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                    padding: "14px 18px",
                    fontSize: 15,
                    color: msg.role === "user" ? "#ffffff" : "#e0e0e0",
                    lineHeight: 1.6,
                  }}>
                    {msg.role === "user" ? renderUserMessage(msg.content) : renderMessageContent(msg.content)}
                  </div>
                </div>
                <span style={{ fontSize: 11, color: msg.role === "user" ? "rgba(255,255,255,0.5)" : "#9a9a9a", marginTop: 4, marginLeft: msg.role === "assistant" ? 44 : 0, marginRight: msg.role === "user" ? 44 : 0, textAlign: msg.role === "user" ? "right" : "left" }}>
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
                  <span>AI</span>
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

      {/* Attached Image Preview */}
      {attachedImage && (
        <div style={{ padding: "12px 24px", background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <div style={{ position: "relative", width: 60, height: 60 }}>
            <img src={attachedImage.previewUrl} alt="Preview" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, border: "1px solid #8052ff" }} />
            <button
              onClick={() => setAttachedImage(null)}
              style={{ position: "absolute", top: -6, right: -6, background: "#ff6b6b", border: "none", color: "#ffffff", width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, cursor: "pointer", fontWeight: "bold" }}
            >
              ✕
            </button>
          </div>
          <span style={{ fontSize: 12, color: "#9a9a9a" }}>Image attached. Submit query to analyze symptoms.</span>
        </div>
      )}

      {/* Input Bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)", padding: "16px 24px", display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
        <button onClick={() => fileInputRef.current?.click()} style={{ background: "none", border: "none", color: "#9a9a9a", cursor: "pointer", fontSize: 18 }} title="Attach Image">📎</button>
        <button
          onClick={toggleListening}
          style={{
            background: isListening ? "rgba(255,80,80,0.15)" : "none",
            border: isListening ? "1px solid rgba(255,80,80,0.4)" : "none",
            color: isListening ? "#ff6b6b" : "#9a9a9a",
            cursor: "pointer",
            fontSize: 18,
            width: 32,
            height: 32,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative"
          }}
          title={isListening ? "Stop listening" : "Ask by voice"}
        >
          {isListening ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b6b] animate-ping absolute" />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <rect x="9" y="9" width="6" height="6" />
              </svg>
            </>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          )}
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          placeholder="Describe your pet's symptoms..."
          style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "14px 20px", fontSize: 15, color: "#ffffff", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#8052ff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(128,82,255,0.1)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
        />
        <motion.button
          onClick={handleSend}
          whileHover={{ boxShadow: "0 0 16px rgba(128,82,255,0.5)" }}
          whileTap={{ scale: 0.9 }}
          disabled={(!input.trim() && !attachedImage) || sending}
          style={{ width: 44, height: 44, borderRadius: "50%", background: (input.trim() || attachedImage) && !sending ? "#8052ff" : "rgba(128,82,255,0.3)", border: "none", color: "#fff", cursor: (input.trim() || attachedImage) && !sending ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, transition: "background 0.2s" }}
        >
          {sending ? (
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            "✈"
          )}
        </motion.button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} accept="image/*" />
      </div>
      <p style={{ textAlign: "center", fontSize: 11, color: "#9a9a9a", opacity: 0.6, padding: "6px 0 12px", margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
        PawPal AI can make mistakes. Always consult a vet for medical decisions.
        <br />
        🔒 Your conversations are encrypted and stored securely. Gemini API key never reaches your browser.
      </p>
    </div>
  );
}
