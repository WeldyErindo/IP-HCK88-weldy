require("dotenv").config();
const https = require("https");

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "models/gemini-2.5-flash";

console.log("Testing Gemini API with direct HTTP request...\n");
console.log(
  "API Key:",
  API_KEY ? `${API_KEY.substring(0, 10)}...${API_KEY.slice(-5)}` : "NOT SET"
);
console.log("Model:", MODEL, "\n");

const data = JSON.stringify({
  contents: [
    {
      parts: [
        {
          text: "Say 'Hello World' in JSON format with a 'message' field",
        },
      ],
    },
  ],
});

const options = {
  hostname: "generativelanguage.googleapis.com",
  port: 443,
  path: `/v1beta/${MODEL}:generateContent?key=${API_KEY}`,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length,
  },
};

const req = https.request(options, (res) => {
  console.log("Status Code:", res.statusCode);
  console.log("Headers:", JSON.stringify(res.headers, null, 2), "\n");

  let body = "";
  res.on("data", (chunk) => {
    body += chunk;
  });

  res.on("end", () => {
    try {
      const response = JSON.parse(body);
      if (res.statusCode === 200) {
        console.log("✅ SUCCESS!\n");
        console.log("Response:", JSON.stringify(response, null, 2));

        if (response.candidates && response.candidates[0]) {
          const text = response.candidates[0].content.parts[0].text;
          console.log("\n📝 Generated Text:");
          console.log(text);
        }
      } else {
        console.log("❌ ERROR!\n");
        console.log("Response:", JSON.stringify(response, null, 2));
      }
    } catch (e) {
      console.log("Raw response:", body);
    }
  });
});

req.on("error", (error) => {
  console.error("❌ Request Error:", error.message);
});

req.write(data);
req.end();
