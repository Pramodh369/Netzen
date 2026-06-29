import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      {/* Main area offset by sidebar width */}
      <div className="ml-60 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}