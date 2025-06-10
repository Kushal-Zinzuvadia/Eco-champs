const mongoose = require("mongoose");

const wasteLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
  type: String, // e.g., "Recycled", "Composted"
  quantity: Number,
  imageUrl: String,
  comment: String,
  ecoPointsEarned: Number
});

module.exports = mongoose.model("WasteLog", wasteLogSchema);
