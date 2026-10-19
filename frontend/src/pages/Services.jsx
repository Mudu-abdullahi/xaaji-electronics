import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api/services";

// Fallback images used when a service has no image in MongoDB.
// You can replace these URLs with your own Cloudinary images.
const SERVICE_IMAGES = {
  installation:
    "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=900&q=80",
  repair:
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80",
  lighting:
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
  wiring:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
  maintenance:
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80",
  emergency:
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80",
  default:
    "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=900&q=80",
};

function getServiceImage(service) {
  if (service.image?.trim()) {
    return service.image;
  }

  const text = `${service.name || ""} ${service.category || ""}`.toLowerCase();

  if (text.includes("emergency")) return SERVICE_IMAGES.emergency;
  if (text.includes("light")) return SERVICE_IMAGES.lighting;
  if (text.includes("wire")) return SERVICE_IMAGES.wiring;
  if (text.includes("repair")) return SERVICE_IMAGES.repair;

  if (text.includes("maintenance") || text.includes("inspection")) {
    return SERVICE_IMAGES.maintenance;
  }

  if (text.includes("installation")) return SERVICE_IMAGES.installation;

  return SERVICE_IMAGES.default;
}

function formatPrice(service) {
  if (service.pricingType === "quote") {
    return "Request a quote";
  }

  const price = Number(service.price || 0);

  const formatted = `KSh ${price.toLocaleString("en-KE")}`;

  if (service.pricingType === "from") {
    return `From ${formatted}`;
  }

  return formatted;
}

function ServiceImage({ service }) {
  const [imageSrc, setImageSrc] = useState(() => getServiceImage(service));

  useEffect(() => {
    setImageSrc(getServiceImage(service));
  }, [service.image, service.name, service.category]);

  const fallbackImage = SERVICE_IMAGES.default;

  return (
    <div className="h-48 overflow-hidden bg-gray-100">
      <img
        src={imageSrc}
        alt={service.name || "Electrical service"}
        loading="lazy"
        className="h-full w-full object-cover transition duration-500 hover:scale-105"
        onError={() => {
          if (imageSrc !== fallbackImage) {
            setImageSrc(fallbackImage);
          }
        }}
      />
    </div>
  );
}

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchServices() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load services (${response.status}).`);
        }

        const result = await response.json();

        const serviceList = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.services)
              ? result.services
              : [];

        setServices(
          serviceList.filter((service) => service.isActive === true)
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch services:", err);
          setError(
            "We could not load our services right now. Please try again."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchServices();

    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* HERO HEADER */}
      <section className="relative overflow-hidden bg-gray-950 px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-900/95 to-gray-800/80" />

        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-400">
            Xaaji Electronics
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Our Electrical Services
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
            Professional electrical services for homes, businesses,
            shops, and other buildings.
          </p>

          <div className="mx-auto mt-6 flex items-center justify-center gap-2">
            <div className="h-1 w-10 rounded-full bg-yellow-400" />
            <div className="h-1 w-6 rounded-full bg-yellow-400" />
            <div className="h-2 w-2 rounded-full bg-yellow-400" />
            <div className="h-2 w-2 rounded-full bg-yellow-400" />
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">
              What We Offer
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
              Electrical Solutions You Can Trust
            </h2>

            <p className="mt-4 text-base leading-7 text-gray-600 sm:text-lg">
              From installations and repairs to maintenance and emergency
              services, we provide practical electrical solutions based
              on your needs.
            </p>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="grid grid-cols-1 gap-6 pt-10 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="animate-pulse overflow-hidden rounded-xl bg-white shadow-sm"
                >
                  <div className="h-48 bg-gray-200" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-2/3 rounded bg-gray-200" />
                    <div className="h-4 rounded bg-gray-200" />
                    <div className="h-4 w-4/5 rounded bg-gray-200" />
                    <div className="h-9 w-36 rounded-lg bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div
              className="mx-auto mt-10 max-w-xl rounded-xl border border-red-200 bg-white p-8 text-center"
              role="alert"
            >
              <h3 className="text-lg font-bold text-gray-900">
                Unable to load services
              </h3>

              <p className="mt-2 text-gray-600">{error}</p>

              <button
                onClick={() => window.location.reload()}
                className="mt-5 rounded-lg bg-gray-950 px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
              >
                Try Again
              </button>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && services.length === 0 && (
            <div className="py-16 text-center">
              <h3 className="text-xl font-bold text-gray-900">
                No services available right now
              </h3>
              <p className="mt-2 text-gray-600">
                Please check back later.
              </p>
            </div>
          )}

          {/* IMAGE SERVICE CARDS */}
          {!loading && !error && services.length > 0 && (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article
                  key={service._id || service.id || service.name}
                  className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <ServiceImage service={service} />

                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-lg font-extrabold leading-snug text-gray-950">
                      {service.name}
                    </h3>

                    <p className="mt-1 flex-1 text-sm leading-5 text-gray-600">
                      {service.description ||
                        "Professional electrical solutions tailored to your needs."}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-sm font-bold text-yellow-700">
                        {formatPrice(service)}
                      </span>

                      <Link
                        to="/request-service"
                        state={{ service: service.name }}
                        className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-bold text-gray-950 transition hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2"
                      >
                        Request Service
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="relative overflow-hidden bg-yellow-400 px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full border-[24px] border-yellow-300/60" />
        <div className="absolute -bottom-24 -right-10 h-64 w-64 rounded-full border-[28px] border-yellow-300/50" />

        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
            Need Electrical Help?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-gray-800 sm:text-lg">
            Tell us what electrical service you need and we can help
            you find the right solution.
          </p>

          <Link
            to="/request-service"
            className="mt-6 inline-flex items-center gap-3 rounded-lg bg-gray-950 px-6 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-lg"
          >
            Request a Service
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Services;