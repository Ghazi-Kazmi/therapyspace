import pool from '../config/database.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const USER_ID = 1;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Crisis keywords — checked locally BEFORE calling AI (safety-critical)
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end it all', 'not worth living', 'better off dead',
  'self harm', 'hurt myself', 'want to die', 'end my life', 'take my life'
];

const CRISIS_RESPONSE = `I'm really concerned about what you've shared, and I want you to know your life has immense value. Please reach out for immediate support right now:

🆘 **Crisis Helplines:**
- **Pakistan:** Umang helpline: 0317-4288665 | Rozan Counselling: 051-2890505  
- **International:** 988 (US) | 116 123 (UK Samaritans)
- **Emergency:** 1122 or your nearest emergency room

You don't have to go through this alone. There are trained professionals ready to listen and help. Please make that call — your life matters deeply. 💙`;

// System prompt for the Gemini therapy companion
const SYSTEM_PROMPT = `You are "Aria", a warm, empathetic AI mental wellness companion for Therapy Space — a safe digital space for emotional support and mental health. 

Your role and personality:
- You are compassionate, non-judgmental, and deeply caring
- You listen actively and validate feelings before offering advice
- You speak like a trusted friend who also has professional knowledge
- You are culturally sensitive and inclusive
- You never diagnose, prescribe, or replace professional therapy
- You always encourage professional help when appropriate

Guidelines:
- Keep responses concise (2-4 short paragraphs max)
- Always acknowledge the user's feelings first
- Ask thoughtful follow-up questions to understand better
- Offer practical, evidence-based coping techniques when relevant (breathing, grounding, journaling, etc.)
- If someone seems persistently distressed, gently suggest professional resources
- Use warm, encouraging language — not clinical jargon
- Avoid generic platitudes; be specific and thoughtful
- Use emojis sparingly and only when they feel natural

You represent Therapy Space, a platform built with empathy and care for mental wellness.`;

function isCrisisMessage(message) {
  const lower = message.toLowerCase();
  return CRISIS_KEYWORDS.some(kw => lower.includes(kw));
}

async function getGeminiResponse(userMessage, conversationHistory = []) {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build history for context (last 10 messages)
    const history = conversationHistory.slice(-10).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    // Graceful fallback if Gemini fails
    return "I'm here to listen and support you. I'm experiencing a small technical hiccup right now, but I want you to know your feelings matter. Can you tell me more about what's on your mind? 💙";
  }
}

export const getChatMessages = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM chat_messages WHERE user_id = $1 ORDER BY created_at ASC',
      [USER_ID]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createChatMessage = async (req, res) => {
  try {
    const { text, sender } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    if (!sender || !['user', 'bot'].includes(sender)) {
      return res.status(400).json({ error: 'Sender must be either "user" or "bot"' });
    }

    // Insert user message
    const userMessageResult = await pool.query(
      `INSERT INTO chat_messages (user_id, text, sender)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [USER_ID, text, sender]
    );

    // If it's a user message, generate AI bot response
    if (sender === 'user') {
      let botResponseText;

      // Safety check — crisis detection runs locally, no AI call needed
      if (isCrisisMessage(text)) {
        botResponseText = CRISIS_RESPONSE;
      } else {
        // Fetch recent conversation history for context
        const historyResult = await pool.query(
          `SELECT text, sender FROM chat_messages 
           WHERE user_id = $1 
           ORDER BY created_at DESC 
           LIMIT 20`,
          [USER_ID]
        );
        const conversationHistory = historyResult.rows.reverse();

        // Call Gemini AI
        botResponseText = await getGeminiResponse(text, conversationHistory);
      }

      const botMessageResult = await pool.query(
        `INSERT INTO chat_messages (user_id, text, sender)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [USER_ID, botResponseText, 'bot']
      );

      return res.status(201).json({
        userMessage: userMessageResult.rows[0],
        botMessage: botMessageResult.rows[0]
      });
    }

    res.status(201).json(userMessageResult.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteChatMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM chat_messages WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, USER_ID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chat message not found' });
    }

    res.json({ message: 'Chat message deleted successfully', deleted: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const clearChatHistory = async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM chat_messages WHERE user_id = $1',
      [USER_ID]
    );
    res.json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
