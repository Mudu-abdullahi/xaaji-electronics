function AdminNavbar({ setSidebarOpen }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="rounded-lg p-2 text-2xl text-gray-700 hover:bg-gray-100 lg:hidden"
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Page title */}
      <div className="hidden lg:block">
        <h2 className="text-lg font-bold text-gray-900">
          Admin Dashboard
        </h2>

        <p className="text-sm text-gray-500">
          Manage Xaaji Electronics
        </p>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-4">

        {/* Notification */}
        <button
          className="relative rounded-lg p-2 text-xl hover:bg-gray-100"
          aria-label="Notifications"
        >
          🔔

          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Admin profile */}
        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">

          {/* Avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500 font-bold text-gray-900">
            A
          </div>

          {/* Admin information */}
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">
              Admin
            </p>

            <p className="text-xs text-gray-500">
              Administrator
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}

export default AdminNavbar;