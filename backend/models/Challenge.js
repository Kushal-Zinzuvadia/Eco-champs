const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  tasks: [String],
  rewardPoints: Number,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isActive: Boolean
});

module.exports = mongoose.model("Challenge", challengeSchema);
