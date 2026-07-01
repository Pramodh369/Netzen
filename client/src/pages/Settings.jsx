import {
  Shield,
  KeyRound,
  Download,
  LogOut,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import { logoutUser } from "../features/auth/authSlice";

export default function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-slate-800">
            Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your account and application preferences.
          </p>
        </div>

        {/* Account */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-100 p-2">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>

              <div>
                <h2 className="font-bold text-slate-800">
                  Account
                </h2>

                <p className="text-sm text-slate-500">
                  Security and account management.
                </p>
              </div>
            </div>
          </div>

          <SettingButton
            icon={<KeyRound className="w-5 h-5" />}
            title="Change Password"
            subtitle="Update your account password."
            onClick={() => alert("Coming soon")}
          />

          <SettingButton
            icon={<Download className="w-5 h-5" />}
            title="Download My Data"
            subtitle="Export your account information."
            onClick={() => alert("Coming soon")}
          />

          <SettingButton
            icon={<LogOut className="w-5 h-5 text-red-500" />}
            title="Logout"
            subtitle="Sign out from your account."
            danger
            onClick={handleLogout}
          />
        </div>

        {/* Danger Zone */}

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

          <h2 className="font-bold text-red-600 text-lg">
            Danger Zone
          </h2>

          <p className="mt-2 text-sm text-red-500">
            Deleting your account is permanent and cannot be undone.
          </p>

          <button
            onClick={() => alert("Delete Account coming soon")}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>

        </div>

      </div>
    </DashboardLayout>
  );
}

function SettingButton({
  icon,
  title,
  subtitle,
  onClick,
  danger = false,
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between border-b border-slate-100 p-5 transition hover:bg-slate-50 last:border-none"
    >
      <div className="flex items-center gap-4">

        <div
          className={`rounded-xl p-3 ${
            danger
              ? "bg-red-100 text-red-500"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {icon}
        </div>

        <div className="text-left">
          <p
            className={`font-semibold ${
              danger ? "text-red-500" : "text-slate-800"
            }`}
          >
            {title}
          </p>

          <p className="text-sm text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-slate-400" />
    </button>
  );
}