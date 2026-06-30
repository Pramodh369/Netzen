import { useEffect, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import authService from "../services/authService";

export default function Explore() {
  const [query, setQuery] = useState("");
  const [suggested, setSuggested] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    authService
      .getFollowSuggestions()
      .then(setSuggested)
      .catch((error) => console.error("Failed to load suggestions:", error.message));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      authService
        .searchUsers(query)
        .then(setResults)
        .catch((error) => console.error("Failed to search users:", error.message));
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const visibleUsers = query.trim() ? results : suggested;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h1 className="text-xl font-black text-slate-800">Discover Developers</h1>
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <Search className="w-4 h-4 text-slate-400" strokeWidth={2} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or username"
              className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
            />
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-3">
            {query.trim() ? "Search results" : "Suggested developers"}
          </h2>
          <div className="space-y-2">
            {visibleUsers.map((user) => (
              <DeveloperRow key={user._id} user={user} />
            ))}
            {visibleUsers.length === 0 && (
              <p className="text-sm text-slate-500">No developers found.</p>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function DeveloperRow({ user }) {
  const initials =
    user.fullName
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U";

  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
        {user.profilePicture ? (
          <img src={user.profilePicture} alt={user.fullName} className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm font-bold text-white">{initials}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{user.fullName}</p>
        <p className="text-xs text-slate-400 truncate">@{user.username}</p>
      </div>
      <UserPlus className="w-4 h-4 text-indigo-500" strokeWidth={2} />
    </div>
  );
}
