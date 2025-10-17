require("dotenv").config();

console.log("=== Environment Variable Check ===");
console.log(
  "GEMINI_API_KEY:",
  process.env.GEMINI_API_KEY ? "SET ✓" : "NOT SET ✗"
);
console.log("Key length:", process.env.GEMINI_API_KEY?.length || 0);
console.log(
  "First 10 chars:",
  process.env.GEMINI_API_KEY?.substring(0, 10) || "N/A"
);
console.log("Last 5 chars:", process.env.GEMINI_API_KEY?.slice(-5) || "N/A");
console.log("================================");

const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY not found in environment!");
      process.exit(1);
    }

    console.log("✓ Initializing Gemini AI...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

 
    const modelNames = [
      "gemini-1.5-pro-latest",
      "gemini-1.5-flash-latest",
      "gemini-pro",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
    ];

    for (const modelName of modelNames) {
      try {
        console.log(`\n✓ Trying model: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(
          'Say hello in JSON format: {"message": "hello"}'
        );
        const response = result.response;
        const text = response.text();

        console.log("✓ Gemini API Response:", text);
        console.log(`\n✅ SUCCESS! Model "${modelName}" is working!`);
        return; 
      } catch (err) {
        console.log(
          `   ✗ Model "${modelName}" failed:`,
          err.message.split("\n")[0]
        );
      }
    }

    console.log("\n❌ All models failed. Please check your API key.");
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    if (error.message.includes("API_KEY_INVALID")) {
      console.error(
        "The API key is invalid. Please check your key at: https://aistudio.google.com/app/apikey"
      );
    }
  }
}

testGemini();
