const express = require("express");
const protect = require("../middleware/protect");
const {
  getConversations,
  getMessages,
} = require("../controllers/messageController");

const router = express.Router();

router.get("/conversations", protect, getConversations);
router.get("/:userId", protect, getMessages);

module.exports = router;
