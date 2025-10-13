import Constants from "expo-constants";

const OPENAI_API_KEY =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_OPENAI_API_KEY ||
  process.env.EXPO_PUBLIC_OPENAI_API_KEY;

// Mood-specific prompts for caption generation

const MOOD_PROMPTS: Record<string, string> = {
  aesthetic:
    "Generate a short, aesthetic Instagram caption (under 15 words) that feels dreamy, poetic, and visually pleasing. Avoid clichés. Use subtle or elegant emojis only if they fit the tone.",

  funny:
    "Generate a short, funny Instagram caption that feels witty, sarcastic, or ironically relatable in a Gen Z tone. Include relevant emojis naturally.",

  flirty:
    "Generate a short, flirty Instagram caption that feels confident, playful, and lightly teasing. It should sound human and charming, not cringy. Use romantic or cheeky emojis.",

  motivational:
    "Generate a short, motivational Instagram caption that is punchy, empowering, and energetic. Keep it modern and not overly formal. Include motivating emojis.",

  chill:
    "Generate a short, laid-back Instagram caption that radiates calm, easygoing, weekend energy. Use casual tone and chill emojis like ☁️, 🌊, or 😌.",

  melancholy:
    "Generate a short, emotionally deep Instagram caption that feels nostalgic, soft, or heartbroken. Avoid dramatic phrasing, keep it introspective. Use gentle emojis like 💭 or 🌧️.",

  romantic:
    "Generate a short, romantic Instagram caption that is heartfelt, poetic, and full of affection. Avoid clichés. Use delicate love-themed emojis.",

  sassy:
    "Generate a short, confident and sassy Instagram caption that gives main-character energy. Add playful or dramatic emojis as flair.",

  travel:
    "Generate a short, wanderlust-style Instagram caption that captures adventure, freedom, and exploration. Use upbeat and scenic emojis like ✈️🌍☀️.",

  workVibes:
    "Generate a short, professional yet cool Instagram caption that gives productivity and ambition energy. Use emojis like 💼, ☕, or 📈.",
};

export async function generateCaption(mood: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error(
      "OpenAI API key not configured. Please add EXPO_PUBLIC_OPENAI_API_KEY to your .env file."
    );
  }

  const prompt = MOOD_PROMPTS[mood] || MOOD_PROMPTS.aesthetic;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
              You are Moodify — an AI social media caption creator specialist.
              Your job is to write short, authentic, emotionally expressive captions based on the user's selected mood and photo context.
              
              Guidelines:
              - Keep captions under 15 words.
              - Match the tone of the selected mood (funny, flirty, aesthetic, chill, etc.).
              - Use modern, natural language — avoid corporate or cliché phrasing.
              - Emojis are optional but should fit the vibe naturally (never overuse them).
              - Captions should sound human and scroll-stopping — something users would actually post.
              - Never include hashtags, quotes, or markdown formatting.
              `,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 100,
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to generate caption");
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || "Vibes ✨";
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw error;
  }
}
