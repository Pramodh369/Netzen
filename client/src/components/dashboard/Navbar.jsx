import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Search, Bell, MessageCircle, Sun } from "lucide-react";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    const timeoutId = setTimeout(async () => {
      try {
        const token = localStorage.getItem("netzen_token");
        const response = await axios.get("/api/auth/users/search", {
          params: { q: trimmedQuery },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setResults(response.data);
        setHasSearched(true);
        setShowDropdown(true);
      } catch (error) {
        console.error("User search failed:", error.message);
        setResults([]);
        setHasSearched(true);
        setShowDropdown(true);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserClick = (username) => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    setHasSearched(false);
    navigate(`/profile/${username}`);
  };

  const handleQueryChange = (e) => {
    const value = e.target.value;

    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      setShowDropdown(false);
      setHasSearched(false);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3">
      <div className="flex items-center gap-4">

        {/* Search */}
        <div ref={searchRef} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Netzen…"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => {
              if (query.trim() && hasSearched) {
                setShowDropdown(true);
              }
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />

          {showDropdown && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-lg shadow-slate-200/60 overflow-hidden z-50">
              {results.length > 0 ? (
                results.map((result) => {
                  const initials =
                    result.fullName
                      ?.split(" ")
                      .map((word) => word[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase() || "U";

                  return (
                    <button
                      key={result._id}
                      onClick={() => handleUserClick(result.username)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                        {result.profilePicture ? (
                          <img
                            src={result.profilePicture}
                            alt={result.fullName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-bold text-white uppercase">
                            {initials}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {result.fullName}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          @{result.username}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-sm text-slate-500">
                  No users found
                </div>
              )}
            </div>
          )}
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
