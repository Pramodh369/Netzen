const Message = require("../models/Message");
const User = require("../models/User");

const serializeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  username: user.username,
  profilePicture: user.profilePicture,
});

const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .populate("sender", "fullName username profilePicture")
      .populate("recipient", "fullName username profilePicture")
      .sort({ createdAt: -1 });

    const conversations = new Map();

    messages.forEach((message) => {
      const otherUser =
        message.sender._id.toString() === userId.toString()
          ? message.recipient
          : message.sender;
      const key = otherUser._id.toString();

      if (!conversations.has(key)) {
        conversations.set(key, {
          user: serializeUser(otherUser),
          lastMessage: {
            _id: message._id,
            text: message.text,
            sender: message.sender._id,
            recipient: message.recipient._id,
            createdAt: message.createdAt,
          },
        });
      }
    });

    return res.status(200).json(Array.from(conversations.values()));
  } catch (error) {
    console.error("getConversations error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const otherUserId = req.params.userId;

    const otherUser = await User.findById(otherUserId).select(
      "fullName username profilePicture"
    );

    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      user: serializeUser(otherUser),
      messages,
    });
  } catch (error) {
    console.error("getMessages error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getConversations,
  getMessages,
};
