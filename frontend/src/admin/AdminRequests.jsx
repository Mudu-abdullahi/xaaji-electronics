import { useEffect, useState } from "react";

const REQUESTS_API = "https://xaaji-electronics-api.onrender.com/api/requests";
const ELECTRICIANS_API = "https://xaaji-electronics-api.onrender.com/api/electricians";

function AdminRequests() {
  // =========================================================
  // STATE
  // =========================================================

  const [requests, setRequests] = useState([]);
  const [electricians, setElectricians] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingElectricians, setLoadingElectricians] = useState(true);

  const [error, setError] = useState("");

  // Selected request for management
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Assignment form
  const [selectedElectrician, setSelectedElectrician] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [saving, setSaving] = useState(false);

  // =========================================================
  // FETCH REQUESTS
  // =========================================================

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(REQUESTS_API);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch requests"
        );
      }

      if (data.success) {
        setRequests(Array.isArray(data.data) ? data.data : []);
      } else {
        throw new Error(
          data.message || "Failed to fetch requests"
        );
      }
    } catch (error) {
      console.error("Fetch requests error:", error);

      setError(
        error.message || "Failed to load service requests."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH ELECTRICIANS
  // =========================================================

  const fetchElectricians = async () => {
    try {
      setLoadingElectricians(true);

      const response = await fetch(ELECTRICIANS_API);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch electricians"
        );
      }

      if (data.success) {
        setElectricians(
          Array.isArray(data.data) ? data.data : []
        );
      }
    } catch (error) {
      console.error(
        "Fetch electricians error:",
        error
      );
    } finally {
      setLoadingElectricians(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchRequests();
    fetchElectricians();
  }, []);

  // =========================================================
  // OPEN REQUEST MANAGEMENT
  // =========================================================

  const openRequest = (request) => {
    setSelectedRequest(request);

    setSelectedElectrician(
      request.assignedElectrician?._id || ""
    );

    setSelectedStatus(
      request.status || "New"
    );

    setError("");
  };

  // =========================================================
  // CLOSE REQUEST MANAGEMENT
  // =========================================================

  const closeRequest = () => {
    if (saving) {
      return;
    }

    setSelectedRequest(null);
    setSelectedElectrician("");
    setSelectedStatus("");
    setError("");
  };

  // =========================================================
  // SAVE REQUEST CHANGES
  // =========================================================

  const handleSaveChanges = async () => {
    if (!selectedRequest) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `${REQUESTS_API}/${selectedRequest._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assignedElectrician:
              selectedElectrician || null,

            status: selectedStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update service request"
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to update service request"
        );
      }

      // Update request in table
      setRequests((previous) =>
        previous.map((request) =>
          request._id === selectedRequest._id
            ? data.data
            : request
        )
      );

      // Update selected request
      setSelectedRequest(data.data);

      // Update selected values
      setSelectedElectrician(
        data.data.assignedElectrician?._id || ""
      );

      setSelectedStatus(
        data.data.status || "New"
      );

      alert(
        "Service request updated successfully."
      );
    } catch (error) {
      console.error(
        "Update request error:",
        error
      );

      setError(
        error.message ||
          "Failed to update service request."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-700";

      case "Inspection":
        return "bg-purple-100 text-purple-700";

      case "Quotation":
        return "bg-yellow-100 text-yellow-700";

      case "Approved":
        return "bg-green-100 text-green-700";

      case "Scheduled":
        return "bg-indigo-100 text-indigo-700";

      case "In Progress":
        return "bg-orange-100 text-orange-700";

      case "Completed":
        return "bg-green-100 text-green-700";

      case "Paid":
        return "bg-emerald-100 text-emerald-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================================================
  // PRIORITY STYLE
  // =========================================================

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "Emergency":
        return "bg-red-100 text-red-700";

      case "Urgent":
        return "bg-orange-100 text-orange-700";

      case "Normal":
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalRequests = requests.length;

  const newRequests = requests.filter(
    (request) => request.status === "New"
  ).length;

  const urgentRequests = requests.filter(
    (request) =>
      request.priority === "Urgent" ||
      request.priority === "Emergency"
  ).length;

  const assignedRequests = requests.filter(
    (request) => request.assignedElectrician
  ).length;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="relative">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Service Requests
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage customer requests and assign electricians
          </p>
        </div>

        <button
          onClick={() => {
            fetchRequests();
            fetchElectricians();
          }}
          disabled={loading}
          className="rounded-lg bg-yellow-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && !selectedRequest && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =====================================================
          SUMMARY
      ====================================================== */}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Requests
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {totalRequests}
          </p>
        </div>

        {/* New */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            New Requests
          </p>

          <p className="mt-2 text-2xl font-bold text-blue-600">
            {newRequests}
          </p>
        </div>

        {/* Urgent */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Urgent Requests
          </p>

          <p className="mt-2 text-2xl font-bold text-orange-600">
            {urgentRequests}
          </p>
        </div>

        {/* Assigned */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Assigned Requests
          </p>

          <p className="mt-2 text-2xl font-bold text-indigo-600">
            {assignedRequests}
          </p>
        </div>
      </div>

      {/* =====================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
          <p className="text-gray-500">
            Loading service requests...
          </p>
        </div>
      )}

      {/* =====================================================
          EMPTY
      ====================================================== */}

      {!loading &&
        !error &&
        requests.length === 0 && (
          <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">
              No service requests found.
            </p>
          </div>
        )}

      {/* =====================================================
          REQUEST TABLE
      ====================================================== */}

      {!loading &&
        !error &&
        requests.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Service
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Location
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Priority
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Electrician
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {requests.map((request) => (
                    <tr
                      key={request._id}
                      className="transition hover:bg-gray-50"
                    >
                      {/* Customer */}
                      <td className="whitespace-nowrap px-6 py-5">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {request.customerName}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {request.phone}
                          </p>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-700">
                        {request.service}
                      </td>

                      {/* Location */}
                      <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-700">
                        {request.location}
                      </td>

                      {/* Priority */}
                      <td className="whitespace-nowrap px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                            request.priority
                          )}`}
                        >
                          {request.priority}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </td>

                      {/* Electrician */}
                      <td className="whitespace-nowrap px-6 py-5">
                        {request.assignedElectrician ? (
                          <div>
                            <p className="font-semibold text-gray-900">
                              {
                                request
                                  .assignedElectrician
                                  .name
                              }
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {
                                request
                                  .assignedElectrician
                                  .specialization
                              }
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            Not assigned
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="whitespace-nowrap px-6 py-5">
                        <button
                          onClick={() =>
                            openRequest(request)
                          }
                          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* =====================================================
          MANAGE REQUEST MODAL
      ====================================================== */}

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Manage Service Request
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Assign an electrician and update the request
                  status.
                </p>
              </div>

              <button
                onClick={closeRequest}
                disabled={saving}
                className="rounded-lg px-3 py-2 text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-6 px-6 py-6">
              {/* Customer */}
              <div className="rounded-xl bg-gray-50 p-5">
                <h3 className="font-bold text-gray-900">
                  Customer Information
                </h3>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-400">
                      Name
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {selectedRequest.customerName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase text-gray-400">
                      Phone
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {selectedRequest.phone}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase text-gray-400">
                      Email
                    </p>

                    <p className="mt-1 text-gray-700">
                      {selectedRequest.email ||
                        "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase text-gray-400">
                      Location
                    </p>

                    <p className="mt-1 text-gray-700">
                      {selectedRequest.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Service */}
              <div>
                <h3 className="font-bold text-gray-900">
                  Service Information
                </h3>

                <div className="mt-4 rounded-xl border border-gray-200 p-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium uppercase text-gray-400">
                        Service
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {selectedRequest.service}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase text-gray-400">
                        Priority
                      </p>

                      <span
                        className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                          selectedRequest.priority
                        )}`}
                      >
                        {selectedRequest.priority}
                      </span>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-xs font-medium uppercase text-gray-400">
                        Description
                      </p>

                      <p className="mt-1 text-sm leading-6 text-gray-700">
                        {selectedRequest.description}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase text-gray-400">
                        Preferred Date
                      </p>

                      <p className="mt-1 text-sm text-gray-700">
                        {selectedRequest.preferredDate
                          ? new Date(
                              selectedRequest.preferredDate
                            ).toLocaleDateString()
                          : "Not specified"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase text-gray-400">
                        Created
                      </p>

                      <p className="mt-1 text-sm text-gray-700">
                        {new Date(
                          selectedRequest.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error inside modal */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Assignment */}
              <div>
                <h3 className="font-bold text-gray-900">
                  Assignment
                </h3>

                <div className="mt-4 space-y-5">
                  {/* Electrician */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Assign Electrician
                    </label>

                    <select
                      value={selectedElectrician}
                      onChange={(e) =>
                        setSelectedElectrician(
                          e.target.value
                        )
                      }
                      disabled={
                        saving ||
                        loadingElectricians
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 disabled:bg-gray-100"
                    >
                      <option value="">
                        {loadingElectricians
                          ? "Loading electricians..."
                          : "Select an electrician"}
                      </option>

                      {electricians
                        .filter(
                          (electrician) =>
                            electrician.available ||
                            electrician._id ===
                              selectedRequest
                                .assignedElectrician?._id
                        )
                        .map((electrician) => (
                          <option
                            key={electrician._id}
                            value={electrician._id}
                          >
                            {electrician.name} —{" "}
                            {
                              electrician
                                .specialization
                            }
                            {electrician.available
                              ? ""
                              : " — Unavailable"}
                          </option>
                        ))}
                    </select>

                    <p className="mt-2 text-xs text-gray-500">
                      Only available electricians are shown.
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Request Status
                    </label>

                    <select
                      value={selectedStatus}
                      onChange={(e) =>
                        setSelectedStatus(
                          e.target.value
                        )
                      }
                      disabled={saving}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 disabled:bg-gray-100"
                    >
                      <option value="New">
                        New
                      </option>

                      <option value="Inspection">
                        Inspection
                      </option>

                      <option value="Quotation">
                        Quotation
                      </option>

                      <option value="Approved">
                        Approved
                      </option>

                      <option value="Scheduled">
                        Scheduled
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Completed">
                        Completed
                      </option>

                      <option value="Paid">
                        Paid
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Current Assignment */}
              {selectedRequest.assignedElectrician && (
                <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                    Currently Assigned
                  </p>

                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                    {selectedRequest.assignedElectrician
                      .profileImage && (
                      <img
                        src={
                          selectedRequest
                            .assignedElectrician
                            .profileImage
                        }
                        alt={
                          selectedRequest
                            .assignedElectrician
                            .name
                        }
                        className="h-14 w-14 rounded-full object-cover"
                      />
                    )}

                    <div>
                      <p className="font-bold text-gray-900">
                        {
                          selectedRequest
                            .assignedElectrician
                            .name
                        }
                      </p>

                      <p className="text-sm text-gray-600">
                        {
                          selectedRequest
                            .assignedElectrician
                            .phone
                        }
                      </p>

                      <p className="text-sm text-gray-600">
                        {
                          selectedRequest
                            .assignedElectrician
                            .specialization
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-6 py-5 sm:flex-row sm:justify-end">
              <button
                onClick={closeRequest}
                disabled={saving}
                className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveChanges}
                disabled={saving}
                className="rounded-lg bg-yellow-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRequests;