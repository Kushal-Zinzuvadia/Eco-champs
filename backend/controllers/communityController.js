const CommunityPost = require("../models/CommunityPost");
const User = require("../models/User");
const WasteLog = require("../models/WasteLog");
const Challenge = require("../models/Challenge");

// GET /api/community — Fetch all posts, newest first
exports.getPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .sort({ createdAt: -1 })
      .populate("author", "name")
      .populate("comments.author", "name");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/community — Create a new post
exports.createPost = async (req, res) => {
  try {
    const { content, category } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }
    if (content.trim().length > 2000) {
      return res.status(400).json({ message: "Post content cannot exceed 2000 characters" });
    }
    const validCategories = ["Tips", "Events", "DIY", "General"];
    const finalCategory = category && validCategories.includes(category) ? category : "General";

    const post = new CommunityPost({
      author: req.user.userId,
      content: content.trim(),
      category: finalCategory
    });
    await post.save();

    const populated = await post.populate("author", "name");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/community/:id/like — Toggle like on a post
exports.toggleLike = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.userId;
    const alreadyLiked = post.likes.some(id => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: !alreadyLiked });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/community/:id/comment — Add a comment
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ author: req.user.userId, content });
    await post.save();

    const populated = await post.populate("comments.author", "name");
    res.json(populated.comments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/community/:id — Delete own post
exports.deletePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }

    await CommunityPost.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/community/stats — Aggregate community-wide stats
exports.getCommunityStats = async (req, res) => {
  try {
    const activeMembers = await User.countDocuments();
    const totalItemsRecycled = await WasteLog.aggregate([
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ]);
    const totalChallengesCompleted = await Challenge.aggregate([
      { $project: { completedCount: { $size: { $ifNull: ["$completedBy", []] } } } },
      { $group: { _id: null, total: { $sum: "$completedCount" } } }
    ]);

    res.json({
      activeMembers,
      totalItemsRecycled: totalItemsRecycled[0]?.total || 0,
      totalChallengesCompleted: totalChallengesCompleted[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
