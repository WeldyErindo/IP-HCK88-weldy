require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server is working!" });
});

app.post("/apis/gemini/generate", async (req, res) => {
  console.log("Received gemini request:", req.body);

  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY || "AIzaSyDIA7udCwv580JyN02Wtl7oHmLcnH5A5j0"
  );

  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
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
  "instructions": "Step by step cooking instructions",
  "durationMinutes": 30,
  "thumbnail": "https://via.placeholder.com/400x300?text=AI+Generated+Recipe"
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const cleanedText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const recipeData = JSON.parse(cleanedText);

    recipeData.source = "gemini";
    recipeData.id = `gemini-${Date.now()}`;

    res.json(recipeData);
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({
      error: "Failed to generate recipe",
      details: error.message,
    });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`\n✅ Test server running on http://localhost:${PORT}`);
  console.log(
    `📡 Gemini endpoint: POST http://localhost:${PORT}/apis/gemini/generate\n`
  );
});
