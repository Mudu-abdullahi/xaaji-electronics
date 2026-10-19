import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar({ darkMode, setDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b transition-colors duration-300"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        {/* ================================
            LOGO
        ================================= */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>

          <span
            className="text-lg font-bold transition-colors duration-300 sm:text-xl"
            style={{
              color: "var(--foreground)",
            }}
          >
            Xaaji Electronics
          </span>
        </Link>

        {/* ================================
            DESKTOP NAVIGATION
        ================================= */}
        <div className="hidden items-center gap-8 md:flex">

          <Link
            to="/"
            className="font-medium transition-colors duration-300 hover:text-yellow-500"
            style={{
              color: "var(--foreground)",
            }}
          >
            Home
          </Link>

          <Link
            to="/services"
            className="font-medium transition-colors duration-300 hover:text-yellow-500"
            style={{
              color: "var(--foreground)",
            }}
          >
            Services
          </Link>

          <Link
            to="/products"
            className="font-medium transition-colors duration-300 hover:text-yellow-500"
            style={{
              color: "var(--foreground)",
            }}
          >
            Products
          </Link>

          <Link
            to="/electricians"
            className="font-medium transition-colors duration-300 hover:text-yellow-500"
            style={{
              color: "var(--foreground)",
            }}
          >
            Electricians
          </Link>

          <Link
            to="/about"
            className="font-medium transition-colors duration-300 hover:text-yellow-500"
            style={{
              color: "var(--foreground)",
            }}
          >
            About
          </Link>

          <Link
            to="/contact"
            className="font-medium transition-colors duration-300 hover:text-yellow-500"
            style={{
              color: "var(--foreground)",
            }}
          >
            Contact
          </Link>

        </div>

        {/* ================================
            DESKTOP RIGHT SIDE
        ================================= */}
        <div className="hidden items-center gap-3 md:flex">

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full
              border
              text-lg
              transition-all duration-300
              hover:scale-105
            "
            style={{
              backgroundColor: "var(--surface-secondary)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
            aria-label={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            title={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* Request Service */}
          <Link
            to="/request-service"
            className="
              rounded-lg
              bg-yellow-500
              px-5 py-3
              font-semibold
              text-white
              transition-all duration-300
              hover:bg-yellow-600
              hover:shadow-lg
            "
          >
            Request Service
          </Link>

        </div>

        {/* ================================
            MOBILE CONTROLS
        ================================= */}
        <div className="flex items-center gap-2 md:hidden">

          {/* Mobile Dark Mode */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full
              border
              text-lg
              transition-all duration-300
              hover:scale-105
            "
            style={{
              backgroundColor: "var(--surface-secondary)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
            aria-label={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            title={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="
              rounded-lg
              p-2
              text-2xl
              transition-all duration-300
              hover:bg-gray-100
              dark:hover:bg-gray-800
            "
            style={{
              color: "var(--foreground)",
            }}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

      </div>

      {/* ================================
          MOBILE NAVIGATION
      ================================= */}
      {menuOpen && (
        <div
          className="border-t px-4 py-4 transition-colors duration-300 md:hidden"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex flex-col gap-4">

            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="font-medium transition-colors duration-300 hover:text-yellow-500"
              style={{
                color: "var(--foreground)",
              }}
            >
              Home
            </Link>

            <Link
              to="/services"
              onClick={() => setMenuOpen(false)}
              className="font-medium transition-colors duration-300 hover:text-yellow-500"
              style={{
                color: "var(--foreground)",
              }}
            >
              Services
            </Link>

            <Link
              to="/products"
              onClick={() => setMenuOpen(false)}
              className="font-medium transition-colors duration-300 hover:text-yellow-500"
              style={{
                color: "var(--foreground)",
              }}
            >
              Products
            </Link>

            <Link
              to="/electricians"
              onClick={() => setMenuOpen(false)}
              className="font-medium transition-colors duration-300 hover:text-yellow-500"
              style={{
                color: "var(--foreground)",
              }}
            >
              Electricians
            </Link>

            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="font-medium transition-colors duration-300 hover:text-yellow-500"
              style={{
                color: "var(--foreground)",
              }}
            >
              About
            </Link>

            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="font-medium transition-colors duration-300 hover:text-yellow-500"
              style={{
                color: "var(--foreground)",
              }}
            >
              Contact
            </Link>

            {/* Mobile Request Service */}
            <Link
              to="/request-service"
              onClick={() => setMenuOpen(false)}
              className="
                rounded-lg
                bg-yellow-500
                px-5 py-3
                text-center
                font-semibold
                text-white
                transition-all duration-300
                hover:bg-yellow-600
                hover:shadow-lg
              "
            >
              Request Service
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;