const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { getUserStats } = require('../controllers/userStatsController');
const auth = require("../middlewares/auth");

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

// @route   GET /api/users/:userId/stats
// @desc    Get stats for a user
// @access  Protected
router.get('/:userId/stats', auth, getUserStats);

// @route   GET /api/users/:userId
// @desc    Get a single user profile
// @access  Protected
router.get('/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-passwordHash')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router;
