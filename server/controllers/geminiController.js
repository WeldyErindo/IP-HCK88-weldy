const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

exports.generateRecipe = async (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error:
          "Gemini API key not configured. Please set GEMINI_API_KEY in .env file",
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Create a detailed recipe based on this request: "${query}"

Please provide the recipe in the following JSON format (respond ONLY with valid JSON, no markdown):
{
  "title": "Recipe Name",
  "area": "Country/Region of origin",
  "category": "Category (e.g., Dessert, Main Course, Appetizer)",
  "ingredients": [
    "ingredient 1 with measurement",
    "ingredient 2 with measurement"
  ],
  "instructions": "Step by step cooking instructions in paragraph form",
  "durationMinutes": estimated cooking time in minutes (number),
  "thumbnail": "https://via.placeholder.com/400x300?text=AI+Generated+Recipe"
}

Make it detailed, practical, and delicious!`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

   
    let recipeData;
    try {
     
      const cleanedText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      recipeData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      return res.status(500).json({
        error: "Failed to parse AI response. Please try again.",
        rawResponse: text,
      });
    }

   
    if (!recipeData.title || !recipeData.instructions) {
      return res.status(500).json({
        error: "AI response missing required fields",
        data: recipeData,
      });
    }

  
    recipeData.thumbnail =
      recipeData.thumbnail ||
      "https://via.placeholder.com/400x300?text=AI+Generated+Recipe";
    recipeData.area = recipeData.area || "AI Generated";
    recipeData.category = recipeData.category || "AI Recipe";
    recipeData.ingredients = Array.isArray(recipeData.ingredients)
      ? recipeData.ingredients
      : [];
    recipeData.durationMinutes = recipeData.durationMinutes || 30;
    recipeData.source = "gemini";
    recipeData.id = `gemini-${Date.now()}`;

    res.json(recipeData);
  } catch (error) {
    console.error("Gemini API Error:", error);

    let errorMessage = "Failed to generate recipe with AI";

    if (error.message && error.message.includes("404")) {
      errorMessage =
        "AI model not available. Please check API key configuration at: https://aistudio.google.com/app/apikey";
    } else if (error.message && error.message.includes("API_KEY_INVALID")) {
      errorMessage =
        "Invalid API key. Please generate a new key at: https://aistudio.google.com/app/apikey";
    } else if (error.message && error.message.includes("PERMISSION_DENIED")) {
      errorMessage =
        "API key doesn't have permission. Make sure Generative Language API is enabled.";
    }

    res.status(500).json({
      error: errorMessage,
      details: error.message,
    });
  }
};
