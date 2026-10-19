import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/electricians";

function ElectricianProfile() {
  const { id } = useParams();

  const [electrician, setElectrician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchElectrician();
  }, [id]);

  const fetchElectrician = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load electrician"
        );
      }

      if (result.success) {
        setElectrician(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch electrician:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">
          Loading electrician...
        </p>
      </div>
    );
  }

  // Error
  if (error || !electrician) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Electrician Not Found
          </h1>

          <p className="mt-2 text-gray-600">
            {error || "This electrician does not exist."}
          </p>

          <Link
            to="/electricians"
            className="mt-6 inline-block rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-gray-900 hover:bg-yellow-600"
          >
            Back to Electricians
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero / Profile */}

      <section className="bg-gray-900 px-4 py-12 text-white">
        <div className="mx-auto max-w-6xl">

          <Link
            to="/electricians"
            className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-yellow-400"
          >
            ← Back to Electricians
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">

            {/* Large Photo */}

            <div className="overflow-hidden rounded-2xl shadow-2xl">
              {electrician.profileImage ? (
                <img
                  src={electrician.profileImage}
                  alt={electrician.name}
                  className="h-[420px] w-full object-cover sm:h-[500px]"
                />
              ) : (
                <div className="flex h-[420px] items-center justify-center bg-gray-200 sm:h-[500px]">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-yellow-100 text-5xl font-bold text-yellow-600">
                    {electrician.name
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>
                </div>
              )}
            </div>

            {/* Information */}

            <div>

              <div className="mb-4">
                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    electrician.available
                      ? "bg-green-500 text-white"
                      : "bg-gray-600 text-gray-200"
                  }`}
                >
                  {electrician.available
                    ? "Available"
                    : "Currently Unavailable"}
                </span>
              </div>

              <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                {electrician.name}
              </h1>

              <p className="mt-4 text-lg text-yellow-400">
                {electrician.specialization}
              </p>

              <div className="mt-6 space-y-4 text-gray-300">

                <p>
                  📍{" "}
                  <span className="font-medium text-white">
                    {electrician.location}
                  </span>
                </p>

                <p>
                  🛠️{" "}
                  <span className="font-medium text-white">
                    {electrician.experience || 0} years experience
                  </span>
                </p>

                <p>
                  📞{" "}
                  <span className="font-medium text-white">
                    {electrician.phone}
                  </span>
                </p>

                {electrician.email && (
                  <p>
                    📧{" "}
                    <span className="font-medium text-white">
                      {electrician.email}
                    </span>
                  </p>
                )}

              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <button
                  disabled={!electrician.available}
                  className={`rounded-lg px-6 py-3 font-semibold transition ${
                    electrician.available
                      ? "bg-yellow-500 text-gray-900 hover:bg-yellow-600"
                      : "cursor-not-allowed bg-gray-600 text-gray-400"
                  }`}
                >
                  Request Service
                </button>

                <a
                  href={`tel:${electrician.phone}`}
                  className="rounded-lg border border-gray-500 px-6 py-3 text-center font-semibold text-white transition hover:bg-gray-800"
                >
                  Call Electrician
                </a>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Description */}

      <section className="mx-auto max-w-6xl px-4 py-12">

        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">

          <h2 className="text-2xl font-bold text-gray-900">
            About This Electrician
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            {electrician.description ||
              "No description has been provided yet."}
          </p>

        </div>

      </section>

      {/* Services Information */}

      <section className="mx-auto max-w-6xl px-4 pb-16">

        <div className="grid gap-6 sm:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Specialization
            </p>

            <p className="mt-2 font-bold text-gray-900">
              {electrician.specialization}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Experience
            </p>

            <p className="mt-2 font-bold text-gray-900">
              {electrician.experience || 0} years
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Location
            </p>

            <p className="mt-2 font-bold text-gray-900">
              {electrician.location}
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default ElectricianProfile;