  import { NavLink, useNavigate } from "react-router-dom";
  import { useDispatch, useSelector } from "react-redux";
  import {
    Home,
    Search,
    User,
    Settings,
    LogOut,
    Zap,
    MessageCircle,
    X,
  } from "lucide-react";
  import { logoutUser } from "../../features/auth/authSlice";

  const navItems = [
    { icon: Home,          label: "Home",          to: "/dashboard" },
    { icon: Search,        label: "Explore",        to: "/explore" },
    { icon: MessageCircle, label: "Messages",        to: "/messages" },
    { icon: User,          label: "Profile",         to: "/profile" },
    { icon: Settings,      label: "Settings",        to: "/settings" },
  ];

  export default function Sidebar({ open = false, onClose }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = async () => {
      await dispatch(logoutUser());
      navigate("/login", { replace: true });
    };

    return (
      <>
        {open && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
          />
        )}
        <aside
          className={`fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-slate-100 bg-white shadow-sm transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-slate-100 ">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-indigo-200">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">
            net<span className="text-indigo-600">zen</span>
          </span>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="ml-auto rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative
                ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:rounded-full before:bg-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-300"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                }`
              }
            >
              <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User card */}
        <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group dark:hover:bg-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-xs font-bold text-white uppercase">
                {user?.fullName?.[0] ?? "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight dark:text-slate-100">
                {user?.fullName ?? "User"}
              </p>
              <p className="text-xs text-slate-400 truncate">@{user?.username ?? "username"}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
      </>
    );
  }
