const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");

const {
  createPost,
  getPosts,
  toggleLike,
} = require("../controllers/postController");

// We'll add authentication middleware in the next step
// const protect = require("../middleware/protect");
router.get("/", protect, getPosts);
router.post("/", protect, createPost);
router.put("/:id/like", protect, toggleLike);

module.exports = router;