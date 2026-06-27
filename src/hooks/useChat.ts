import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { ChatMessage } from "@/types";

export function useChat(petId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      let query = supabase.from("chat_messages").select("*").eq("user_id", user.id).order("created_at", { ascending: true });
      if (petId) query = query.eq("pet_id", petId);
      const { data, error } = await query;
      if (error) throw error;
      setMessages(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch messages");
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, activePetId?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setSending(true);
    setError(null);

    const userMsg = { user_id: user.id, pet_id: activePetId ?? null, role: "user" as const, content };
    
    try {
      const { error: insertError } = await supabase.from("chat_messages").insert(userMsg);
      if (insertError) throw insertError;
      setMessages((prev) => [...prev, { ...userMsg, id: crypto.randomUUID(), created_at: new Date().toISOString() }]);

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("No Gemini API key configured");

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
      
      if (!response.ok) throw new Error(`AI request failed: ${response.status}`);
      
      const data = await response.json();
      const aiContent = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "I'm sorry, I couldn't process that. Please try again.";

      const aiMsg = { user_id: user.id, pet_id: activePetId ?? null, role: "assistant" as const, content: aiContent };
      const { error: aiInsertError } = await supabase.from("chat_messages").insert(aiMsg);
      if (aiInsertError) throw aiInsertError;
      setMessages((prev) => [...prev, { ...aiMsg, id: crypto.randomUUID(), created_at: new Date().toISOString() }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      console.error("AI error:", err);
      const fallback = { user_id: user.id, pet_id: activePetId ?? null, role: "assistant" as const, content: "Sorry, I'm having trouble connecting. Please try again in a moment." };
      await supabase.from("chat_messages").insert(fallback);
      setMessages((prev) => [...prev, { ...fallback, id: crypto.randomUUID(), created_at: new Date().toISOString() }]);
    } finally {
      setSending(false);
    }
  };

  const clearHistory = async () => {
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from("chat_messages").delete().eq("user_id", user.id);
      if (error) throw error;
      setMessages([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear history");
      console.error("Error clearing history:", err);
    }
  };

  useEffect(() => { fetchMessages(); }, [petId]);
  return { messages, loading, sending, error, sendMessage, clearHistory };
}
