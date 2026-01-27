import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

// Using the working model
const API_VERSION = 'v1beta'; 
const MODEL_NAME = 'gemini-flash-latest';

const BASE_URL = `https://generativelanguage.googleapis.com/${API_VERSION}/models/${MODEL_NAME}:generateContent`;

async function callGeminiAPI(promptText, isJsonMode = false) {
  if (!API_KEY) return "Error: API Key is missing.";

  try {
    const payload = {
      contents: [{ parts: [{ text: promptText }] }]
    };

    // Force JSON only if requested
    if (isJsonMode) {
      payload.generationConfig = { response_mime_type: "application/json" };
    }

    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("API Error:", data);
        return isJsonMode ? "{}" : "I am having trouble connecting right now.";
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || (isJsonMode ? "{}" : "No response.");

  } catch (error) {
    console.error("Network Error:", error.message);
    return isJsonMode ? "{}" : "Network error.";
  }
}

// --- 1. BILL ANALYSIS (Robust Fix for Empty Suggestions) ---
export async function analyzeBillWithGemini(bill, instruction = '') {
  console.log(`🔍 Analyzing ${bill.type} bill...`);

  // Default suggestions to fallback on if AI fails
  const defaultSuggestions = [
    "Check for peak-hour usage rates.",
    "Verify the meter reading matches your bill.",
    "Look for unexplained service charges."
  ];

  const prompt = `
    You are an expert Bill Analyst. 
    Analyze this bill and return strictly valid JSON.
    
    Data:
    - Type: ${bill.type}
    - Amount: ${bill.amount}
    - Date: ${bill.date}
    ${instruction ? `- User Note: ${instruction}` : ''}

    Rules:
    1. 'suggestions' MUST contain 3 distinct, useful sentences. NO empty strings.
    2. 'scamAlerts' should only be populated if the amount seems suspiciously high.
    3. 'explanation' should be clear and concise (2-3 sentences).

    JSON Structure:
    {
      "explanation": "Summary of the bill...",
      "scamAlerts": ["Alert 1", "Alert 2"],
      "optionalCharges": ["Charge 1"],
      "suggestions": ["Tip 1", "Tip 2", "Tip 3"]
    }
  `;

  try {
    const textResponse = await callGeminiAPI(prompt, true);
    
    // Clean up response
    const cleaned = textResponse.replace(/```json|```/g, '').trim();
    const json = JSON.parse(cleaned);

    // ✅ SANITIZER: Filter out empty strings from suggestions
    let validSuggestions = (json.suggestions || []).filter(s => s && s.trim().length > 5);
    
    // If AI gave 0 valid suggestions, use the defaults
    if (validSuggestions.length === 0) {
        validSuggestions = defaultSuggestions;
    }

    return {
      explanation: json.explanation || `Analysis of your ${bill.type} bill (Amount: ${bill.amount}).`,
      scamAlerts: json.scamAlerts || [],
      optionalCharges: json.optionalCharges || [],
      suggestions: validSuggestions 
    };

  } catch (e) {
    console.error("Analysis Error:", e.message);
    return {
      explanation: "We could not fully analyze this bill, but we have saved it for you.",
      scamAlerts: [],
      optionalCharges: [],
      suggestions: defaultSuggestions
    };
  }
}

// --- 2. CHAT FUNCTION (Fix for JSON replies) ---
export async function chatWithGemini(message, billContext = null) {
  const context = billContext 
    ? `User is asking about their ${billContext.type} bill of ${billContext.amount}.` 
    : "No specific bill is selected.";
    
  // ✅ STRICT SYSTEM INSTRUCTION to prevent JSON output in chat
  const prompt = `
    SYSTEM: You are BillWise, a helpful assistant. 
    CONTEXT: ${context}
    INSTRUCTION: Reply to the user in plain text only. Do NOT use JSON. Do NOT output debug codes. Be friendly and short.
    
    USER: "${message}"
  `;

  return await callGeminiAPI(prompt, false);
}

// --- 3. TEST ---
export async function testGeminiConnection() {
  const res = await callGeminiAPI("Hello", false);
  if (res.includes("Error") || res.includes("trouble")) {
    return { success: false, error: res };
  }
  return { success: true };
}