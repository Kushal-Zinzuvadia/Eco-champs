const express = require("express");
const router = express.Router();
const { addLog, getLogsByUser, deleteLog } = require("../controllers/logsController");
const auth = require("../middlewares/auth");

// All log routes require authentication
router.post("/", auth, addLog);
router.get("/:userId", auth, getLogsByUser);
router.delete("/:id", auth, deleteLog);

module.exports = router;
