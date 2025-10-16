const axios = require("axios");

async function testGemini() {
  try {
    console.log("🧪 Testing Gemini endpoint...\n");

    const response = await axios.post(
      "http://localhost:4000/apis/gemini/generate",
      {
        query: "chocolate cake",
      }
    );

    console.log("✅ SUCCESS!");
    console.log("\n📋 Recipe Generated:");
    console.log("Title:", response.data.title);
    console.log("Category:", response.data.category);
    console.log("Area:", response.data.area);
    console.log("Ingredients:", response.data.ingredients?.length, "items");
    console.log("\n" + JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("❌ FAILED!");
    console.error("Error:", error.message);
    console.error("Full error:", error);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    if (error.code) {
      console.error("Error code:", error.code);
    }
  }
}

testGemini();
