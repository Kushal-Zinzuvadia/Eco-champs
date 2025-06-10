const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  ecoPoints: { type: Number, default: 0 },
  badges: [{ type: String }],
  logs: [{ type: mongoose.Schema.Types.ObjectId, ref: "WasteLog" }],
  joinedChallenges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }]
});

module.exports = mongoose.model("User", userSchema);