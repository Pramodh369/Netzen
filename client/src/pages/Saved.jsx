import { Bookmark } from "lucide-react";
import DashboardLayout from "../components/dashboard/DashboardLayout";

export default function Saved() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Bookmark className="w-6 h-6" strokeWidth={2} />
          </div>
          <h1 className="text-xl font-black text-slate-800">Saved is coming soon</h1>
          <p className="mt-2 text-sm text-slate-500">
            A focused place for posts, threads, and resources you want to revisit.
          </p>
        </section>
      </div>
    </DashboardLayout>
  );
}
