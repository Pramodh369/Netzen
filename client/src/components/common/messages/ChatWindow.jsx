import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

export default function ChatWindow({
  selectedUser,
  messages,
  currentUserId,
  onlineUsers,
  loading,
  onSend,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>

          <h2 className="text-xl font-bold text-slate-700">
            Select a conversation
          </h2>

          <p className="mt-2 text-slate-500">
            Choose a developer from the left to start chatting.
          </p>
        </div>
      </div>
    );
  }

  const online = onlineUsers.includes(selectedUser._id);

  const initials =
    selectedUser.fullName
      ?.split(" ")
      .map((x) => x[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U";

  return (
    <div className="flex flex-1 flex-col bg-slate-50">

      {/* Header */}

      <div className="flex items-center gap-3 border-b bg-white px-6 py-4">

        <div className="relative">

          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white">

            {selectedUser.profilePicture ? (
              <img
                src={selectedUser.profilePicture}
                alt={selectedUser.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
              online ? "bg-green-500" : "bg-slate-300"
            }`}
          />
        </div>

        <div>

          <h2 className="font-bold text-slate-800">
            {selectedUser.fullName}
          </h2>

          <p className="text-xs text-slate-500">
            {online ? "Online" : "Offline"}
          </p>

        </div>

      </div>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto px-6 py-5">

        {loading ? (

          <div className="text-center text-slate-500">
            Loading...
          </div>

        ) : messages.length === 0 ? (

          <div className="flex h-full items-center justify-center">

            <div className="text-center">

              <div className="text-5xl mb-3">
                👋
              </div>

              <h3 className="font-bold text-slate-700">
                Say Hello
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                This is the beginning of your conversation.
              </p>

            </div>

          </div>

        ) : (

          messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              currentUserId={currentUserId}
            />
          ))

        )}

        <div ref={bottomRef} />

      </div>

      {/* Input */}

      <MessageInput onSend={onSend} />

    </div>
  );
}