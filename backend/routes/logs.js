const express = require("express");
const router = express.Router();

// Test route for /api/logs
router.get("/test", (req, res) => {
  res.json({ message: "Logs route working!" });
});

module.exports = router;
