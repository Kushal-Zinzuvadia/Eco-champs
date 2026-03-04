const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  getPosts,
  createPost,
  toggleLike,
  addComment,
  deletePost,
  getCommunityStats
} = require("../controllers/communityController");

// All community routes require authentication
router.get("/stats", auth, getCommunityStats);
router.get("/", auth, getPosts);
router.post("/", auth, createPost);
router.post("/:id/like", auth, toggleLike);
router.post("/:id/comment", auth, addComment);
router.delete("/:id", auth, deletePost);

module.exports = router;
