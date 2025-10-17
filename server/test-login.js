const axios = require("axios");

async function testLogin() {
  try {
    console.log("🔐 Testing login with demo@recipely.app...\n");

    const response = await axios.post("http://localhost:4000/apis/auth/login", {
      email: "demo@recipely.app",
      password: "password123",
    });

    console.log("✅ Login SUCCESS!\n");
    console.log("Response:", JSON.stringify(response.data, null, 2));
    console.log("\n🎉 Access Token:", response.data.access_token);
    console.log("👤 User:", response.data.user);
  } catch (error) {
    console.log("❌ Login FAILED!\n");
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Error:", error.response.data);
    } else {
      console.log("Error:", error.message);
    }
  }
}

testLogin();
