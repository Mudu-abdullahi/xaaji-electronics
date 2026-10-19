import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // SUBMIT CONTACT FORM
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch(
        "https://xaaji-electronics-api.onrender.com/api/customers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to send message"
        );
      }

      setSuccess(
        "Your message has been sent successfully. We will contact you soon."
      );

      // Clear form
      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);

      setError(
        error.message ||
          "Failed to send your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen px-4 py-12 transition-colors duration-300 sm:px-6 lg:px-8"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div className="mx-auto max-w-6xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-10 text-center">
          <p className="font-semibold uppercase tracking-wider text-yellow-500">
            Xaaji Electronics
          </p>

          <h1
            className="mt-2 text-3xl font-black sm:text-4xl lg:text-5xl"
            style={{
              color: "var(--foreground)",
            }}
          >
            Contact Us
          </h1>

          <p
            className="mx-auto mt-4 max-w-2xl leading-7"
            style={{
              color: "var(--muted)",
            }}
          >
            Have a question or need electrical services?
            Send us a message and our team will get back to you.
          </p>

          {/* Yellow Line */}
          <div className="mx-auto mt-6 flex justify-center gap-2">
            <div className="h-1 w-14 rounded-full bg-yellow-400"></div>
            <div className="h-1 w-6 rounded-full bg-yellow-300"></div>
            <div className="h-1 w-2 rounded-full bg-yellow-200"></div>
          </div>
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* ===================================================
              CONTACT INFORMATION
          =================================================== */}

          <div className="space-y-6">

            {/* Get in Touch */}
            <div
              className="rounded-2xl border p-6 shadow-sm transition-colors duration-300"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-2xl">
                💬
              </div>

              <h2
                className="mt-5 text-xl font-bold"
                style={{
                  color: "var(--foreground)",
                }}
              >
                Get in Touch
              </h2>

              <p
                className="mt-3 text-sm leading-6"
                style={{
                  color: "var(--muted)",
                }}
              >
                Our team is ready to help you with electrical
                installation, repairs, maintenance and other
                electrical services.
              </p>
            </div>

            {/* Phone */}
            <div
              className="rounded-2xl border p-6 shadow-sm transition-colors duration-300"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-xl">
                📞
              </div>

              <p className="mt-5 text-sm font-semibold text-yellow-500">
                Phone
              </p>

              <p
                className="mt-2 font-medium"
                style={{
                  color: "var(--foreground)",
                }}
              >
                +254 797 319 558
              </p>
            </div>

            {/* Email */}
            <div
              className="rounded-2xl border p-6 shadow-sm transition-colors duration-300"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-xl">
                ✉️
              </div>

              <p className="mt-5 text-sm font-semibold text-yellow-500">
                Email
              </p>

              <p
                className="mt-2 break-words font-medium"
                style={{
                  color: "var(--foreground)",
                }}
              >
                info@xaajielectronics.com
              </p>
            </div>

            {/* Location */}
            <div
              className="rounded-2xl border p-6 shadow-sm transition-colors duration-300"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-xl">
                📍
              </div>

              <p className="mt-5 text-sm font-semibold text-yellow-500">
                Location
              </p>

              <p
                className="mt-2 font-medium"
                style={{
                  color: "var(--foreground)",
                }}
              >
                Wajir, Kenya
              </p>
            </div>

          </div>

          {/* ===================================================
              CONTACT FORM
          =================================================== */}

          <div className="lg:col-span-2">

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border p-6 shadow-sm transition-colors duration-300 sm:p-8"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >

              <h2
                className="text-2xl font-black"
                style={{
                  color: "var(--foreground)",
                }}
              >
                Send Us a Message
              </h2>

              <p
                className="mt-2 text-sm"
                style={{
                  color: "var(--muted)",
                }}
              >
                Fill in the form below and we will contact you.
              </p>

              {/* =================================================
                  SUCCESS MESSAGE
              ================================================== */}

              {success && (
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-sm font-medium text-green-700">
                  <span className="text-lg">✓</span>

                  <span>{success}</span>
                </div>
              )}

              {/* =================================================
                  ERROR MESSAGE
              ================================================== */}

              {error && (
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-700">
                  <span className="text-lg">⚠️</span>

                  <span>{error}</span>
                </div>
              )}

              {/* =================================================
                  FORM FIELDS
              ================================================== */}

              <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold"
                    style={{
                      color: "var(--foreground)",
                    }}
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border px-4 py-3 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/20"
                    style={{
                      backgroundColor: "var(--surface-secondary)",
                      color: "var(--foreground)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold"
                    style={{
                      color: "var(--foreground)",
                    }}
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 0712345678"
                    className="w-full rounded-xl border px-4 py-3 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/20"
                    style={{
                      backgroundColor: "var(--surface-secondary)",
                      color: "var(--foreground)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold"
                    style={{
                      color: "var(--foreground)",
                    }}
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border px-4 py-3 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/20"
                    style={{
                      backgroundColor: "var(--surface-secondary)",
                      color: "var(--foreground)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-semibold"
                    style={{
                      color: "var(--foreground)",
                    }}
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What do you need help with?"
                    className="w-full rounded-xl border px-4 py-3 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/20"
                    style={{
                      backgroundColor: "var(--surface-secondary)",
                      color: "var(--foreground)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>

                {/* Message */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold"
                    style={{
                      color: "var(--foreground)",
                    }}
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Write your message here..."
                    className="w-full resize-none rounded-xl border px-4 py-3 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/20"
                    style={{
                      backgroundColor: "var(--surface-secondary)",
                      color: "var(--foreground)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>

              </div>

              {/* =================================================
                  SUBMIT
              ================================================== */}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 px-6 py-3.5 font-bold text-gray-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-yellow-400 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-950/30 border-t-gray-950"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <span>→</span>
                  </>
                )}
              </button>

            </form>

          </div>

        </div>
      </div>
    </main>
  );
}

export default Contact;