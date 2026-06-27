import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useChat(petId?: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    let query = supabase.from("chat_messages").select("*").eq("user_id", user.id).order("created_at", { ascending: true });
    if (petId) query = query.eq("pet_id", petId);
    const { data } = await query;
    setMessages(data ?? []);
    setLoading(false);
  };

  const sendMessage = async (content: string, activePetId?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setSending(true);

    const userMsg = { user_id: user.id, pet_id: activePetId ?? null, role: "user" as const, content };
    await supabase.from("chat_messages").insert(userMsg);
    setMessages((prev) => [...prev, { ...userMsg, id: crypto.randomUUID(), created_at: new Date().toISOString() }]);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("No Gemini API key");

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `You are PawPal AI, a knowledgeable and caring pet health assistant. Help pet owners understand their pet's health, symptoms, and care needs. Always recommend consulting a real vet for serious concerns. Be warm, clear, and concise.\n\nUser: ${content}` }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
          }),
        }
      );
      const data = await response.json();
      const aiContent = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "I'm sorry, I couldn't process that. Please try again.";

      const aiMsg = { user_id: user.id, pet_id: activePetId ?? null, role: "assistant" as const, content: aiContent };
      await supabase.from("chat_messages").insert(aiMsg);
      setMessages((prev) => [...prev, { ...aiMsg, id: crypto.randomUUID(), created_at: new Date().toISOString() }]);
    } catch (err) {
      console.error("AI error:", err);
      const fallback = { user_id: user.id, pet_id: activePetId ?? null, role: "assistant" as const, content: "Sorry, I'm having trouble connecting. Please try again in a moment." };
      await supabase.from("chat_messages").insert(fallback);
      setMessages((prev) => [...prev, { ...fallback, id: crypto.randomUUID(), created_at: new Date().toISOString() }]);
    }
    setSending(false);
  };

  const clearHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("chat_messages").delete().eq("user_id", user.id);
    setMessages([]);
  };

  useEffect(() => { fetchMessages(); }, [petId]);
  return { messages, loading, sending, sendMessage, clearHistory };
}
