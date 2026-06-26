import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/app/chat")({
  component: ChatPage,
});

interface Message {
  role: "user" | "ai";
  content: string;
}

const sampleMessages: Message[] = [
  {
    role: "user",
    content:
      "My golden retriever has been scratching his ears a lot and shaking his head. Should I be worried?",
  },
  {
    role: "ai",
    content:
      "Frequent ear scratching and head shaking in golden retrievers often indicates an ear infection or allergies. Check for redness, odor, or discharge inside the ear flap. If you notice any of these, I'd recommend scheduling a vet visit within the next few days. In the meantime, avoid putting anything in the ear canal.",
  },
  {
    role: "user",
    content: "There's a bit of brown discharge. Is that serious?",
  },
  {
    role: "ai",
    content:
      "Brown discharge typically suggests a yeast or bacterial ear infection — common in floppy-eared breeds like goldens. It's treatable but does need veterinary attention for proper diagnosis and medication. I'd recommend booking an appointment within 24–48 hours. I've flagged this in Max's health timeline for your records.",
  },
];

function ChatPage() {
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl">
      <h1 className="text-heading font-semibold mb-6">AI Chat</h1>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
        {sampleMessages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-3xl p-4 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-plum-voltage/10 text-bone"
                  : "border border-white/10 text-bone"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border border-white/10 rounded-3xl p-4 bg-transparent flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your pet's health..."
          className="flex-1 bg-transparent text-bone placeholder:text-smoke outline-none text-sm"
        />
        <button className="bg-plum-voltage text-bone px-4 py-2 rounded-xl text-sm font-medium hover:bg-plum-voltage/80 transition-colors">
          Send
        </button>
      </div>
    </div>
  );
}
