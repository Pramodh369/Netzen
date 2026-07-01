const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const Message = require("../models/Message");
const User = require("../models/User");

const connectedUsers = new Map();

const getOnlineUsers = () => Array.from(connectedUsers.keys());

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select(
        "_id fullName username profilePicture"
      );

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      return next();
    } catch {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();

    connectedUsers.set(userId, socket.id);
    socket.join(userId);
    io.emit("online-users", getOnlineUsers());

    socket.on("join", () => {
      socket.join(userId);
      socket.emit("online-users", getOnlineUsers());
    });

    socket.on("private-message", async (payload, callback) => {
      try {
        const recipientId = payload?.recipientId;
        const text = payload?.text?.trim();

        if (!recipientId || !text) {
          callback?.({ ok: false, message: "Message text is required" });
          return;
        }

        if (recipientId === userId) {
          callback?.({ ok: false, message: "Cannot message yourself" });
          return;
        }

        const recipient = await User.findById(recipientId).select("_id");

        if (!recipient) {
          callback?.({ ok: false, message: "Recipient not found" });
          return;
        }

        const message = await Message.create({
          sender: userId,
          recipient: recipientId,
          text,
        });

        const populatedMessage = await Message.findById(message._id)
          .populate("sender", "fullName username profilePicture")
          .populate("recipient", "fullName username profilePicture");

        io.to(userId).to(recipientId).emit("private-message", populatedMessage);
        callback?.({ ok: true, message: populatedMessage });
      } catch (error) {
        console.error("private-message error:", error.message);
        callback?.({ ok: false, message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      connectedUsers.delete(userId);
      io.emit("online-users", getOnlineUsers());
    });
  });

  return io;
};

module.exports = {
  initSocket,
  connectedUsers,
};
