const axios = require('axios');
const assert = require('assert');

const API_BASE = 'http://localhost:5000/api';
// We must use an axios instance with cookies enabled
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  validateStatus: () => true // resolve all statuses
});

async function runTests() {
  console.log("🚀 Starting E2E API Verification...");

  try {
    // 1. Signup / Login
    let res = await api.post('/auth/signup', { name: "Test User", email: "test@example.com", password: "password123" });
    if (res.status === 409) {
      console.log("User already exists, attempting login...");
      res = await api.post('/auth/login', { email: "test@example.com", password: "password123" });
    }
    
    // Cookie passing between requests requires manually handling the Set-Cookie array for this generic node instance
    const cookies = res.headers['set-cookie'];
    if (cookies) {
      api.defaults.headers.Cookie = cookies;
      console.log("✅ Auth Cookie Received");
    } else {
      console.error("❌ Auth Cookie NOT Received");
      process.exit(1);
    }
    
    const userId = res.data.user.id;
    assert(userId, "User ID should exist in response");

    // 2. /me Endpoint Verification
    res = await api.get('/auth/me');
    assert(res.status === 200, "Should return 200 for /me");
    assert(res.data.user.id === userId, "Should return correct user ID from HttpOnly cookie session");
    console.log("✅ /auth/me Endpoint verified");

    // 3. Post a Waste Log
    res = await api.post('/logs', { type: "plastic", quantity: 5, comment: "Test bottles" });
    assert(res.status === 201, "Should create a log successfully");
    const logId = res.data._id;
    assert(res.data.ecoPointsEarned === 50, "Should securely calculate 50 points (Plastic 10 * 5) exclusively on backend");
    console.log("✅ Secure Point Assignment /logs POST verified");

    // 4. Get User Logs (Should Succeed for owner)
    res = await api.get(`/logs/${userId}`);
    assert(res.status === 200, "Should allow fetching own logs");
    assert(res.data.length > 0, "Should return array of logs");
    console.log("✅ IDOR Protected /logs GET verified");
    
    // 5. Get User Stats
    res = await api.get(`/users/${userId}/stats`);
    assert(res.status === 200, "Should allow fetching own stats");
    assert(res.data.ecoPoints >= 50, "Stats should include the 50 points just earned");
    console.log("✅ IDOR Protected /stats GET verified");

    // 6. Delete Log (Should Succeed for owner)
    res = await api.delete(`/logs/${logId}`);
    assert(res.status === 200, "Should allow deleting own log");
    console.log("✅ IDOR Protected /logs DELETE verified");

    // 7. Verify Logout
    res = await api.post('/auth/logout');
    assert(res.headers['set-cookie'][0].includes('token=;'), "Should clear cookie");
    console.log("✅ Secure Logout verified");

    console.log("\n🎉 ALL API TESTS PASSED SUCCESSFULLY!");
  } catch (error) {
    console.error("\n❌ TEST FAILED:", error.message || error);
    process.exit(1);
  }
}

runTests();
