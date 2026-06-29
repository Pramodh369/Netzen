const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

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

module.exports = { registerUser, loginUser };
