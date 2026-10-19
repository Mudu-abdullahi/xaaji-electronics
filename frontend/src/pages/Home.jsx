import { Link } from "react-router-dom";

function Home() {
  const services = [
    {
      icon: "🔌",
      title: "Electrical Installation",
      description:
        "Professional electrical installation for homes, offices, shops, and other buildings.",
    },
    {
      icon: "🛠️",
      title: "Electrical Repairs",
      description:
        "Fast and reliable solutions for electrical faults, damaged wiring, and equipment.",
    },
    {
      icon: "💡",
      title: "Lighting Installation",
      description:
        "Modern indoor and outdoor lighting installation for homes and businesses.",
    },
    {
      icon: "⚡",
      title: "Electrical Wiring",
      description:
        "Safe and professional wiring services for new buildings and renovations.",
    },
    {
      icon: "🔍",
      title: "Maintenance & Inspection",
      description:
        "Electrical inspection and maintenance to keep your systems safe and reliable.",
    },
    {
      icon: "🚨",
      title: "Emergency Service",
      description:
        "Get help quickly when you experience urgent electrical problems.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Tell Us Your Problem",
      description:
        "Describe the electrical service you need and provide the necessary details.",
    },
    {
      number: "02",
      title: "Find an Electrician",
      description:
        "Browse professional electricians who can handle your electrical needs.",
    },
    {
      number: "03",
      title: "Request the Service",
      description:
        "Choose the service and send your request to get started.",
    },
    {
      number: "04",
      title: "Get the Job Done",
      description:
        "A professional electrician handles the job safely and efficiently.",
    },
  ];

  const features = [
    {
      icon: "👷",
      title: "Find Electricians",
      description:
        "Connect with electricians who can provide the service you need.",
    },
    {
      icon: "📋",
      title: "Easy Service Requests",
      description:
        "Request electrical services quickly through a simple process.",
    },
    {
      icon: "🛡️",
      title: "Trust & Safety",
      description:
        "We focus on professional service, safety, and customer satisfaction.",
    },
    {
      icon: "📱",
      title: "Simple Experience",
      description:
        "A clean and simple platform designed for customers and electricians.",
    },
  ];

  return (
    <main
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
{/* =========================================================
    HERO SECTION - NO VIDEO / NO IMAGE
========================================================= */}
<section
  className="relative overflow-hidden transition-colors duration-300"
  style={{
    backgroundColor: "var(--surface)",
  }}
>
  {/* Decorative Background Shapes */}
  <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl"></div>

  <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl"></div>

  <div className="relative z-10 mx-auto grid min-h-[680px] max-w-7xl grid-cols-1 items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
    
    {/* =====================================================
        LEFT CONTENT
    ====================================================== */}
    <div className="max-w-3xl">

      {/* Badge */}
      <div
        className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold"
        style={{
          backgroundColor: "var(--surface-secondary)",
          borderColor: "var(--border)",
          color: "var(--foreground)",
        }}
      >
        <span className="text-yellow-500">⚡</span>
        Professional Electrical Services
      </div>

      {/* Heading */}
      <h1
        className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
        style={{
          color: "var(--foreground)",
        }}
      >
        Reliable Electrical
        <span className="block text-yellow-500">
          Services
        </span>
        <span className="block">
          When You Need Them
        </span>
      </h1>

      {/* Yellow Line */}
      <div className="mt-7 flex items-center gap-2">
        <div className="h-1.5 w-20 rounded-full bg-yellow-400"></div>
        <div className="h-1.5 w-8 rounded-full bg-yellow-300"></div>
        <div className="h-1.5 w-3 rounded-full bg-yellow-200"></div>
      </div>

      {/* Description */}
      <p
        className="mt-7 max-w-2xl text-lg leading-8 sm:text-xl"
        style={{
          color: "var(--muted)",
        }}
      >
        Xaaji Electronics connects customers with professional
        electricians for reliable, safe, and convenient electrical
        services.
      </p>

      <p
        className="mt-4 max-w-xl leading-7"
        style={{
          color: "var(--muted)",
        }}
      >
        Find a service, find an electrician, request electrical work,
        and get the help you need from one simple platform.
      </p>

      {/* Buttons */}
      <div className="mt-9 flex flex-col gap-4 sm:flex-row">

        <Link
          to="/request-service"
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-7 py-4 font-bold text-gray-950 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-xl"
        >
          Request a Service
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>

        <Link
          to="/electricians"
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 px-7 py-4 font-bold transition-all duration-300 hover:-translate-y-1"
          style={{
            borderColor: "var(--border)",
            color: "var(--foreground)",
            backgroundColor: "var(--surface)",
          }}
        >
          Find an Electrician
          <span className="text-yellow-500">⚡</span>
        </Link>

      </div>

      {/* Trust Items */}
      <div className="mt-10 flex flex-wrap gap-3">

        <div
          className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: "var(--surface-secondary)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          <span className="text-yellow-500">⚡</span>
          Electrical
        </div>

        <div
          className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: "var(--surface-secondary)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          <span className="text-yellow-500">🛠️</span>
          Professional
        </div>

        <div
          className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: "var(--surface-secondary)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          <span className="text-yellow-500">🛡️</span>
          Safety First
        </div>

      </div>
    </div>

    {/* =====================================================
        RIGHT HERO CARD
    ====================================================== */}
    <div className="relative mx-auto w-full max-w-xl">

      {/* Decorative Circle */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-yellow-400/20 blur-2xl"></div>

      {/* Main Card */}
      <div
        className="relative overflow-hidden rounded-[2rem] border p-8 shadow-2xl transition-colors duration-300 sm:p-10"
        style={{
          backgroundColor: "var(--surface-secondary)",
          borderColor: "var(--border)",
        }}
      >

        {/* Yellow Top Bar */}
        <div className="absolute left-0 right-0 top-0 h-1.5 bg-yellow-400"></div>

        {/* Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 text-3xl shadow-lg">
          ⚡
        </div>

        {/* Title */}
        <h2
          className="mt-7 text-3xl font-black sm:text-4xl"
          style={{
            color: "var(--foreground)",
          }}
        >
          Everything Electrical
        </h2>

        <p
          className="mt-4 leading-7"
          style={{
            color: "var(--muted)",
          }}
        >
          Your trusted platform for finding electrical services,
          professional electricians, and reliable solutions.
        </p>

        {/* Features */}
        <div className="mt-8 space-y-4">

          <div
            className="flex items-center gap-4 rounded-xl border p-4"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400 font-black text-gray-950">
              ✓
            </div>

            <span
              className="font-semibold"
              style={{
                color: "var(--foreground)",
              }}
            >
              Find Electrical Services
            </span>
          </div>

          <div
            className="flex items-center gap-4 rounded-xl border p-4"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400 font-black text-gray-950">
              ✓
            </div>

            <span
              className="font-semibold"
              style={{
                color: "var(--foreground)",
              }}
            >
              Find Professional Electricians
            </span>
          </div>

          <div
            className="flex items-center gap-4 rounded-xl border p-4"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400 font-black text-gray-950">
              ✓
            </div>

            <span
              className="font-semibold"
              style={{
                color: "var(--foreground)",
              }}
            >
              Request Electrical Work
            </span>
          </div>

          <div
            className="flex items-center gap-4 rounded-xl border p-4"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400 font-black text-gray-950">
              ✓
            </div>

            <span
              className="font-semibold"
              style={{
                color: "var(--foreground)",
              }}
            >
              Manage Your Service Experience
            </span>
          </div>

        </div>

        {/* Bottom */}
        <div
          className="mt-7 flex items-center gap-3 border-t pt-6"
          style={{
            borderColor: "var(--border)",
          }}
        >
          <div className="flex -space-x-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-yellow-400 text-sm">
              ⚡
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-sm">
              👷
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-green-500 text-sm">
              🛡️
            </div>

          </div>

          <p
            className="text-sm font-medium"
            style={{
              color: "var(--muted)",
            }}
          >
            Professional service you can trust
          </p>
        </div>

      </div>
    </div>

  </div>
</section>

      {/* =========================================================
          SERVICES
      ========================================================== */}
      <section
        className="py-24 transition-colors duration-300"
        style={{
          backgroundColor: "var(--surface)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* SECTION HEADER */}
          <div className="mx-auto max-w-3xl text-center">
            <span className="font-bold uppercase tracking-wider text-yellow-500">
              Our Services
            </span>

            <h2
              className="mt-3 text-3xl font-black sm:text-4xl lg:text-5xl"
              style={{ color: "var(--foreground)" }}
            >
              Electrical Services You Can Request
            </h2>

            <p
              className="mt-5 text-lg leading-8"
              style={{ color: "var(--muted)" }}
            >
              From installations and repairs to maintenance and emergency
              support, Xaaji Electronics makes it easier to access electrical
              services.
            </p>
          </div>

          {/* SERVICES GRID */}
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="group rounded-2xl border p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                style={{
                  backgroundColor: "var(--surface-secondary)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-2xl transition-transform duration-300 group-hover:scale-110">
                  {service.icon}
                </div>

                <h3
                  className="mt-6 text-xl font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  {service.title}
                </h3>

                <p
                  className="mt-3 leading-7"
                  style={{ color: "var(--muted)" }}
                >
                  {service.description}
                </p>

                <Link
                  to="/services"
                  className="mt-5 inline-flex items-center gap-2 font-bold text-yellow-500 transition-all duration-300 hover:gap-3"
                >
                  Learn More
                  <span>→</span>
                </Link>
              </div>
            ))}
          </div>

          {/* BUTTON */}
          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-7 py-4 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-gray-800 hover:shadow-xl"
            >
              View All Services
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================== */}
      <section
        className="py-24 transition-colors duration-300"
        style={{
          backgroundColor: "var(--surface-secondary)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="font-bold uppercase tracking-wider text-yellow-500">
              How It Works
            </span>

            <h2
              className="mt-3 text-3xl font-black sm:text-4xl"
              style={{ color: "var(--foreground)" }}
            >
              Getting Electrical Help Is Simple
            </h2>

            <p
              className="mt-5 text-lg"
              style={{ color: "var(--muted)" }}
            >
              A simple four-step process helps you get the electrical service
              you need.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative rounded-2xl border p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400 text-lg font-black text-gray-950">
                  {step.number}
                </div>

                <h3
                  className="mt-6 text-xl font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  {step.title}
                </h3>

                <p
                  className="mt-3 leading-7"
                  style={{ color: "var(--muted)" }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/request-service"
              className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-7 py-4 font-bold text-gray-950 transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-xl"
            >
              Start a Service Request
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          ELECTRICIANS
      ========================================================== */}
      <section
        className="py-24 transition-colors duration-300"
        style={{
          backgroundColor: "var(--surface)",
        }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* LEFT */}
          <div>
            <span className="font-bold uppercase tracking-wider text-yellow-500">
              Professional Electricians
            </span>

            <h2
              className="mt-3 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl"
              style={{ color: "var(--foreground)" }}
            >
              Find the Right Professional for Your Job
            </h2>

            <p
              className="mt-6 text-lg leading-8"
              style={{ color: "var(--muted)" }}
            >
              Find electricians based on their skills and the type of
              electrical service you need.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Professional electrical workers",
                "Different electrical skills and services",
                "Easy electrician discovery",
                "Simple service request process",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                  style={{ color: "var(--foreground)" }}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400 text-sm font-black text-gray-950">
                    ✓
                  </span>

                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>

            <Link
              to="/electricians"
              className="mt-9 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-7 py-4 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-gray-800 hover:shadow-xl"
            >
              Browse Electricians
              <span>→</span>
            </Link>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-yellow-400/20 blur-2xl"></div>

            <div className="relative overflow-hidden rounded-3xl bg-gray-900 p-8 shadow-2xl sm:p-10">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-yellow-400/10 blur-3xl"></div>

              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 text-3xl">
                  👷
                </div>

                <h3 className="mt-7 text-3xl font-black text-white">
                  Professional Network
                </h3>

                <p className="mt-4 leading-7 text-gray-300">
                  Xaaji Electronics is designed to make it easier for
                  customers to connect with electrical professionals.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-gray-800 p-5">
                    <div className="text-3xl">👷</div>
                    <p className="mt-3 font-bold text-white">
                      Professionals
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-800 p-5">
                    <div className="text-3xl">📍</div>
                    <p className="mt-3 font-bold text-white">Location</p>
                  </div>

                  <div className="rounded-2xl bg-gray-800 p-5">
                    <div className="text-3xl">⭐</div>
                    <p className="mt-3 font-bold text-white">Reviews</p>
                  </div>

                  <div className="rounded-2xl bg-gray-800 p-5">
                    <div className="text-3xl">📋</div>
                    <p className="mt-3 font-bold text-white">Requests</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          WHY XAAJI ELECTRONICS
      ========================================================== */}
      <section
        className="py-24 transition-colors duration-300"
        style={{
          backgroundColor: "var(--surface-secondary)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="font-bold uppercase tracking-wider text-yellow-500">
              Why Xaaji Electronics
            </span>

            <h2
              className="mt-3 text-3xl font-black sm:text-4xl lg:text-5xl"
              style={{ color: "var(--foreground)" }}
            >
              Built Around Customers
            </h2>

            <p
              className="mt-5 text-lg leading-8"
              style={{ color: "var(--muted)" }}
            >
              We want to make electrical services easier to find, request,
              and manage.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-2xl">
                  {feature.icon}
                </div>

                <h3
                  className="mt-6 text-xl font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  {feature.title}
                </h3>

                <p
                  className="mt-3 leading-7"
                  style={{ color: "var(--muted)" }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          ABOUT SUMMARY
      ========================================================== */}
      <section
        className="py-24 transition-colors duration-300"
        style={{
          backgroundColor: "var(--surface)",
        }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* LEFT CARD */}
          <div className="relative overflow-hidden rounded-3xl bg-gray-900 p-8 shadow-2xl sm:p-12">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-yellow-400/10 blur-3xl"></div>

            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 text-3xl">
                ⚡
              </div>

              <h3 className="mt-8 text-3xl font-black text-white sm:text-4xl">
                More Than an Electrical Website
              </h3>

              <p className="mt-5 leading-8 text-gray-300">
                Xaaji Electronics is designed to become a complete platform
                for electrical services, electricians, customers, products,
                and service management.
              </p>

              <div className="mt-8 h-1 w-20 rounded-full bg-yellow-400"></div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <span className="font-bold uppercase tracking-wider text-yellow-500">
              About Us
            </span>

            <h2
              className="mt-3 text-3xl font-black sm:text-4xl"
              style={{ color: "var(--foreground)" }}
            >
              Making Electrical Services Easier
            </h2>

            <p
              className="mt-6 text-lg leading-8"
              style={{ color: "var(--muted)" }}
            >
              Xaaji Electronics aims to make it easier for people to access
              electrical services and connect with skilled professionals.
            </p>

            <p
              className="mt-4 leading-7"
              style={{ color: "var(--muted)" }}
            >
              From service requests to electrician discovery and electrical
              products, the platform is designed around convenience,
              professionalism, and safety.
            </p>

            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-7 py-4 font-bold text-gray-950 transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-xl"
            >
              Learn More About Us
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          EMERGENCY
      ========================================================== */}
      <section className="bg-gray-900 py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/15 text-4xl">
            🚨
          </div>

          <h2 className="mt-7 text-3xl font-black text-white sm:text-4xl">
            Need Emergency Electrical Help?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-300">
            Electrical emergencies can happen at any time. Request urgent
            electrical support when you need it.
          </p>

          <Link
            to="/request-service"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-7 py-4 font-bold text-gray-950 transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-xl"
          >
            Request Emergency Help
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* =========================================================
          CONTACT
      ========================================================== */}
      <section
        className="py-24 transition-colors duration-300"
        style={{
          backgroundColor: "var(--surface)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-yellow-400 px-6 py-14 text-center shadow-2xl sm:px-10 lg:px-16">
            {/* DECORATION */}
            <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-yellow-300/50 blur-3xl"></div>

            <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-yellow-500/40 blur-3xl"></div>

            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-950 text-2xl">
                💬
              </div>

              <h2 className="mt-7 text-3xl font-black text-gray-950 sm:text-4xl">
                Have Questions?
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-800">
                Need more information about our services or want to get in
                touch with us?
              </p>

              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  to="/contact"
                  className="rounded-xl bg-gray-950 px-7 py-4 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-gray-800 hover:shadow-xl"
                >
                  Contact Us
                </Link>

                <Link
                  to="/request-service"
                  className="rounded-xl border-2 border-gray-950 px-7 py-4 font-bold text-gray-950 transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-xl"
                >
                  Request Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;