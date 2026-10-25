import adminFetch, { API_BASE_URL } from "../config/adminFetch";
import { useEffect, useMemo, useState } from "react";

const API_URL = `${API_BASE_URL}/api/payments`;

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    customer: "",
    job: "",
    amount: "",
    method: "M-Pesa",
    date: new Date().toISOString().slice(0, 10),
    status: "Pending",
  });

  const [formError, setFormError] = useState("");

  const formatMoney = (amount) =>
    `KSh ${Number(amount || 0).toLocaleString("en-KE")}`;

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-KE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Load persisted payment records from the backend.
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setApiError("");

        const response = await adminFetch(API_URL);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch payments.");
        }

        setPayments(
          (data.payments || []).map((payment) => ({
            ...payment,
            id: payment.paymentId,
            mongoId: payment._id,
          }))
        );
      } catch (error) {
        setApiError(
          error.message ||
            "Could not connect to the payments server. Check that your backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const totalRevenue = payments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );

  const paidAmount = payments
    .filter((payment) => payment.status === "Paid")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  const pendingAmount = payments
    .filter((payment) => payment.status === "Pending")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  const filteredPayments = useMemo(() => {
    const term = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch = [
        payment.id || payment.paymentId || "",
        payment.customer || "",
        payment.job || "",
        payment.method || "",
      ].some((value) => String(value).toLowerCase().includes(term));

      const matchesMethod =
        methodFilter === "All" || payment.method === methodFilter;

      const matchesStatus =
        statusFilter === "All" || payment.status === statusFilter;

      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [payments, search, methodFilter, statusFilter]);

  const getStatusStyle = (status) => {
    if (status === "Paid") {
      return {
        backgroundColor: "rgba(22, 163, 74, 0.12)",
        color: "#16a34a",
      };
    }

    if (status === "Pending") {
      return {
        backgroundColor: "rgba(234, 179, 8, 0.15)",
        color: "#ca8a04",
      };
    }

    return {
      backgroundColor: "var(--surface-secondary)",
      color: "var(--muted)",
    };
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      customer: "",
      job: "",
      amount: "",
      method: "M-Pesa",
      date: new Date().toISOString().slice(0, 10),
      status: "Pending",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setApiError("");

    if (
      !form.customer.trim() ||
      !form.job.trim() ||
      form.amount === "" ||
      !Number.isFinite(Number(form.amount)) ||
      Number(form.amount) <= 0 ||
      !form.date
    ) {
      setFormError(
        "Complete all fields and enter an amount greater than zero."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await adminFetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: form.customer.trim(),
          job: form.job.trim(),
          amount: Number(form.amount),
          method: form.method,
          date: form.date,
          status: form.status,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to record payment.");
      }

      const savedPayment = {
        ...data.payment,
        id: data.payment.paymentId,
        mongoId: data.payment._id,
      };

      setPayments((previous) => [savedPayment, ...previous]);
      resetForm();
      setShowForm(false);
    } catch (error) {
      setFormError(error.message || "Could not save the payment.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (payment, nextStatus) => {
    if (!payment.mongoId) {
      setApiError("This payment has no database ID. Refresh the page and try again.");
      return;
    }

    try {
      setApiError("");

      const response = await adminFetch(
        `${API_URL}/${payment.mongoId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update payment status.");
      }

      setPayments((previous) =>
        previous.map((item) =>
          item.mongoId === payment.mongoId
            ? {
                ...data.payment,
                id: data.payment.paymentId,
                mongoId: data.payment._id,
              }
            : item
        )
      );
    } catch (error) {
      setApiError(error.message || "Could not update payment status.");
    }
  };

  const handleDelete = async (payment) => {
    if (!payment.mongoId) {
      setApiError("This payment has no database ID. Refresh the page and try again.");
      return;
    }

    const confirmed = window.confirm(
      `Delete payment ${payment.id} for ${payment.customer}? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setApiError("");

      const response = await adminFetch(`${API_URL}/${payment.mongoId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete payment.");
      }

      setPayments((previous) =>
        previous.filter((item) => item.mongoId !== payment.mongoId)
      );
    } catch (error) {
      setApiError(error.message || "Could not delete payment.");
    }
  };

  const inputStyle = {
    backgroundColor: "var(--surface)",
    color: "var(--foreground)",
    borderColor: "var(--border)",
  };

  const cardStyle = {
    backgroundColor: "var(--surface)",
    borderColor: "var(--border)",
  };

  const stats = [
    {
      label: "Total Transactions",
      value: payments.length.toLocaleString(),
      icon: "↔",
      color: "#6366f1",
    },
    {
      label: "Total Recorded",
      value: formatMoney(totalRevenue),
      icon: "◈",
      color: "#0d9488",
    },
    {
      label: "Payments Received",
      value: formatMoney(paidAmount),
      icon: "✓",
      color: "#16a34a",
    },
    {
      label: "Pending Payments",
      value: formatMoney(pendingAmount),
      icon: "◷",
      color: "#ca8a04",
    },
  ];

  return (
    <div
      className="min-h-screen space-y-7"
      style={{ color: "var(--foreground)" }}
    >
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-yellow-500">
            Financial Management
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Payments</h1>
          <p className="mt-2" style={{ color: "var(--muted)" }}>
            Manage transactions, monitor income, and follow up on unpaid bills.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm((previous) => !previous);
            setFormError("");
          }}
          className="rounded-xl bg-yellow-500 px-5 py-3 font-semibold text-gray-950 transition hover:bg-yellow-400"
        >
          {showForm ? "✕ Close Form" : "+ Record Payment"}
        </button>
      </div>

      {apiError && (
        <div
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700"
        >
          {apiError}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            style={cardStyle}
          >
            <div className="flex items-center justify-between gap-3">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--muted)" }}
              >
                {stat.label}
              </p>
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl text-xl font-bold"
                style={{
                  backgroundColor: `${stat.color}18`,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </span>
            </div>
            <p className="mt-4 break-words text-2xl font-bold sm:text-3xl">
              {stat.value}
            </p>
            <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
              Based on currently recorded transactions
            </p>
          </div>
        ))}
      </div>

      {/* Record payment form */}
      {showForm && (
        <section
          className="rounded-2xl border p-5 shadow-sm sm:p-7"
          style={cardStyle}
        >
          <h2 className="text-xl font-bold">Record a New Payment</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Enter the customer and transaction details below.
          </p>

          {formError && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700"
            >
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <label className="block text-sm font-medium">
                Customer Name
                <input
                  name="customer"
                  value={form.customer}
                  onChange={handleFormChange}
                  placeholder="e.g. Mohamed Ali"
                  className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-yellow-500"
                  style={inputStyle}
                  required
                />
              </label>

              <label className="block text-sm font-medium">
                Job ID
                <input
                  name="job"
                  value={form.job}
                  onChange={handleFormChange}
                  placeholder="e.g. JOB-005"
                  className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-yellow-500"
                  style={inputStyle}
                  required
                />
              </label>

              <label className="block text-sm font-medium">
                Amount (KSh)
                <input
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={handleFormChange}
                  placeholder="e.g. 8500"
                  className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-yellow-500"
                  style={inputStyle}
                  required
                />
              </label>

              <label className="block text-sm font-medium">
                Payment Method
                <select
                  name="method"
                  value={form.method}
                  onChange={handleFormChange}
                  className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-yellow-500"
                  style={inputStyle}
                >
                  <option value="M-Pesa">M-Pesa</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Card">Card</option>
                </select>
              </label>

              <label className="block text-sm font-medium">
                Payment Date
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleFormChange}
                  className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-yellow-500"
                  style={inputStyle}
                  required
                />
              </label>

              <label className="block text-sm font-medium">
                Payment Status
                <select
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                  className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-yellow-500"
                  style={inputStyle}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormError("");
                }}
                className="rounded-lg border px-5 py-3 font-semibold"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-gray-950 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Payment"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Transactions */}
      <section
        className="overflow-hidden rounded-2xl border shadow-sm"
        style={cardStyle}
      >
        <div
          className="border-b p-5 sm:p-6"
          style={{ borderColor: "var(--border)" }}
        >
          <h2 className="text-xl font-bold">Payment Transactions</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Search, filter, and review recorded payments.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--muted)" }}
              >
                ⌕
              </span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search payment, customer, job..."
                aria-label="Search payments"
                className="w-full rounded-lg border py-3 pl-9 pr-3 outline-none focus:border-yellow-500"
                style={inputStyle}
              />
            </div>

            <select
              value={methodFilter}
              onChange={(event) => setMethodFilter(event.target.value)}
              aria-label="Filter by payment method"
              className="rounded-lg border px-3 py-3 outline-none focus:border-yellow-500"
              style={inputStyle}
            >
              <option value="All">All Payment Methods</option>
              <option value="M-Pesa">M-Pesa</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Card">Card</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by payment status"
              className="rounded-lg border px-3 py-3 outline-none focus:border-yellow-500"
              style={inputStyle}
            >
              <option value="All">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="px-5 py-14 text-center" style={{ color: "var(--muted)" }}>
            Loading payments...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead
                  style={{
                    backgroundColor: "var(--surface-secondary)",
                    color: "var(--muted)",
                  }}
                >
                  <tr>
                    {[
                      "Payment",
                      "Customer",
                      "Job",
                      "Amount",
                      "Method",
                      "Status",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 text-xs font-semibold uppercase tracking-wider"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment.mongoId || payment.id}
                      className="transition hover:bg-yellow-500/5"
                      style={{ borderTop: "1px solid var(--border)" }}
                    >
                      <td className="px-5 py-5">
                        <p className="font-semibold">{payment.id}</p>
                        <p
                          className="mt-1 text-xs"
                          style={{ color: "var(--muted)" }}
                        >
                          {formatDate(payment.date)}
                        </p>
                      </td>

                      <td className="px-5 py-5 font-medium">
                        {payment.customer}
                      </td>

                      <td
                        className="px-5 py-5 text-sm"
                        style={{ color: "var(--muted)" }}
                      >
                        {payment.job}
                      </td>

                      <td className="px-5 py-5 font-bold">
                        {formatMoney(payment.amount)}
                      </td>

                      <td className="px-5 py-5 text-sm">{payment.method}</td>

                      <td className="px-5 py-5">
                        <span
                          className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                          style={getStatusStyle(payment.status)}
                        >
                          {payment.status}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(
                                payment,
                                payment.status === "Paid" ? "Pending" : "Paid"
                              )
                            }
                            className="rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-yellow-500/10"
                            style={{
                              borderColor: "var(--border)",
                              color: "var(--foreground)",
                            }}
                          >
                            Mark {payment.status === "Paid" ? "Pending" : "Paid"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(payment)}
                            className="rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
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

            {filteredPayments.length === 0 && (
              <div className="px-5 py-14 text-center">
                <div className="text-4xl">🔎</div>
                <h3 className="mt-4 text-lg font-bold">No payments found</h3>
                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                  {payments.length === 0
                    ? "No payments have been recorded yet."
                    : "Try changing your search or filters."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setMethodFilter("All");
                    setStatusFilter("All");
                  }}
                  className="mt-4 font-semibold text-yellow-600 hover:text-yellow-500"
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}

        <div
          className="flex flex-col gap-2 border-t px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between"
          style={{
            borderColor: "var(--border)",
            color: "var(--muted)",
          }}
        >
          <span>
            Showing {filteredPayments.length} of {payments.length} transactions
          </span>
          <span>
            Filtered total:{" "}
            <strong style={{ color: "var(--foreground)" }}>
              {formatMoney(
                filteredPayments.reduce(
                  (sum, payment) => sum + Number(payment.amount || 0),
                  0
                )
              )}
            </strong>
          </span>
        </div>
      </section>
    </div>
  );
}

export default AdminPayments;
