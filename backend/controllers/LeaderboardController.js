const User = require("../models/User");

exports.getLeaderboard = async (req, res) => {
  try {
    // Optionally filter by query params
    const users = await User.find().sort({ ecoPoints: -1 }).limit(20).select("name ecoPoints badges");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
