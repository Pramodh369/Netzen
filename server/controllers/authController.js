const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const Post = require("../models/Post");
const generateToken = require("../utils/generateToken");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const fullName = req.body.fullName.trim();
    const username = req.body.username.trim().toLowerCase();
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use",
      });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({
        success: false,
        message: "Username is already taken",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("registerUser error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const email = req.body.email.toLowerCase().trim();
    const password = req.body.password;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        coverImage: user.coverImage,
        followers: user.followers,
        following: user.following,
      },
    });
  } catch (error) {
    console.error("loginUser error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    const posts = await Post.find({ author: req.user._id })
      .populate("author", "fullName username")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      user,
      posts,
    });
  } catch (error) {
    console.error("getProfile error:", error.message);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username.toLowerCase(),
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ author: user._id })
      .populate("author", "fullName username")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      user,
      posts,
      isFollowing: user.followers.some(
        (id) => id.toString() === req.user._id.toString()
      ),
    });
  } catch (error) {
    console.error("getUserProfile error:", error.message);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const searchUsers = async (req, res) => {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.status(200).json([]);
    }

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchRegex = new RegExp(escapedQuery, "i");

    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [
        { fullName: searchRegex },
        { username: searchRegex },
      ],
    })
      .select("_id fullName username profilePicture")
      .limit(8);

    return res.status(200).json(users);
  } catch (error) {
    console.error("searchUsers error:", error.message);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getFollowSuggestions = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).select("following");

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const users = await User.find({
      _id: {
        $ne: req.user._id,
        $nin: currentUser.following,
      },
    })
      .select("_id fullName username profilePicture")
      .sort({ createdAt: -1 })
      .limit(3);

    return res.status(200).json(users);
  } catch (error) {
    console.error("getFollowSuggestions error:", error.message);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getUserActivity = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "followers following createdAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.countDocuments({ author: req.user._id });

    return res.status(200).json({
      posts,
      followers: user.followers.length,
      following: user.following.length,
      memberSince: user.createdAt,
    });
  } catch (error) {
    console.error("getUserActivity error:", error.message);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (typeof req.body.bio === "string") {
      user.bio = req.body.bio.trim();
    }

    const avatar = req.files?.avatar?.[0];
    const coverImage = req.files?.coverImage?.[0];

    if (avatar) {
      const uploadResult = await uploadToCloudinary(
        avatar.buffer,
        "netzen/profiles/avatars"
      );
      user.profilePicture = uploadResult.secure_url;
    }

    if (coverImage) {
      const uploadResult = await uploadToCloudinary(
        coverImage.buffer,
        "netzen/profiles/covers"
      );
      user.coverImage = uploadResult.secure_url;
    }

    await user.save();

    const posts = await Post.find({ author: req.user._id })
      .populate("author", "fullName username")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        coverImage: user.coverImage,
        followers: user.followers,
        following: user.following,
      },
      posts,
    });
  } catch (error) {
    console.error("updateProfile error:", error.message);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const followUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyFollowing = userToFollow.followers.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (alreadyFollowing) {
      return res.status(400).json({ message: "Already following this user" });
    }

    userToFollow.followers.push(req.user._id);
    currentUser.following.push(userToFollow._id);

    await userToFollow.save();
    await currentUser.save();

    return res.status(200).json({
      targetUserId: userToFollow._id,
      followerCount: userToFollow.followers.length,
      followingCount: userToFollow.following.length,
      currentUserFollowingCount: currentUser.following.length,
      isFollowing: true,
    });
  } catch (error) {
    console.error("followUser error:", error.message);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const unfollowUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = userToUnfollow.followers.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!isFollowing) {
      return res.status(400).json({ message: "You are not following this user" });
    }

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollow._id.toString()
    );

    await userToUnfollow.save();
    await currentUser.save();

    return res.status(200).json({
      targetUserId: userToUnfollow._id,
      followerCount: userToUnfollow.followers.length,
      followingCount: userToUnfollow.following.length,
      currentUserFollowingCount: currentUser.following.length,
      isFollowing: false,
    });
  } catch (error) {
    console.error("unfollowUser error:", error.message);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  getUserProfile,
  searchUsers,
  getFollowSuggestions,
  getUserActivity,
  updateProfile,
  followUser,
  unfollowUser,
};
