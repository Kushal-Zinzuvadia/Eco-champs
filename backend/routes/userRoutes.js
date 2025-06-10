const express = require("express");
const router = express.Router();
const User = require("../models/User");

// @route   GET /api/users
// @desc    Get all users
// @access  Public (for now)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash"); // hide sensitive field
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
