import { useState } from "react";
import { useSelector } from "react-redux";
import { Search, Bell, MessageCircle, Sun } from "lucide-react";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3">
      <div className="flex items-center gap-4">

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Netzen…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <NavIconBtn icon={Sun} label="Theme" />
          <NavIconBtn icon={MessageCircle} label="Messages" badge={3} />
          <NavIconBtn icon={Bell} label="Notifications" badge={7} />
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-100 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-sm ring-2 ring-white group-hover:ring-indigo-200 transition-all">
            <span className="text-xs font-bold text-white uppercase">
              {user?.fullName?.[0] ?? "U"}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.fullName ?? "User"}</p>
            <p className="text-xs text-slate-400">@{user?.username ?? "username"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavIconBtn({ icon: Icon, label, badge }) {
  return (
    <button
      aria-label={label}
      className="relative p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-150"
    >
      <Icon className="w-5 h-5" strokeWidth={1.75} />
      {badge > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center leading-none">
          {badge}
        </span>
      )}
    </button>
  );
}