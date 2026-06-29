const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const uploadPostImage = require("../middleware/upload");

const {
  createPost,
  getPosts,
  toggleLike,
  updatePost,
  addComment,
  deletePost,
} = require("../controllers/postController");

router.get("/", protect, getPosts);
router.post("/", protect, uploadPostImage, createPost);
router.put("/:id", protect, updatePost);
router.put("/:id/like", protect, toggleLike);
router.post("/:id/comment", protect, addComment);
router.delete("/:id", protect, deletePost);

module.exports = router;
