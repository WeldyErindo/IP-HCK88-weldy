require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    console.log("Fetching available models...\n");

    const models = await genAI.listModels();

    console.log("Available models:");
    console.log(JSON.stringify(models, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
    console.error("\nPossible issues:");
    console.error("1. API key might not be activated");
    console.error("2. Generative AI API might not be enabled");
    console.error("3. Visit: https://makersuite.google.com/app/apikey");
    console.error(
      "4. Make sure to enable the API and create a new key if needed"
    );
  }
}

listModels();
