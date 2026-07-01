import { createServerFn } from "@tanstack/react-start";

export const getGeminiResponse = createServerFn({ method: "POST" })
  .validator((data: { content: string; image?: { mimeType: string; data: string } }) => data)
  .handler(async ({ data: { content, image } }) => {
    // Read the secret strictly from server-side environment variables
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("No Gemini API key configured on server");
    }

    const parts: any[] = [
      { text: `You are PawPal AI, a knowledgeable and caring pet health assistant. Help pet owners understand their pet's health, symptoms, and care needs based on their question and any attached photo of symptoms, rashes, wounds, eye concerns, or food labels. Always recommend consulting a real vet for serious concerns. Be warm, clear, and concise.\n\nUser: ${content}` }
    ];

    if (image) {
      parts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: image.data
        }
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`AI request failed: ${response.status}`);
    }

    const json = await response.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text ?? "I'm sorry, I couldn't process that. Please try again.";
  });
