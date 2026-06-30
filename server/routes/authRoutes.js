const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const { uploadProfileImages } = require("../middleware/upload");

const {
  registerUser,
  loginUser,
  getProfile,
  getUserProfile,
  searchUsers,
  updateProfile,
  followUser,
  unfollowUser,
} = require("../controllers/authController");
const {
  validateRegister,
  validateLogin,
} = require("../validations/authValidation");

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, uploadProfileImages, updateProfile);
router.get("/users/search", protect, searchUsers);
router.get("/profile/:username", protect, getUserProfile);
router.put("/users/:id/follow", protect, followUser);
router.put("/users/:id/unfollow", protect, unfollowUser);

module.exports = router;
