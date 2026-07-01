import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({
  children,
  searchQuery = "",
  onSearchChange,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-h-screen flex-col lg:ml-60">
        <Navbar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 px-3 py-4 sm:px-5 lg:px-6 lg:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}