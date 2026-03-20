const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getGeminiRecommendation = async (prompt) => {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash", 
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    return result.text;
  } catch (error) {
    console.error("SDK Error:", error.message);
    throw new Error("Failed to get recommendation");
  }
};

module.exports = getGeminiRecommendation;