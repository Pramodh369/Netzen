import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  User,
  X,
} from "lucide-react";
import { logoutUser } from "../../features/auth/authSlice";

export default function Navbar({
  searchQuery = "",
  onSearchChange,
  onMenuClick,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
 
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setShowProfile(false);
    navigate("/login", { replace: true });
  };

  const initials =
    user?.fullName
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/85 px-4 py-3 backdrop-blur-md transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/85 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <Menu className="h-5 w-5" strokeWidth={2} />
        </button>

        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(event) => onSearchChange?.(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-10 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onSearchChange?.("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1">
          
          <NavIconBtn
            icon={MessageCircle}
            label="Messages"
            onClick={() => navigate("/messages")}
          />
          <div ref={notificationsRef} className="relative">
            <NavIconBtn
              icon={Bell}
              label="Notifications"
              badge={0}
              onClick={() => setShowNotifications((value) => !value)}
            />
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-slate-100 bg-white p-4 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Notifications
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  No notifications yet.
                </p>
              </div>
            )}
          </div>
        </div>

        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setShowProfile((value) => !value)}
            className="flex cursor-pointer items-center gap-2.5 border-l border-slate-100 pl-3 transition dark:border-slate-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-sm ring-2 ring-white transition-all hover:ring-indigo-200 dark:ring-slate-900 dark:hover:ring-indigo-400/40">
              <span className="text-xs font-bold uppercase text-white">
                {initials}
              </span>
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold leading-tight text-slate-800 dark:text-slate-100">
                {user?.fullName ?? "User"}
              </p>
              <p className="text-xs text-slate-400">
                @{user?.username ?? "username"}
              </p>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
              <button
                type="button"
                onClick={() => {
                  setShowProfile(false);
                  navigate("/profile");
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <User className="h-4 w-4" strokeWidth={2} />
                View profile
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" strokeWidth={2} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function NavIconBtn({ icon: Icon, label, badge, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="relative cursor-pointer rounded-xl p-2 text-slate-500 transition-all duration-150 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-300"
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
      {badge > 0 && (
        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold leading-none text-white">
          {badge}
        </span>
      )}
    </button>
  );
}
