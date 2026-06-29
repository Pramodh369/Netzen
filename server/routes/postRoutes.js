const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");

const {
  createPost,
  getPosts,
  toggleLike,
  addComment,
  deletePost,
} = require("../controllers/postController");

router.get("/", protect, getPosts);
router.post("/", protect, createPost);
router.put("/:id/like", protect, toggleLike);
router.post("/:id/comment", protect, addComment);
router.delete("/:id", protect, deletePost);

module.exports = router;