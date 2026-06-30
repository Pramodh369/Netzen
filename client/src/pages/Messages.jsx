import { MessageCircle, Radio } from "lucide-react";
import DashboardLayout from "../components/dashboard/DashboardLayout";

export default function Messages() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <MessageCircle className="w-6 h-6" strokeWidth={2} />
          </div>
          <h1 className="text-xl font-black text-slate-800">Messages are coming soon</h1>
          <p className="mt-2 text-sm text-slate-500">
            Real-time conversations with future Socket.io support are on the way.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">
            <Radio className="w-3.5 h-3.5 text-indigo-500" strokeWidth={2} />
            Socket.io ready roadmap
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
