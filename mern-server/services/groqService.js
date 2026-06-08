const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const TODAY = new Date().toISOString().slice(0, 10);

const SYSTEM_PROMPT = `You are an AI expense parser. Convert the user's expense sentence into STRICT JSON.

Rules:
- Return ONLY valid JSON. No markdown. No explanations. No code blocks.
- Categories allowed: Food, Transport, Shopping, Entertainment, Bills, Health, Travel, Education, Miscellaneous
- Always extract the amount as a number
- Always provide a concise description
- Date format: YYYY-MM-DD

Examples:
Input: "Paid 50 for parking"
Output: {"amount":50,"category":"Transport","description":"parking","date":"${TODAY}"}

Input: "Lunch for two was 1200"
Output: {"amount":1200,"category":"Food","description":"Lunch for two","date":"${TODAY}"}

Input: "Spent 450 on burgers"
Output: {"amount":450,"category":"Food","description":"burgers","date":"${TODAY}"}`;

// Fallback parser (regex-based, works without API)
const fallbackParse = (text) => {
  const numMatch = text.match(/\d+(\.\d+)?/);
  if (!numMatch) return null;

  const amount = parseFloat(numMatch[0]);
  const lowerText = text.toLowerCase();

  let category = 'Miscellaneous';

  if (/food|eat|lunch|dinner|breakfast|restaurant|burger|pizza|coffee|groceries|meal|snack/.test(lowerText)) {
    category = 'Food';
  } else if (/uber|taxi|bus|train|metro|parking|fuel|petrol|gas|transport|ride|cab|lyft/.test(lowerText)) {
    category = 'Transport';
  } else if (/shop|buy|bought|cloth|dress|shoes|amazon|store|purchase/.test(lowerText)) {
    category = 'Shopping';
  } else if (/movie|cinema|game|netflix|spotify|concert|entertain|show|theater/.test(lowerText)) {
    category = 'Entertainment';
  } else if (/bill|electric|water|internet|phone|rent|utility|subscription/.test(lowerText)) {
    category = 'Bills';
  } else if (/doctor|medical|pharmacy|medicine|hospital|health|dental|clinic/.test(lowerText)) {
    category = 'Health';
  } else if (/travel|flight|hotel|trip|vacation|airbnb|booking/.test(lowerText)) {
    category = 'Travel';
  } else if (/school|college|course|tuition|book|education|class|learning/.test(lowerText)) {
    category = 'Education';
  }

  const description = text.replace(/\d+(\.\d+)?/g, '').trim() || text;

  return {
    amount,
    category,
    description: description.length > 100 ? description.substring(0, 100) : description,
    date: TODAY
  };
};

// Parse expense using Groq API (OpenAI-compatible)
const parseExpense = async (rawText) => {
  // If no API key, use fallback
  if (!GROQ_API_KEY) {
    console.log('No Groq API key, using fallback parser');
    return fallbackParse(rawText);
  }

  try {
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Parse this expense: "${rawText}"` }
        ],
        temperature: 0.1,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API error:', response.status, errorData);
      return fallbackParse(rawText);
    }

    const data = await response.json();
    const rawResponse = data?.choices?.[0]?.message?.content || '';

    // Clean response - remove any markdown code blocks
    const cleaned = rawResponse
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/gi, '')
      .replace(/^["']|["']$/g, '')
      .trim();

    // Parse JSON
    const parsed = JSON.parse(cleaned);

    // Validate required fields
    if (!parsed.amount || typeof parsed.amount !== 'number') {
      return fallbackParse(rawText);
    }

    const validCategories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Travel', 'Education', 'Miscellaneous'];
    if (!validCategories.includes(parsed.category)) {
      parsed.category = 'Miscellaneous';
    }

    if (!parsed.date || !/^\d{4}-\d{2}-\d{2}$/.test(parsed.date)) {
      parsed.date = TODAY;
    }

    return parsed;
  } catch (error) {
    console.error('Groq service error:', error.message);
    return fallbackParse(rawText);
  }
};

module.exports = { parseExpense, fallbackParse };
