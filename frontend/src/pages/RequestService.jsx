
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const API_URL = "https://xaaji-electronics-api.onrender.com/api/requests";
const SERVICES_API_URL = "https://xaaji-electronics-api.onrender.com/api/services";
const SETTINGS_API_URL = "https://xaaji-electronics-api.onrender.com/api/settings";

function RequestService() {
  const location = useLocation();
  const selectedService = location.state?.service || "";

  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState("");

  const [acceptingRequests, setAcceptingRequests] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState("");

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    service: selectedService,
    location: "",
    description: "",
    preferredDate: "",
    priority: "Normal",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Load active services from the backend
  useEffect(() => {
    const controller = new AbortController();

    async function fetchServices() {
      try {
        setServicesLoading(true);
        setServicesError("");

        const response = await fetch(SERVICES_API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load services.");
        }

        const result = await response.json();

        const serviceList = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.services)
              ? result.services
              : [];

        const activeServices = serviceList.filter(
          (service) => service.isActive === true
        );

        setServices(activeServices);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch services:", error);
          setServicesError(
            "Unable to load services. Please refresh the page and try again."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setServicesLoading(false);
        }
      }
    }

    fetchServices();

    return () => controller.abort();
  }, []);

  // Check whether the business is accepting service requests
  useEffect(() => {
    const controller = new AbortController();

    async function fetchAvailability() {
      try {
        setAvailabilityLoading(true);
        setAvailabilityError("");

        const response = await fetch(SETTINGS_API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to check service availability.");
        }

        const result = await response.json();
        const settings = result.settings;

        if (!settings || typeof settings.acceptingRequests !== "boolean") {
          throw new Error("Service availability information is unavailable.");
        }

        setAcceptingRequests(settings.acceptingRequests);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch service availability:", error);
          setAvailabilityError(
            "We could not check service availability right now. Please refresh the page and try again."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setAvailabilityLoading(false);
        }
      }
    }

    fetchAvailability();

    return () => controller.abort();
  }, []);

  // Keep the selected service synchronized with navigation state
  useEffect(() => {
    if (selectedService) {
      setFormData((previous) => ({
        ...previous,
        service: selectedService,
      }));
    }
  }, [selectedService]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  // Reset the form after successful submission
  const resetForm = () => {
    setFormData({
      customerName: "",
      phone: "",
      email: "",
      service: "",
      location: "",
      description: "",
      preferredDate: "",
      priority: "Normal",
    });
  };

  // Submit service request to the existing backend
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    if (availabilityLoading || availabilityError || !acceptingRequests) {
      setMessage(
        availabilityError ||
          "We are currently not accepting service requests. Please try again later."
      );
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit service request."
        );
      }

      setMessage(
        "Your service request has been submitted successfully. Our team will contact you shortly."
      );
      setMessageType("success");

      resetForm();
    } catch (error) {
      console.error("Submit request error:", error);

      setMessage(
        error.message ||
          "Failed to submit your request. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="font-semibold text-yellow-600">
            Xaaji Electronics
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Request a Service
          </h1>

          <p className="mt-3 text-gray-600">
            Tell us what electrical service you need and our team will
            get back to you.
          </p>
        </div>

        {/* Business availability notice */}
        {availabilityLoading && (
          <div
            className="mb-6 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600"
            role="status"
          >
            Checking service availability...
          </div>
        )}

        {!availabilityLoading && availabilityError && (
          <div
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {availabilityError}
          </div>
        )}

        {!availabilityLoading && !availabilityError && !acceptingRequests && (
          <div
            className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900"
            role="status"
          >
            <p className="font-semibold">Service requests are temporarily closed</p>
            <p className="mt-1">
              We are currently not accepting service requests. Please try again later.
            </p>
          </div>
        )}

        {/* Request form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-sm sm:p-8"
        >
          {/* Customer information */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Customer Information
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="customerName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>

                <input
                  id="customerName"
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-gray-700"
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
                  autoComplete="tel"
                  placeholder="e.g. 0712345678"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Location
                </label>

                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  autoComplete="street-address"
                  placeholder="e.g. Mombasa, Nyali"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                />
              </div>
            </div>
          </div>

          {/* Service information */}
          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-900">
              Service Information
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="service"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Service Required
                </label>

                {servicesLoading && (
                  <p className="mb-2 text-sm text-gray-500">
                    Loading available services...
                  </p>
                )}

                {servicesError && (
                  <p className="mb-2 text-sm text-red-600" role="alert">
                    {servicesError}
                  </p>
                )}

                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  disabled={servicesLoading || services.length === 0}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="">
                    {servicesLoading
                      ? "Loading services..."
                      : services.length === 0
                        ? "No active services available"
                        : "Select a service"}
                  </option>

                  {services.map((service) => (
                    <option
                      key={service._id || service.id || service.name}
                      value={service.name}
                    >
                      {service.name}
                    </option>
                  ))}

                  {/* Preserve a service selected from the previous page
                      if it is no longer in the active service list. */}
                  {formData.service &&
                    !services.some(
                      (service) => service.name === formData.service
                    ) && (
                      <option value={formData.service}>
                        {formData.service}
                      </option>
                    )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Describe Your Problem
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Describe the electrical problem or work you need..."
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="preferredDate"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Preferred Date
                  </label>

                  <input
                    id="preferredDate"
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={new Date().toLocaleDateString("en-CA")}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="priority"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Priority
                  </label>

                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback message */}
          {message && (
            <div
              role="status"
              className={`mt-6 rounded-lg px-4 py-3 text-sm font-medium ${
                messageType === "success"
                  ? "border border-green-200 bg-green-50 text-green-700"
                  : "border border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={
              loading ||
              servicesLoading ||
              services.length === 0 ||
              availabilityLoading ||
              Boolean(availabilityError) ||
              !acceptingRequests
            }
            className="mt-8 w-full rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-gray-950 transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Submitting Request..."
              : availabilityLoading
                ? "Checking Availability..."
                : !acceptingRequests
                  ? "Requests Currently Closed"
                  : "Submit Service Request"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default RequestService;
