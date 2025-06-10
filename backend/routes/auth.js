const express = require("express");
const router = express.Router();

// Test route for /api/auth
router.get("/test", (req, res) => {
  res.json({ message: "Auth route working!" });
});

module.exports = router;
