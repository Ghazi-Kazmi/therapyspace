import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateWithGemini(prompt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

export const getAIQuote = async (req, res) => {
  try {
    const prompt = `Generate one original, deeply meaningful and uplifting mental health quote for someone on their wellness journey. 
The quote should be:
- Warm, compassionate, and non-cliché
- 1-2 sentences maximum
- Inspiring without being dismissive of struggles
- About healing, growth, resilience, or self-compassion

Return ONLY a JSON object in this exact format (no markdown, no extra text):
{"text": "the quote here", "author": "Author Name or 'Aria, Therapy Space'"}`;

    const raw = await generateWithGemini(prompt);
    // Strip markdown code fences if present
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const quote = JSON.parse(cleaned);
    res.json(quote);
  } catch (error) {
    console.error('AI Quote error:', error);
    // Fallback quote
    res.json({
      text: "Healing isn't a destination you arrive at — it's the gentle act of showing up for yourself, again and again.",
      author: "Aria, Therapy Space"
    });
  }
};

export const getAIAffirmation = async (req, res) => {
  try {
    const prompt = `Generate one powerful, original daily affirmation for someone working on their mental health and self-worth.
The affirmation should:
- Be in the first person ("I am...", "I choose...", "I deserve...")
- Feel genuine and specific, not generic
- Be about self-compassion, growth, worthiness, or inner strength
- Be 1-2 sentences

Return ONLY the affirmation text as a plain string, nothing else.`;

    const affirmation = await generateWithGemini(prompt);
    // Clean up any quotes the model might have added
    const cleaned = affirmation.replace(/^["']|["']$/g, '').trim();
    res.json({ text: cleaned });
  } catch (error) {
    console.error('AI Affirmation error:', error);
    res.json({ text: "I am worthy of love, peace, and all the good things life has to offer — exactly as I am, right now." });
  }
};
