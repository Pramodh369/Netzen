import { format } from "date-fns";

export default function MessageBubble({ message, currentUserId }) {
  const isMine =
    (message.sender?._id || message.sender)?.toString() === currentUserId;

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
          isMine
            ? "bg-indigo-600 text-white rounded-br-md"
            : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
        }`}
      >
        <p className="text-sm break-words">{message.text}</p>

        <div
          className={`mt-1 text-[10px] ${
            isMine ? "text-indigo-200" : "text-slate-400"
          }`}
        >
          {format(new Date(message.createdAt), "hh:mm a")}
        </div>
      </div>
    </div>
  );
}