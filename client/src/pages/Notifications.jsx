import { Bell } from "lucide-react";
import DashboardLayout from "../components/dashboard/DashboardLayout";

export default function Notifications() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Bell className="w-5 h-5" strokeWidth={2} />
          </div>
          <p className="text-sm font-semibold text-slate-600">No notifications yet.</p>
        </section>
      </div>
    </DashboardLayout>
  );
}
