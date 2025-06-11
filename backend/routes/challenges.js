const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  getAllChallenges,
  createChallenge,
  joinChallenge,
  completeChallenge
} = require("../controllers/ChallengeController");

router.get("/", getAllChallenges);
router.post("/", auth, createChallenge);
router.post("/join/:id", auth, joinChallenge);
router.post("/:id/complete", auth, completeChallenge);

module.exports = router;
