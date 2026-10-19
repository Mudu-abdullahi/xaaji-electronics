import { Link } from "react-router-dom";

function About() {
  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* =========================
          PAGE HEADER
      ========================== */}
      <section
        className="px-4 py-16 sm:px-6 md:py-20 lg:px-8"
        style={{
          backgroundColor: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-yellow-500">
            About Xaaji Electronics
          </p>

          <h1
            className="mt-3 text-4xl font-bold sm:text-5xl lg:text-6xl"
            style={{ color: "var(--foreground)" }}
          >
            Electrical Services Built Around Trust
          </h1>

          <p
            className="mx-auto mt-5 max-w-3xl text-base leading-7 sm:text-lg"
            style={{ color: "var(--muted)" }}
          >
            Xaaji Electronics is a modern electrical service platform designed
            to make it easier for customers to find reliable electricians,
            request electrical services, communicate with service providers,
            and get professional help when they need it.
          </p>
        </div>
      </section>

      {/* =========================
          WHO WE ARE
      ========================== */}
      <section className="px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          
          {/* Text */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-yellow-500">
              Who We Are
            </p>

            <h2
              className="mt-3 text-3xl font-bold sm:text-4xl"
              style={{ color: "var(--foreground)" }}
            >
              More Than Just Electrical Repairs
            </h2>

            <p
              className="mt-6 leading-7"
              style={{ color: "var(--muted)" }}
            >
              Xaaji Electronics is being built to provide practical,
              professional, and reliable electrical services for homes,
              businesses, shops, offices, and other customers.
            </p>

            <p
              className="mt-4 leading-7"
              style={{ color: "var(--muted)" }}
            >
              Our goal is to simplify the process of getting electrical help.
              Instead of struggling to find someone available, customers can
              use the platform to explain what they need, request a service,
              and connect with an electrician.
            </p>

            <p
              className="mt-4 leading-7"
              style={{ color: "var(--muted)" }}
            >
              As Xaaji Electronics grows, the platform can continue expanding
              with more electricians, more services, electrical products,
              customer accounts, service tracking, payments, reviews, and
              other useful features.
            </p>

            <Link
              to="/request-service"
              className="mt-7 inline-flex rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-gray-900 transition hover:bg-yellow-400"
            >
              Request a Service →
            </Link>
          </div>

          {/* Visual Card */}
          <div className="flex justify-center lg:justify-end">
            <div
              className="w-full max-w-lg rounded-3xl p-8 shadow-xl sm:p-10"
              style={{
                backgroundColor: "var(--surface-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-500 text-3xl">
                ⚡
              </div>

              <h3
                className="mt-8 text-2xl font-bold sm:text-3xl"
                style={{ color: "var(--foreground)" }}
              >
                Xaaji Electronics
              </h3>

              <p
                className="mt-4 leading-7"
                style={{ color: "var(--muted)" }}
              >
                Professional electrical solutions with a focus on quality
                work, customer communication, safety, convenience, and trust.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Professional electrical services",
                  "Easy service requests",
                  "Clear customer communication",
                  "Safety-focused electrical work",
                  "Reliable service providers",
                  "Building long-term customer trust",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-1 text-yellow-500">✓</span>

                    <p
                      className="leading-6"
                      style={{ color: "var(--muted)" }}
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          HOW XAaji ELECTRONICS WORKS
      ========================== */}
      <section
        className="px-4 py-16 sm:px-6 md:py-20 lg:px-8"
        style={{
          backgroundColor: "var(--surface-secondary)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-yellow-500">
              How It Works
            </p>

            <h2
              className="mt-3 text-3xl font-bold sm:text-4xl"
              style={{ color: "var(--foreground)" }}
            >
              Getting Electrical Help Made Simple
            </h2>

            <p
              className="mt-5 leading-7"
              style={{ color: "var(--muted)" }}
            >
              Xaaji Electronics is designed to make the entire service process
              simple, clear, and convenient for both customers and electricians.
            </p>
          </div>

          <div className="relative mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            
            {/* Step 1 */}
            <div
              className="relative rounded-2xl border p-7 text-center shadow-sm"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 text-xl font-bold text-gray-900">
                01
              </div>

              <h3
                className="mt-6 text-xl font-bold"
                style={{ color: "var(--foreground)" }}
              >
                Tell Us What You Need
              </h3>

              <p
                className="mt-4 leading-7"
                style={{ color: "var(--muted)" }}
              >
                Start by describing your electrical problem or the service you
                need. You can provide important details to help us understand
                the job.
              </p>
            </div>

            {/* Step 2 */}
            <div
              className="relative rounded-2xl border p-7 text-center shadow-sm"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 text-xl font-bold text-gray-900">
                02
              </div>

              <h3
                className="mt-6 text-xl font-bold"
                style={{ color: "var(--foreground)" }}
              >
                Submit Your Request
              </h3>

              <p
                className="mt-4 leading-7"
                style={{ color: "var(--muted)" }}
              >
                Send your service request through the platform. Your request
                can then be reviewed and organized for the appropriate service
                provider.
              </p>
            </div>

            {/* Step 3 */}
            <div
              className="relative rounded-2xl border p-7 text-center shadow-sm"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 text-xl font-bold text-gray-900">
                03
              </div>

              <h3
                className="mt-6 text-xl font-bold"
                style={{ color: "var(--foreground)" }}
              >
                Connect With an Electrician
              </h3>

              <p
                className="mt-4 leading-7"
                style={{ color: "var(--muted)" }}
              >
                Customers can connect with an available electrician who can
                understand the job and provide the required electrical
                assistance.
              </p>
            </div>

            {/* Step 4 */}
            <div
              className="relative rounded-2xl border p-7 text-center shadow-sm"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 text-xl font-bold text-gray-900">
                04
              </div>

              <h3
                className="mt-6 text-xl font-bold"
                style={{ color: "var(--foreground)" }}
              >
                Get the Job Done
              </h3>

              <p
                className="mt-4 leading-7"
                style={{ color: "var(--muted)" }}
              >
                The electrician works on the requested job while keeping the
                customer informed throughout the service process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          CUSTOMER EXPERIENCE
      ========================== */}
      <section className="px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            
            {/* Customers */}
            <div
              className="rounded-3xl border p-8 sm:p-10"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-100 text-2xl">
                👨‍💼
              </div>

              <h2
                className="mt-6 text-2xl font-bold sm:text-3xl"
                style={{ color: "var(--foreground)" }}
              >
                For Customers
              </h2>

              <p
                className="mt-4 leading-7"
                style={{ color: "var(--muted)" }}
              >
                We want customers to have a simple and convenient experience
                when they need electrical help.
              </p>

              <div className="mt-7 space-y-4">
                {[
                  "Find electrical services easily",
                  "Describe your electrical problem",
                  "Request a service online",
                  "Choose or connect with electricians",
                  "Communicate about the job",
                  "Track the service experience",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-sm font-bold text-gray-900">
                      ✓
                    </span>

                    <span
                      className="text-sm sm:text-base"
                      style={{ color: "var(--muted)" }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Electricians */}
            <div
              className="rounded-3xl border p-8 sm:p-10"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-100 text-2xl">
                👷
              </div>

              <h2
                className="mt-6 text-2xl font-bold sm:text-3xl"
                style={{ color: "var(--foreground)" }}
              >
                For Electricians
              </h2>

              <p
                className="mt-4 leading-7"
                style={{ color: "var(--muted)" }}
              >
                Xaaji Electronics is also designed to help electricians
                organize their work and connect with customers who need their
                services.
              </p>

              <div className="mt-7 space-y-4">
                {[
                  "Create a professional electrician profile",
                  "Show available electrical services",
                  "Receive customer service requests",
                  "Communicate with customers",
                  "Manage assigned jobs",
                  "Build customer trust and reputation",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-sm font-bold text-gray-900">
                      ✓
                    </span>

                    <span
                      className="text-sm sm:text-base"
                      style={{ color: "var(--muted)" }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================
          SERVICES WE SUPPORT
      ========================== */}
      <section
        className="px-4 py-16 sm:px-6 md:py-20 lg:px-8"
        style={{
          backgroundColor: "var(--surface-secondary)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-yellow-500">
              What We Can Help With
            </p>

            <h2
              className="mt-3 text-3xl font-bold sm:text-4xl"
              style={{ color: "var(--foreground)" }}
            >
              Electrical Services for Different Needs
            </h2>

            <p
              className="mt-5 leading-7"
              style={{ color: "var(--muted)" }}
            >
              The platform can support a wide range of electrical work for
              homes, businesses, shops, offices, and other customers.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            {[
              {
                icon: "💡",
                title: "Lighting Installation",
                text: "Installation, replacement, and troubleshooting of lighting systems.",
              },
              {
                icon: "🔌",
                title: "Sockets & Switches",
                text: "Installation and repair of sockets, switches, plugs, and related electrical fittings.",
              },
              {
                icon: "⚡",
                title: "Electrical Repairs",
                text: "Help with electrical faults, damaged connections, and other electrical problems.",
              },
              {
                icon: "🏠",
                title: "Home Electrical Work",
                text: "Electrical installation, maintenance, and repairs for residential properties.",
              },
              {
                icon: "🏢",
                title: "Business Electrical Work",
                text: "Electrical services for shops, offices, businesses, and other commercial spaces.",
              },
              {
                icon: "🛠️",
                title: "Maintenance",
                text: "Electrical inspection, maintenance, upgrades, and preventative work.",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="rounded-2xl border p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-100 text-2xl">
                  {service.icon}
                </div>

                <h3
                  className="mt-5 text-xl font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  {service.title}
                </h3>

                <p
                  className="mt-3 leading-7"
                  style={{ color: "var(--muted)" }}
                >
                  {service.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          MISSION & VISION
      ========================== */}
      <section className="px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            {/* Mission */}
            <div
              className="rounded-2xl border p-8 sm:p-10"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-100 text-2xl">
                🎯
              </div>

              <h2
                className="mt-6 text-2xl font-bold"
                style={{ color: "var(--foreground)" }}
              >
                Our Mission
              </h2>

              <p
                className="mt-4 leading-7"
                style={{ color: "var(--muted)" }}
              >
                To provide dependable electrical services while making the
                process of finding, requesting, communicating about, and
                managing electrical work easier for customers.
              </p>
            </div>

            {/* Vision */}
            <div
              className="rounded-2xl border p-8 sm:p-10"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-100 text-2xl">
                🚀
              </div>

              <h2
                className="mt-6 text-2xl font-bold"
                style={{ color: "var(--foreground)" }}
              >
                Our Vision
              </h2>

              <p
                className="mt-4 leading-7"
                style={{ color: "var(--muted)" }}
              >
                To grow from a trusted electrical service business into a
                technology-powered platform that helps communities find
                reliable local service providers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          CORE VALUES
      ========================== */}
      <section
        className="px-4 py-16 sm:px-6 md:py-20 lg:px-8"
        style={{
          backgroundColor: "var(--surface-secondary)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-yellow-500">
              What Matters To Us
            </p>

            <h2
              className="mt-3 text-3xl font-bold sm:text-4xl"
              style={{ color: "var(--foreground)" }}
            >
              Our Core Values
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Trust */}
            <div
              className="rounded-2xl border p-6 text-center shadow-sm"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-2xl">
                🤝
              </div>

              <h3
                className="mt-5 text-lg font-bold"
                style={{ color: "var(--foreground)" }}
              >
                Trust
              </h3>

              <p
                className="mt-3 text-sm leading-6"
                style={{ color: "var(--muted)" }}
              >
                Building honest and lasting relationships with customers.
              </p>
            </div>

            {/* Safety */}
            <div
              className="rounded-2xl border p-6 text-center shadow-sm"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-2xl">
                🛡️
              </div>

              <h3
                className="mt-5 text-lg font-bold"
                style={{ color: "var(--foreground)" }}
              >
                Safety
              </h3>

              <p
                className="mt-3 text-sm leading-6"
                style={{ color: "var(--muted)" }}
              >
                Treating electrical safety as an essential part of every job.
              </p>
            </div>

            {/* Quality */}
            <div
              className="rounded-2xl border p-6 text-center shadow-sm"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-2xl">
                ⭐
              </div>

              <h3
                className="mt-5 text-lg font-bold"
                style={{ color: "var(--foreground)" }}
              >
                Quality
              </h3>

              <p
                className="mt-3 text-sm leading-6"
                style={{ color: "var(--muted)" }}
              >
                Working toward reliable and professional results.
              </p>
            </div>

            {/* Communication */}
            <div
              className="rounded-2xl border p-6 text-center shadow-sm"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-2xl">
                💬
              </div>

              <h3
                className="mt-5 text-lg font-bold"
                style={{ color: "var(--foreground)" }}
              >
                Communication
              </h3>

              <p
                className="mt-3 text-sm leading-6"
                style={{ color: "var(--muted)" }}
              >
                Keeping customers informed throughout the service process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FUTURE OF XAaji ELECTRONICS
      ========================== */}
      <section className="px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-yellow-500">
            The Future
          </p>

          <h2
            className="mt-3 text-3xl font-bold sm:text-4xl"
            style={{ color: "var(--foreground)" }}
          >
            Building a Smarter Local Service Platform
          </h2>

          <p
            className="mx-auto mt-5 max-w-3xl leading-7"
            style={{ color: "var(--muted)" }}
          >
            Xaaji Electronics is not only about fixing electrical problems.
            The long-term goal is to build a platform where customers can
            discover services, connect with professionals, purchase electrical
            products, request jobs, communicate with providers, and manage
            their service experience from one place.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["👷", "More Electricians"],
              ["🛒", "Electrical Products"],
              ["📱", "Easy Service Requests"],
              ["📊", "Better Service Management"],
            ].map(([icon, title]) => (
              <div
                key={title}
                className="rounded-2xl border p-6"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="text-3xl">{icon}</div>

                <h3
                  className="mt-4 font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  {title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          CTA
      ========================== */}
      <section className="bg-yellow-500 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Need Electrical Help?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-800">
            Tell us what you need and start your electrical service request
            today.
          </p>

          <Link
            to="/request-service"
            className="mt-8 inline-flex rounded-lg bg-gray-900 px-7 py-3.5 font-semibold text-white transition hover:bg-gray-800"
          >
            Request a Service →
          </Link>
        </div>
      </section>
    </main>
  );
}

export default About;