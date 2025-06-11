const Challenge = require("../models/Challenge");
const User = require("../models/User");

exports.getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createChallenge = async (req, res) => {
  try {
    const { title, description, startDate, endDate, tasks, rewardPoints, isActive } = req.body;
    const challenge = new Challenge({ title, description, startDate, endDate, tasks, rewardPoints, isActive });
    await challenge.save();
    res.status(201).json(challenge);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.joinChallenge = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const userId = req.user.userId;
    const challenge = await Challenge.findByIdAndUpdate(
      challengeId,
      { $addToSet: { participants: userId } },
      { new: true }
    );
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });
    await User.findByIdAndUpdate(userId, { $addToSet: { joinedChallenges: challengeId } });
    res.json({ message: "Joined challenge", challenge });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.completeChallenge = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const userId = req.user.userId;
    // For simplicity, just add a badge and points
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });
    await User.findByIdAndUpdate(userId, {
      $addToSet: { badges: challenge.title },
      $inc: { ecoPoints: challenge.rewardPoints || 0 }
    });
    res.json({ message: "Challenge marked as completed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
