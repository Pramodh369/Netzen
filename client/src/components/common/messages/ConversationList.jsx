import { Search } from "lucide-react";

export default function ConversationList({
  conversations = [],
  users = [],
  selectedUser,
  onSelect,
  search,
  setSearch,
  onlineUsers = [],
}) {
  const renderUser = (user) => {
    const initials =
      user.fullName
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase() || "U";

    const online = onlineUsers.includes(user._id);

    return (
      <button
        key={user._id}
        onClick={() => onSelect(user)}
        className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 transition ${
          selectedUser?._id === user._id
            ? "bg-indigo-50 border border-indigo-200"
            : "hover:bg-slate-50"
        }`}
      >
        <div className="relative">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                className="w-full h-full object-cover"
                alt={user.fullName}
              />
            ) : (
              initials
            )}
          </div>

          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              online ? "bg-green-500" : "bg-slate-300"
            }`}
          />
        </div>

        <div className="flex-1 text-left overflow-hidden">
          <p className="font-semibold text-slate-800 truncate">
            {user.fullName}
          </p>
          <p className="text-xs text-slate-500 truncate">
            @{user.username}
          </p>
        </div>
      </button>
    );
  };

  return (
    <aside className="w-full md:w-80 border-r border-slate-200 bg-white flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search developers..."
            className="bg-transparent outline-none text-sm flex-1"
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-2">
        {search.trim() ? (
          users.length ? (
            users.map(renderUser)
          ) : (
            <p className="text-center text-sm text-slate-400 py-8">
              No users found
            </p>
          )
        ) : conversations.length ? (
          conversations.map((c) => renderUser(c.user))
        ) : (
          <p className="text-center text-sm text-slate-400 py-8">
            Start your first conversation
          </p>
        )}
      </div>
    </aside>
  );
}