const Post = require("../models/Post");

// Create Post
const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    const post = await Post.create({
      author: req.user._id,
      content,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get All Posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "fullName username")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
// Like / Unlike Post
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  toggleLike,
};
