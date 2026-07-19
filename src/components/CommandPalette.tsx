import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Syringe, 
  Activity, 
  FileText, 
  User, 
  HelpCircle, 
  Volume2, 
  Trash2, 
  PlusCircle, 
  Search 
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Toggle Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSearch("");
      setActiveIndex(0);
    }
  }, [isOpen]);

  const items: CommandItem[] = [
    {
      id: "go-dashboard",
      title: "Go to Dashboard",
      description: "Overview of your pets' wellness status",
      category: "Navigation",
      icon: <LayoutDashboard size={16} />,
      action: () => {
        navigate({ to: "/dashboard" });
        setIsOpen(false);
      }
    },
    {
      id: "go-chat",
      title: "Go to AI Chat",
      description: "Talk to PawPal AI health companion",
      category: "Navigation",
      icon: <MessageSquare size={16} />,
      action: () => {
        navigate({ to: "/dashboard/chat" });
        setIsOpen(false);
      }
    },
    {
      id: "go-vaccinations",
      title: "Go to Vaccinations",
      description: "Manage upcoming and completed shots",
      category: "Navigation",
      icon: <Syringe size={16} />,
      action: () => {
        navigate({ to: "/dashboard/vaccinations" });
        setIsOpen(false);
      }
    },
    {
      id: "go-records",
      title: "View Medical Records",
      description: "Clinic visit notes, invoices, prescriptions",
      category: "Navigation",
      icon: <FileText size={16} />,
      action: () => {
        navigate({ to: "/dashboard/records" });
        setIsOpen(false);
      }
    },
    {
      id: "go-timeline",
      title: "View Health Timeline",
      description: "Unified chronological wellness events",
      category: "Navigation",
      icon: <Activity size={16} />,
      action: () => {
        navigate({ to: "/dashboard/timeline" });
        setIsOpen(false);
      }
    },
    {
      id: "go-profile",
      title: "Go to My Profile",
      description: "View account settings and profile details",
      category: "Navigation",
      icon: <User size={16} />,
      action: () => {
        navigate({ to: "/dashboard/profile" });
        setIsOpen(false);
      }
    },
    {
      id: "go-support",
      title: "Go to Help & Support",
      description: "Browse FAQs or contact the developer",
      category: "Navigation",
      icon: <HelpCircle size={16} />,
      action: () => {
        navigate({ to: "/dashboard/support" });
        setIsOpen(false);
      }
    },
    {
      id: "action-purr",
      title: "Open Cat Purr Therapy",
      description: "Scroll to and focus the vibrational stress relief widget",
      category: "Actions",
      icon: <Volume2 size={16} />,
      action: () => {
        navigate({ to: "/dashboard" }).then(() => {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("pawpal_focus_purr"));
          }, 300);
        });
        setIsOpen(false);
      }
    },
    {
      id: "action-add-pet",
      title: "Add New Pet Profile",
      description: "Open the modal to create a new companion profile",
      category: "Actions",
      icon: <PlusCircle size={16} />,
      action: () => {
        navigate({ to: "/dashboard/pets" }).then(() => {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("pawpal_add_pet"));
          }, 300);
        });
        setIsOpen(false);
      }
    },
    {
      id: "action-clear-chat",
      title: "Clear AI Chat History",
      description: "Clear active conversation history",
      category: "Actions",
      icon: <Trash2 size={16} />,
      action: () => {
        if (location.pathname.includes("chat")) {
          window.dispatchEvent(new CustomEvent("pawpal_clear_chat"));
        } else {
          navigate({ to: "/dashboard/chat" }).then(() => {
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent("pawpal_clear_chat"));
            }, 300);
          });
        }
        setIsOpen(false);
      }
    }
  ];

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) {
        filtered[activeIndex].action();
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;
    const activeEl = listEl.children[activeIndex] as HTMLElement;
    if (!activeEl) return;

    const listHeight = listEl.clientHeight;
    const activeTop = activeEl.offsetTop;
    const activeHeight = activeEl.clientHeight;

    if (activeTop + activeHeight > listEl.scrollTop + listHeight) {
      listEl.scrollTop = activeTop + activeHeight - listHeight;
    } else if (activeTop < listEl.scrollTop) {
      listEl.scrollTop = activeTop;
    }
  }, [activeIndex]);

  return (
    <>
      {/* Keyboard guide watermark in layout */}
      <div 
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          background: "rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 8,
          padding: "6px 12px",
          fontSize: 11,
          color: "#9a9a9a",
          pointerEvents: "none",
          zIndex: 9000,
          fontFamily: "'Space Grotesk', sans-serif"
        }}
      >
        Press <kbd style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 3, padding: "1px 5px", fontSize: 9, fontFamily: "monospace" }}>Ctrl+K</kbd> to open Command Palette
      </div>

      <AnimatePresence>
        {isOpen && (
          <div 
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(8px)",
              zIndex: 99999,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              paddingTop: "15vh"
            }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: 560,
                background: "#0a0a0a",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 16,
                boxShadow: "0 24px 48px rgba(0, 0, 0, 0.5), 0 0 40px rgba(128, 82, 255, 0.05)",
                overflow: "hidden",
                fontFamily: "'Space Grotesk', sans-serif"
              }}
            >
              {/* Search input header */}
              <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <Search size={18} color="#9a9a9a" style={{ marginRight: 12, flexShrink: 0 }} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or search routes..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    color: "#ffffff",
                    fontSize: 15,
                    outline: "none",
                    fontFamily: "'Space Grotesk', sans-serif"
                  }}
                />
              </div>

              {/* Items List */}
              {/* Live region: announces result count to screen readers */}
              <div aria-live="polite" aria-atomic="true" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </div>
              <div 
                ref={listRef}
                role="listbox"
                aria-label="Command results"
                style={{
                  maxHeight: 280,
                  overflowY: "auto",
                  padding: 8
                }}
              >
                {filtered.length === 0 ? (
                  <div style={{ padding: "20px", textAlign: "center", color: "#9a9a9a", fontSize: 13 }}>
                    No results found for "{search}"
                  </div>
                ) : (
                  filtered.map((item, idx) => {
                    const isSelected = activeIndex === idx;
                    return (
                      <div
                        key={item.id}
                        role="option"
                        aria-selected={isSelected}
                        id={`cmd-item-${item.id}`}
                        onClick={item.action}
                        onMouseEnter={() => setActiveIndex(idx)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "10px 14px",
                          borderRadius: 10,
                          cursor: "pointer",
                          background: isSelected ? "rgba(128, 82, 255, 0.15)" : "transparent",
                          transition: "background 0.15s"
                        }}
                      >
                        <div style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: isSelected ? "rgba(128, 82, 255, 0.2)" : "rgba(255,255,255,0.04)",
                          color: isSelected ? "#8052ff" : "#9a9a9a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 14,
                          flexShrink: 0
                        }}>
                          {item.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#ffffff", display: "block" }}>{item.title}</span>
                          <span style={{ fontSize: 11, color: "#9a9a9a", display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{item.description}</span>
                        </div>
                        <span style={{
                          fontSize: 10,
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#9a9a9a",
                          borderRadius: 4,
                          padding: "2px 6px",
                          marginLeft: 12,
                          flexShrink: 0
                        }}>
                          {item.category}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Guide Footer */}
              <div style={{
                background: "rgba(0,0,0,0.3)",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                padding: "10px 20px",
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                color: "#9a9a9a"
              }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <span><kbd style={{ background: "rgba(255,255,255,0.1)", borderRadius: 3, padding: "1px 4px" }}>↑↓</kbd> to navigate</span>
                  <span><kbd style={{ background: "rgba(255,255,255,0.1)", borderRadius: 3, padding: "1px 4px" }}>enter</kbd> to select</span>
                </div>
                <span><kbd style={{ background: "rgba(255,255,255,0.1)", borderRadius: 3, padding: "1px 4px" }}>esc</kbd> to close</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
