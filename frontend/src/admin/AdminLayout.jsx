import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content area */}
      <div className="lg:ml-72">

        {/* Top navbar */}
        <AdminNavbar
          setSidebarOpen={setSidebarOpen}
        />

        {/* Admin page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;