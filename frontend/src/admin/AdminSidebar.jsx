import { NavLink } from "react-router-dom";

function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: "📊",
    },
    {
      name: "Service Requests",
      path: "/admin/requests",
      icon: "📋",
    },
    {
      name: "Electricians",
      path: "/admin/electricians",
      icon: "👷",
    },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: "👥",
    },
    {
      name: "Services",
      path: "/admin/services",
      icon: "⚡",
    },
    {
      name: "Jobs",
      path: "/admin/jobs",
      icon: "🛠️",
    },
    {
      name: "Reviews",
      path: "/admin/reviews",
      icon: "⭐",
    },
    {
      name: "Inventory",
      path: "/admin/inventory",
      icon: "📦",
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: "🛒",
    },
    {
      name: "Payments",
      path: "/admin/payments",
      icon: "💰",
    },
    {
      name: "Expenses",
      path: "/admin/expenses",
      icon: "💳",
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: "📈",
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: "⚙️",
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 transform bg-gray-900 text-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-gray-800 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500 text-xl">
              ⚡
            </div>

            <div>
              <h1 className="font-bold">
                Xaaji Electronics
              </h1>

              <p className="text-xs text-gray-400">
                Admin Panel
              </p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-xl text-gray-400 hover:text-white lg:hidden"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="h-[calc(100vh-5rem)] overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Management
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-yellow-500 text-gray-900"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                <span className="text-lg">
                  {item.icon}
                </span>

                <span>
                  {item.name}
                </span>
              </NavLink>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}

export default AdminSidebar;