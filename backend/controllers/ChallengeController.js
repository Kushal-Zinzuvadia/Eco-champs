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

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Challenge title is required" });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Challenge description is required" });
    }
    if (!rewardPoints || rewardPoints < 1) {
      return res.status(400).json({ message: "Reward points must be at least 1" });
    }
    if (rewardPoints > 10000) {
      return res.status(400).json({ message: "Reward points cannot exceed 10,000" });
    }

    // Date validations
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate) {
      const start = new Date(startDate);
      if (start < today) {
        return res.status(400).json({ message: "Start date cannot be in the past" });
      }
      if (endDate) {
        const end = new Date(endDate);
        if (end <= start) {
          return res.status(400).json({ message: "End date must be after start date" });
        }
      }
    }
    if (endDate && !startDate) {
      const end = new Date(endDate);
      if (end < today) {
        return res.status(400).json({ message: "End date cannot be in the past" });
      }
    }

    const challenge = new Challenge({ title: title.trim(), description: description.trim(), startDate, endDate, tasks, rewardPoints, isActive });
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
    const challenge = await Challenge.findByIdAndUpdate(
      challengeId,
      { $addToSet: { completedBy: userId } },
      { new: true }
    );
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });
    await User.findByIdAndUpdate(userId, {
      $addToSet: { badges: challenge.title },
      $inc: { ecoPoints: challenge.rewardPoints || 0 }
    });
    res.json({ message: "Challenge marked as completed", challenge });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
