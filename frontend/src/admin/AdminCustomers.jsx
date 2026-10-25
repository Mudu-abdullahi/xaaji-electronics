import adminFetch, { API_BASE_URL } from "../config/adminFetch";
import { useEffect, useState } from "react";

const API_URL = `${API_BASE_URL}/api/customers`;

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Selected customer for viewing
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // =========================================================
  // FETCH CUSTOMERS
  // =========================================================

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminFetch(API_URL);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch customers"
        );
      }

      if (result.success) {
        setCustomers(result.data || []);
      }
    } catch (error) {
      console.error("Fetch customers error:", error);
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // =========================================================
  // UPDATE CUSTOMER STATUS
  // =========================================================

  const updateStatus = async (customer, status) => {
    try {
      setError("");

      const response = await adminFetch(
        `${API_URL}/${customer._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update customer"
        );
      }

      setCustomers((previous) =>
        previous.map((item) =>
          item._id === customer._id
            ? result.data
            : item
        )
      );

      // Also update the customer currently being viewed
      setSelectedCustomer((previous) =>
        previous && previous._id === customer._id
          ? result.data
          : previous
      );
    } catch (error) {
      console.error("Update customer error:", error);
      setError(error.message);
    }
  };

  // =========================================================
  // DELETE CUSTOMER
  // =========================================================

  const handleDelete = async (customer) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${customer.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await adminFetch(
        `${API_URL}/${customer._id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete customer"
        );
      }

      setCustomers((previous) =>
        previous.filter(
          (item) => item._id !== customer._id
        )
      );

      setSelectedCustomer(null);
    } catch (error) {
      console.error("Delete customer error:", error);
      setError(error.message);
    }
  };

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-700";

      case "Contacted":
        return "bg-yellow-100 text-yellow-700";

      case "Resolved":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================================================
  // STATISTICS
  // =========================================================

  const newCustomers = customers.filter(
    (customer) => customer.status === "New"
  ).length;

  const contactedCustomers = customers.filter(
    (customer) => customer.status === "Contacted"
  ).length;

  const resolvedCustomers = customers.filter(
    (customer) => customer.status === "Resolved"
  ).length;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Customers
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage customer messages and contact information
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          disabled={loading}
          className="rounded-lg bg-yellow-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>

      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Total */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Customers
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {customers.length}
          </p>
        </div>

        {/* New */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            New
          </p>

          <p className="mt-2 text-2xl font-bold text-blue-600">
            {newCustomers}
          </p>
        </div>

        {/* Contacted */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Contacted
          </p>

          <p className="mt-2 text-2xl font-bold text-yellow-600">
            {contactedCustomers}
          </p>
        </div>

        {/* Resolved */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Resolved
          </p>

          <p className="mt-2 text-2xl font-bold text-green-600">
            {resolvedCustomers}
          </p>
        </div>

      </div>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
          <p className="text-gray-500">
            Loading customers...
          </p>
        </div>
      )}

      {/* =====================================================
          EMPTY
      ===================================================== */}

      {!loading && customers.length === 0 && (
        <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
          <p className="text-gray-500">
            No customers found.
          </p>
        </div>
      )}

      {/* =====================================================
          CUSTOMER TABLE
      ===================================================== */}

      {!loading && customers.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="border-b border-gray-200 bg-gray-50">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Contact
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Subject
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {customers.map((customer) => (

                  <tr
                    key={customer._id}
                    className="transition hover:bg-gray-50"
                  >

                    {/* Customer */}
                    <td className="whitespace-nowrap px-6 py-5">

                      <p className="font-semibold text-gray-900">
                        {customer.name}
                      </p>

                    </td>

                    {/* Contact */}
                    <td className="px-6 py-5">

                      <p className="text-sm text-gray-700">
                        {customer.phone}
                      </p>

                      {customer.email && (
                        <p className="mt-1 text-sm text-gray-500">
                          {customer.email}
                        </p>
                      )}

                    </td>

                    {/* Subject */}
                    <td className="max-w-xs px-6 py-5">

                      <p className="truncate text-sm text-gray-700">
                        {customer.subject || "No subject"}
                      </p>

                    </td>

                    {/* Status */}
                    <td className="whitespace-nowrap px-6 py-5">

                      <select
                        value={customer.status}
                        onChange={(e) =>
                          updateStatus(
                            customer,
                            e.target.value
                          )
                        }
                        className={`rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none ${getStatusStyle(
                          customer.status
                        )}`}
                      >
                        <option value="New">
                          New
                        </option>

                        <option value="Contacted">
                          Contacted
                        </option>

                        <option value="Resolved">
                          Resolved
                        </option>
                      </select>

                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-500">

                      {new Date(
                        customer.createdAt
                      ).toLocaleDateString()}

                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap px-6 py-5 text-right">

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() =>
                            setSelectedCustomer(customer)
                          }
                          className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(customer)
                          }
                          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
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

        </div>
      )}

      {/* =====================================================
          CUSTOMER MESSAGE MODAL
      ===================================================== */}

      {selectedCustomer && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Customer Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Customer message and contact information
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedCustomer(null)
                }
                className="rounded-lg px-3 py-2 text-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                ×
              </button>

            </div>

            {/* Modal Content */}
            <div className="space-y-6 p-6">

              {/* Customer */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Customer
                </p>

                <p className="mt-1 text-lg font-bold text-gray-900">
                  {selectedCustomer.name}
                </p>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Phone
                  </p>

                  <p className="mt-1 text-sm text-gray-900">
                    {selectedCustomer.phone}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Email
                  </p>

                  <p className="mt-1 break-words text-sm text-gray-900">
                    {selectedCustomer.email ||
                      "Not provided"}
                  </p>
                </div>

              </div>

              {/* Subject */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Subject
                </p>

                <p className="mt-1 text-sm text-gray-900">
                  {selectedCustomer.subject ||
                    "No subject"}
                </p>
              </div>

              {/* Message */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Message
                </p>

                <div className="mt-2 rounded-lg bg-gray-50 p-4">

                  <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                    {selectedCustomer.message}
                  </p>

                </div>
              </div>

              {/* Status */}
              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </p>

                <select
                  value={selectedCustomer.status}
                  onChange={(e) =>
                    updateStatus(
                      selectedCustomer,
                      e.target.value
                    )
                  }
                  className={`mt-2 rounded-lg border-0 px-4 py-2 text-sm font-semibold outline-none ${getStatusStyle(
                    selectedCustomer.status
                  )}`}
                >
                  <option value="New">
                    New
                  </option>

                  <option value="Contacted">
                    Contacted
                  </option>

                  <option value="Resolved">
                    Resolved
                  </option>
                </select>

              </div>

              {/* Date */}
              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Received
                </p>

                <p className="mt-1 text-sm text-gray-700">
                  {new Date(
                    selectedCustomer.createdAt
                  ).toLocaleString()}
                </p>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-gray-200 px-6 py-4">

              <button
                onClick={() =>
                  setSelectedCustomer(null)
                }
                className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminCustomers;