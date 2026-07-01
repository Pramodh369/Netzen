import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import ConversationList from "../components/common/messages/ConversationList";
import ChatWindow from "../components/common/messages/ChatWindow";

import { useSocket } from "../context/SocketContext";

import authService from "../services/authService";
import messageService from "../services/messageService";

export default function Messages() {
  const { user } = useSelector((state) => state.auth);

  const { socket, onlineUsers } = useSocket();

  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([]);

  const [conversations, setConversations] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setUsers([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const data = await authService.searchUsers(search);
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const loadConversations = async () => {
    try {
      const data = await messageService.getConversations();
      setConversations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const openConversation = async (userData) => {
    try {
      setSelectedUser(userData);
      setLoading(true);

      const chat = await messageService.getMessages(userData._id);

      setMessages(chat.messages);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };
    useEffect(() => {
    if (!socket) return;

    const receiveMessage = (message) => {
      const senderId =
        typeof message.sender === "object"
          ? message.sender._id
          : message.sender;

      const recipientId =
        typeof message.recipient === "object"
          ? message.recipient._id
          : message.recipient;

      if (
        selectedUser &&
        (senderId === selectedUser._id ||
          recipientId === selectedUser._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }

      loadConversations();
    };

    socket.on("private-message", receiveMessage);

    return () => {
      socket.off("private-message", receiveMessage);
    };
  }, [socket, selectedUser]);

  const sendMessage = (text) => {
    if (!socket || !selectedUser) return;

    socket.emit(
      "private-message",
      {
        recipientId: selectedUser._id,
        text,
      },
      (response) => {
        if (!response?.ok) {
          console.error(response?.message);
        }
      }
    );
  };
    return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-120px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <ConversationList
          conversations={conversations}
          users={users}
          selectedUser={selectedUser}
          onSelect={openConversation}
          search={search}
          setSearch={setSearch}
          onlineUsers={onlineUsers}
        />

        <ChatWindow
          selectedUser={selectedUser}
          messages={messages}
          currentUserId={user?._id}
          onlineUsers={onlineUsers}
          loading={loading}
          onSend={sendMessage}
        />

      </div>
    </DashboardLayout>
  );
}