const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema({
  name: String,
  description: String,
  condition: String // e.g., "10 compost logs"
});

module.exports = mongoose.model("Badge", badgeSchema);
