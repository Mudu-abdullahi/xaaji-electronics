import adminFetch, { API_BASE_URL } from "../config/adminFetch";

import { useCallback, useEffect, useState } from "react";

const API_URL = `${API_BASE_URL}/api/services`;
const REQUESTS_URL = `${API_BASE_URL}/api/requests`;

const emptyForm = {
  name: "",
  description: "",
  category: "",
  price: "0",
  pricingType: "from",
  image: "",
  isActive: true,
};

const inputClass =
  "mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100";

function AdminServices() {
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch services and service requests from the backend
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [serviceResponse, requestResponse] = await Promise.all([
        adminFetch(API_URL),
        adminFetch(REQUESTS_URL),
      ]);

      const serviceResult = await serviceResponse.json();

      if (
        !serviceResponse.ok ||
        serviceResult.success === false
      ) {
        throw new Error(
          serviceResult.message || "Failed to load services."
        );
      }

      const serviceData =
        serviceResult.data ?? serviceResult.services ?? [];

      if (!Array.isArray(serviceData)) {
        throw new Error("Invalid services response from backend.");
      }

      setServices(serviceData);

      // Requests are optional for displaying the service table.
      if (requestResponse.ok) {
        const requestResult = await requestResponse.json();
        const requestData =
          requestResult.data ?? requestResult.requests ?? [];

        setRequests(Array.isArray(requestData) ? requestData : []);
      } else {
        setRequests([]);
      }
    } catch (err) {
      setError(
        err.message ||
          "Cannot connect to the backend. Check that your server is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Dynamic statistics
  const activeServices = services.filter(
    (service) => service.isActive
  ).length;

  const categories = new Set(
    services
      .map((service) => service.category?.trim().toLowerCase())
      .filter(Boolean)
  );

  const getRequestCount = (service) => {
    return requests.filter(
      (request) =>
        request.service?.trim().toLowerCase() ===
        service.name?.trim().toLowerCase()
    ).length;
  };

  const totalRequests = requests.length;

  // Price display
  const formatPrice = (service) => {
    if (service.pricingType === "quote") {
      return "Request a quote";
    }

    const price = Number(service.price || 0).toLocaleString("en-KE");
    const formatted = `KSh ${price}`;

    return service.pricingType === "from"
      ? `From ${formatted}`
      : formatted;
  };

  const getStatusStyle = (isActive) =>
    isActive
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-600";

  // Open form for creating a service
  const handleAdd = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setError("");
    setMessage("");
    setShowForm(true);
  };

  // Open form for editing an existing service
  const handleEdit = (service) => {
    setForm({
      name: service.name || "",
      description: service.description || "",
      category: service.category || "",
      price: String(service.price ?? 0),
      pricingType: service.pricingType || "quote",
      image: service.image || "",
      isActive: service.isActive ?? true,
    });

    setEditingId(service._id);
    setError("");
    setMessage("");
    setShowForm(true);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Create or update service in MongoDB
  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        ...form,
        price: Number(form.price),
      };

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await adminFetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Failed to save the service."
        );
      }

      setShowForm(false);
      setForm({ ...emptyForm });
      setEditingId(null);

      setMessage(
        editingId
          ? "Service updated successfully."
          : "Service added successfully."
      );

      await fetchData();
    } catch (err) {
      setError(err.message || "Unable to save service.");
    } finally {
      setSaving(false);
    }
  };

  // Activate or deactivate service
  const handleToggleStatus = async (service) => {
    setError("");
    setMessage("");

    try {
      const response = await adminFetch(`${API_URL}/${service._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !service.isActive,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Failed to update service status."
        );
      }

      setMessage("Service status updated successfully.");
      await fetchData();
    } catch (err) {
      setError(err.message || "Unable to update status.");
    }
  };

  // Delete service from MongoDB
  const handleDelete = async (service) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${service.name}"?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await adminFetch(`${API_URL}/${service._id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Failed to delete service."
        );
      }

      setMessage("Service deleted successfully.");
      await fetchData();
    } catch (err) {
      setError(err.message || "Unable to delete service.");
    }
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-yellow-600">
          Management
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Services
        </h1>

        <p className="mt-2 text-gray-600">
          Manage the electrical services offered by Xaaji Electronics.
        </p>
      </div>

      {/* Notifications */}
      {error && (
        <div
          role="alert"
          className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={fetchData}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {message && !error && (
        <div
          role="status"
          className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          {message}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Services"
          value={services.length}
          valueClass="text-gray-900"
        />

        <StatCard
          title="Active Services"
          value={activeServices}
          valueClass="text-green-600"
        />

        <StatCard
          title="Categories"
          value={categories.size}
          valueClass="text-blue-600"
        />

        <StatCard
          title="Total Requests"
          value={totalRequests}
          valueClass="text-yellow-600"
        />
      </div>

      {/* Services Table */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Available Services
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create and manage services available to customers.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchData}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Refresh
            </button>

            <button
              type="button"
              onClick={handleAdd}
              className="rounded-lg bg-yellow-500 px-5 py-3 font-semibold text-gray-900 transition hover:bg-yellow-600"
            >
              + Add Service
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="p-10 text-center">
            <div className="text-4xl">⚡</div>

            <h3 className="mt-3 font-semibold text-gray-900">
              No services found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Add your first electrical service to get started.
            </p>

            <button
              type="button"
              onClick={handleAdd}
              className="mt-5 rounded-lg bg-yellow-500 px-5 py-3 font-semibold text-gray-900 hover:bg-yellow-600"
            >
              + Add First Service
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Service",
                    "Category",
                    "Starting Price",
                    "Requests",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {services.map((service) => (
                  <tr
                    key={service._id}
                    className="transition hover:bg-gray-50"
                  >
                    {/* Service */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {service.image ? (
                          <img
                            src={service.image}
                            alt={service.name}
                            className="h-12 w-12 shrink-0 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-lg">
                            ⚡
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-gray-900">
                            {service.name}
                          </p>

                          <p className="mt-1 max-w-md text-sm text-gray-500">
                            {service.description}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            ID: {service._id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-5">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {service.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-5 text-sm font-medium text-gray-900">
                      {formatPrice(service)}
                    </td>

                    {/* Requests */}
                    <td className="px-6 py-5 text-sm text-gray-700">
                      {getRequestCount(service)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          service.isActive
                        )}`}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(service)}
                          className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(service)}
                          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                        >
                          {service.isActive ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(service)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Service Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-form-title"
            className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <div>
                <h2
                  id="service-form-title"
                  className="text-xl font-bold text-gray-900"
                >
                  {editingId ? "Edit Service" : "Add New Service"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter the details of the electrical service.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                aria-label="Close form"
                className="rounded-lg px-3 py-2 text-2xl text-gray-500 hover:bg-gray-100"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Service Name">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className={inputClass}
                    placeholder="Electrical Wiring"
                  />
                </FormField>

                <FormField label="Category">
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    maxLength={60}
                    className={inputClass}
                    placeholder="Wiring"
                  />
                </FormField>

                <FormField label="Price (KSh)">
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="1"
                    value={form.price}
                    onChange={handleChange}
                    required
                    disabled={form.pricingType === "quote"}
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Pricing Type">
                  <select
                    name="pricingType"
                    value={form.pricingType}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="fixed">Fixed price</option>
                    <option value="from">Starting from</option>
                    <option value="quote">Request a quote</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Description">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  maxLength={1000}
                  rows={3}
                  className={inputClass}
                  placeholder="Describe the electrical service..."
                />
              </FormField>

              <FormField label="Image URL (optional)">
                <input
                  name="image"
                  type="url"
                  value={form.image}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="https://example.com/service-image.jpg"
                />
              </FormField>

              <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <input
                  name="isActive"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 accent-yellow-500"
                />
                Make this service active and available to customers
              </label>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-yellow-500 px-5 py-3 font-semibold text-gray-900 hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}

function StatCard({ title, value, valueClass }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`mt-2 text-3xl font-bold ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

export default AdminServices;
