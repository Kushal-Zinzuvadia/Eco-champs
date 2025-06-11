const WasteLog = require("../models/WasteLog");
const User = require("../models/User");

exports.addLog = async (req, res) => {
  try {
    const { userId, type, quantity, imageUrl, comment, ecoPointsEarned } = req.body;
    if (!userId || !type || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }
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
    const logs = await WasteLog.find({ userId });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteLog = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await WasteLog.findByIdAndDelete(id);
    if (!log) return res.status(404).json({ message: "Log not found" });
    await User.findByIdAndUpdate(log.userId, { $pull: { logs: log._id } });
    res.json({ message: "Log deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
