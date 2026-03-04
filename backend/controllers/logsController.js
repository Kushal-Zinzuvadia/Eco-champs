const WasteLog = require("../models/WasteLog");
const User = require("../models/User");

exports.addLog = async (req, res) => {
  try {
    const { type, quantity, imageUrl, comment } = req.body;
    const userId = req.user.userId;

    if (!type || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const validTypes = ["plastic", "paper", "glass", "metal", "organic", "electronic"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: `Invalid waste type. Must be one of: ${validTypes.join(", ")}` });
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be a positive integer" });
    }
    if (quantity > 1000) {
      return res.status(400).json({ message: "Quantity cannot exceed 1000 per entry" });
    }

    // Securely calculate points on backend instead of trusting client
    const pointValues = {
      plastic: 10,
      paper: 5,
      glass: 15,
      metal: 20,
      organic: 8,
      electronic: 50
    };
    
    const pointsPerItem = pointValues[type] || 5; // Fallback to 5 points
    const ecoPointsEarned = pointsPerItem * quantity;

    const log = new WasteLog({ userId, type, quantity, imageUrl, comment, ecoPointsEarned });
    await log.save();
    await User.findByIdAndUpdate(userId, { $push: { logs: log._id }, $inc: { ecoPoints: ecoPointsEarned || 0 } });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getLogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    const logs = await WasteLog.find({ userId });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteLog = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await WasteLog.findById(id);
    if (!log) return res.status(404).json({ message: "Log not found" });
    if (log.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized to delete this log" });
    }
    
    await WasteLog.findByIdAndDelete(id);
    await User.findByIdAndUpdate(log.userId, { $pull: { logs: log._id } });
    res.json({ message: "Log deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
