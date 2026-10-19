import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api/electricians";

function Electricians() {
  const [electricians, setElectricians] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // GET ELECTRICIANS FROM BACKEND
  // =========================================================

  useEffect(() => {
    fetchElectricians();
  }, []);

  const fetchElectricians = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load electricians"
        );
      }

      if (result.success) {
        setElectricians(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch electricians:", error);
      setError("Unable to load electricians. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredElectricians = electricians.filter((electrician) => {
    const searchText = `
      ${electrician.name || ""}
      ${electrician.location || ""}
      ${electrician.specialization || ""}
      ${electrician.description || ""}
    `.toLowerCase();

    return searchText.includes(search.toLowerCase());
  });

  // =========================================================
  // UI
  // =========================================================

  return (
    <main
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-gray-900 px-4 py-16 text-white sm:py-20">
        {/* Decorative Glow */}
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl"></div>

        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-yellow-400">
            Find a Professional
          </p>

          <h1 className="text-3xl font-black sm:text-4xl lg:text-5xl">
            Find a Trusted Electrician
          </h1>

          <p className="mt-4 max-w-2xl text-gray-300">
            Browse professional electricians and find the right expert
            for your electrical project.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-2xl">
            <div className="relative">
              <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search by name, location or service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white px-5 py-4 pl-14 text-gray-900 outline-none transition-all placeholder:text-gray-500 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20"
              />
            </div>
          </div>

          {/* Search Result Count */}
          {!loading && !error && (
            <p className="mt-4 text-sm text-gray-400">
              {filteredElectricians.length} electrician
              {filteredElectricians.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>
      </section>

      {/* =====================================================
          ELECTRICIANS SECTION
      ====================================================== */}
      <section
        className="mx-auto max-w-7xl px-4 py-12 transition-colors duration-300 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "var(--background)",
        }}
      >
        {/* Section Header */}
        <div className="mb-8">
          <h2
            className="text-2xl font-black sm:text-3xl"
            style={{
              color: "var(--foreground)",
            }}
          >
            Available Electricians
          </h2>

          <p
            className="mt-2"
            style={{
              color: "var(--muted)",
            }}
          >
            Choose a professional based on their experience,
            location and services.
          </p>
        </div>

        {/* ===================================================
            LOADING
        =================================================== */}
        {loading && (
          <div
            className="rounded-2xl border p-10 text-center shadow-sm"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-yellow-500"></div>

            <p
              className="mt-4"
              style={{
                color: "var(--muted)",
              }}
            >
              Loading electricians...
            </p>
          </div>
        )}

        {/* ===================================================
            ERROR
        =================================================== */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
              ⚠️
            </div>

            <p className="mt-4 font-medium text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchElectricians}
              className="mt-5 rounded-lg bg-yellow-500 px-5 py-3 font-semibold text-gray-950 transition hover:bg-yellow-400"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ===================================================
            NO ELECTRICIANS
        =================================================== */}
        {!loading &&
          !error &&
          filteredElectricians.length === 0 && (
            <div
              className="rounded-2xl border p-10 text-center shadow-sm"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              {electricians.length === 0 ? (
                <>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-3xl">
                    ⚡
                  </div>

                  <h3
                    className="mt-5 text-xl font-bold"
                    style={{
                      color: "var(--foreground)",
                    }}
                  >
                    No Electricians Available
                  </h3>

                  <p
                    className="mt-2"
                    style={{
                      color: "var(--muted)",
                    }}
                  >
                    There are currently no electricians registered
                    with Xaaji Electronics.
                  </p>
                </>
              ) : (
                <>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
                    🔍
                  </div>

                  <h3
                    className="mt-5 text-xl font-bold"
                    style={{
                      color: "var(--foreground)",
                    }}
                  >
                    No Electricians Found
                  </h3>

                  <p
                    className="mt-2"
                    style={{
                      color: "var(--muted)",
                    }}
                  >
                    No electricians match "{search}".
                  </p>
                </>
              )}
            </div>
          )}

        {/* ===================================================
            ELECTRICIAN CARDS
        =================================================== */}
        {!loading &&
          !error &&
          filteredElectricians.length > 0 && (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {filteredElectricians.map((electrician) => (
                <div
                  key={electrician._id}
                  className="group overflow-hidden rounded-2xl border shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  {/* =================================================
                      LARGE PROFILE PHOTO
                  ================================================= */}
                  <div className="relative h-80 overflow-hidden sm:h-72 lg:h-80">
                    {electrician.profileImage ? (
                      <img
                        src={electrician.profileImage}
                        alt={electrician.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center"
                        style={{
                          backgroundColor: "var(--surface-secondary)",
                        }}
                      >
                        <div className="text-center">
                          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100 text-4xl font-bold text-yellow-600">
                            {electrician.name
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <p
                            className="mt-3 text-sm"
                            style={{
                              color: "var(--muted)",
                            }}
                          >
                            No profile photo
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Photo Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Availability */}
                    <div className="absolute right-4 top-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          electrician.available
                            ? "bg-green-500 text-white"
                            : "bg-gray-700 text-white"
                        }`}
                      >
                        {electrician.available
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </div>

                    {/* Name */}
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <h3 className="text-xl font-bold">
                        {electrician.name}
                      </h3>

                      <p className="mt-1 flex items-center gap-1 text-sm text-gray-200">
                        📍 {electrician.location}
                      </p>
                    </div>
                  </div>

                  {/* =================================================
                      CARD CONTENT
                  ================================================= */}
                  <div className="p-5">
                    {/* Specialization */}
                    <p className="font-semibold text-yellow-500">
                      {electrician.specialization}
                    </p>

                    {/* Experience / Availability */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div
                        className="rounded-xl p-3"
                        style={{
                          backgroundColor: "var(--surface-secondary)",
                        }}
                      >
                        <p
                          className="text-xs"
                          style={{
                            color: "var(--muted)",
                          }}
                        >
                          Experience
                        </p>

                        <p
                          className="mt-1 font-bold"
                          style={{
                            color: "var(--foreground)",
                          }}
                        >
                          {electrician.experience || 0} years
                        </p>
                      </div>

                      <div
                        className="rounded-xl p-3"
                        style={{
                          backgroundColor: "var(--surface-secondary)",
                        }}
                      >
                        <p
                          className="text-xs"
                          style={{
                            color: "var(--muted)",
                          }}
                        >
                          Status
                        </p>

                        <p
                          className={`mt-1 font-bold ${
                            electrician.available
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          {electrician.available
                            ? "Available"
                            : "Unavailable"}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    {electrician.description && (
                      <p
                        className="mt-4 line-clamp-3 text-sm leading-6"
                        style={{
                          color: "var(--muted)",
                        }}
                      >
                        {electrician.description}
                      </p>
                    )}

                    {/* Phone */}
                    {electrician.phone && (
                      <p
                        className="mt-4 text-sm font-medium"
                        style={{
                          color: "var(--foreground)",
                        }}
                      >
                        📞 {electrician.phone}
                      </p>
                    )}

                    {/* Email */}
                    {electrician.email && (
                      <p
                        className="mt-2 truncate text-sm"
                        style={{
                          color: "var(--muted)",
                        }}
                      >
                        ✉️ {electrician.email}
                      </p>
                    )}

                    {/* Buttons */}
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      {/* View Profile */}
                      <Link
                        to={`/electricians/${electrician._id}`}
                        className="rounded-lg border px-4 py-3 text-center text-sm font-semibold transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        style={{
                          borderColor: "var(--border)",
                          color: "var(--foreground)",
                          backgroundColor: "var(--surface)",
                        }}
                      >
                        View Profile
                      </Link>

                      {/* Request Service */}
                      <Link
                        to={
                          electrician.available
                            ? `/request-service?electrician=${electrician._id}`
                            : "#"
                        }
                        onClick={(e) => {
                          if (!electrician.available) {
                            e.preventDefault();
                          }
                        }}
                        className={`rounded-lg px-4 py-3 text-center text-sm font-semibold text-white transition-all duration-300 ${
                          electrician.available
                            ? "bg-yellow-500 hover:bg-yellow-400 hover:shadow-md"
                            : "cursor-not-allowed bg-gray-400"
                        }`}
                      >
                        Request Service
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </section>
    </main>
  );
}

export default Electricians;