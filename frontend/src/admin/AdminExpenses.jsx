import adminFetch, { API_BASE_URL } from "../config/adminFetch";
import { useCallback, useEffect, useMemo, useState } from "react";

const API_URL = `${API_BASE_URL}/api/expenses`;

const CATEGORIES = [
  "Materials", "Transport", "Tools", "Rent", "Communication",
  "Utilities", "Salaries", "Other",
];

const INITIAL_FORM = {
  description: "",
  category: "Materials",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
  status: "Paid",
  notes: "",
};

function formatCurrency(amount) {
  return `KSh ${Number(amount || 0).toLocaleString("en-KE", {
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date) {
  if (!date) return "—";
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-KE", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function getStatusStyle(status) {
  if (status === "Paid") return "bg-green-100 text-green-700";
  if (status === "Pending") return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-700";
}

function AdminExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminFetch(API_URL);
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not load expenses.");
      }
      setExpenses(Array.isArray(data.expenses) ? data.expenses : []);
    } catch (err) {
      setError(
        `${err.message || "Could not connect to the server."} Check that the backend is running on port 5000.`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const filteredExpenses = useMemo(() => {
    const term = search.trim().toLowerCase();
    return expenses.filter((expense) => {
      const matchesSearch =
        !term ||
        [expense.expenseId, expense.description, expense.category, expense.notes]
          .some((value) => String(value || "").toLowerCase().includes(term));
      return (
        matchesSearch &&
        (categoryFilter === "All" || expense.category === categoryFilter) &&
        (statusFilter === "All" || expense.status === statusFilter)
      );
    });
  }, [expenses, search, categoryFilter, statusFilter]);

  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const materialsTotal = expenses
    .filter((item) => item.category === "Materials")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const toolsTotal = expenses
    .filter((item) => item.category === "Tools")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const pendingTotal = expenses
    .filter((item) => item.status === "Pending")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  function openAddForm() {
    setEditingExpense(null);
    setForm({ ...INITIAL_FORM, date: new Date().toISOString().slice(0, 10) });
    setError("");
    setNotice("");
    setShowForm(true);
  }

  function openEditForm(expense) {
    setEditingExpense(expense);
    setForm({
      description: expense.description || "",
      category: expense.category || "Other",
      amount: String(expense.amount ?? ""),
      date: expense.date || new Date().toISOString().slice(0, 10),
      status: expense.status || "Pending",
      notes: expense.notes || "",
    });
    setError("");
    setNotice("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingExpense(null);
    setForm(INITIAL_FORM);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const isEditing = Boolean(editingExpense);
      const response = await adminFetch(
        isEditing ? `${API_URL}/${editingExpense._id}` : API_URL,
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, amount: Number(form.amount) }),
        }
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || "Could not save expense.");
      }
      await fetchExpenses();
      closeForm();
      setNotice(isEditing ? "Expense updated successfully." : "Expense recorded successfully.");
    } catch (err) {
      setError(err.message || "Could not save expense.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(expense) {
    if (!window.confirm(`Delete "${expense.description}" (${expense.expenseId})? This cannot be undone.`)) return;
    setError("");
    setNotice("");
    try {
      const response = await adminFetch(`${API_URL}/${expense._id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not delete expense.");
      }
      setExpenses((current) => current.filter((item) => item._id !== expense._id));
      setNotice("Expense deleted successfully.");
    } catch (err) {
      setError(err.message || "Could not delete expense.");
    }
  }

  async function toggleStatus(expense) {
    const nextStatus = expense.status === "Paid" ? "Pending" : "Paid";
    setError("");
    setNotice("");
    try {
      const response = await adminFetch(`${API_URL}/${expense._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not update expense status.");
      }
      setExpenses((current) => current.map((item) => item._id === expense._id ? data.expense : item));
      setNotice(`Expense marked ${nextStatus.toLowerCase()}.`);
    } catch (err) {
      setError(err.message || "Could not update expense status.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-yellow-600">Management</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="mt-2 text-gray-600">Track business expenses and money spent by Xaaji Electronics.</p>
        </div>
        <button type="button" onClick={openAddForm} className="rounded-lg bg-yellow-500 px-5 py-3 font-semibold text-gray-900 transition hover:bg-yellow-600">
          + Add Expense
        </button>
      </div>

      {error && (
        <div role="alert" className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} className="font-bold" aria-label="Dismiss error">×</button>
        </div>
      )}
      {notice && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")} className="font-bold" aria-label="Dismiss message">×</button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Expenses</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
          <p className="mt-2 text-xs text-gray-500">{expenses.length} recorded expense{expenses.length === 1 ? "" : "s"}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Materials</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">{formatCurrency(materialsTotal)}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Tools</p>
          <p className="mt-2 text-3xl font-bold text-purple-600">{formatCurrency(toolsTotal)}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{formatCurrency(pendingTotal)}</p>
        </div>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{editingExpense ? "Edit Expense" : "Add Expense"}</h2>
              <p className="mt-1 text-sm text-gray-500">Enter the expense details below.</p>
            </div>
            <button type="button" onClick={closeForm} className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100" aria-label="Close form">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">Description *</label>
              <input id="description" name="description" value={form.description} onChange={handleFormChange} required maxLength={160} placeholder="e.g. Electrical cable purchase" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100" />
            </div>
            <div>
              <label htmlFor="category" className="mb-2 block text-sm font-medium text-gray-700">Category *</label>
              <select id="category" name="category" value={form.category} onChange={handleFormChange} required className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100">
                {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="amount" className="mb-2 block text-sm font-medium text-gray-700">Amount (KSh) *</label>
              <input id="amount" name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={handleFormChange} required placeholder="12000" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100" />
            </div>
            <div>
              <label htmlFor="date" className="mb-2 block text-sm font-medium text-gray-700">Date *</label>
              <input id="date" name="date" type="date" value={form.date} onChange={handleFormChange} required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100" />
            </div>
            <div>
              <label htmlFor="status" className="mb-2 block text-sm font-medium text-gray-700">Status *</label>
              <select id="status" name="status" value={form.status} onChange={handleFormChange} required className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100">
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div>
              <label htmlFor="notes" className="mb-2 block text-sm font-medium text-gray-700">Notes (optional)</label>
              <input id="notes" name="notes" value={form.notes} onChange={handleFormChange} maxLength={500} placeholder="Additional details" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100" />
            </div>
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button type="submit" disabled={saving} className="rounded-lg bg-yellow-500 px-5 py-3 font-semibold text-gray-900 transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? "Saving..." : editingExpense ? "Save Changes" : "Record Expense"}
              </button>
              <button type="button" onClick={closeForm} disabled={saving} className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Business Expenses</h2>
            <p className="mt-1 text-sm text-gray-500">View and manage business spending.</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search expenses..." aria-label="Search expenses" className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 lg:col-span-2" />
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} aria-label="Filter by category" className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-yellow-500">
              <option value="All">All categories</option>
              {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status" className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-yellow-500">
              <option value="All">All statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading expenses...</div>
        ) : filteredExpenses.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-gray-800">No expenses found</p>
            <p className="mt-2 text-sm text-gray-500">{expenses.length === 0 ? "Add your first expense to see it here." : "Try changing your search or filters."}</p>
            {expenses.length === 0 && <button type="button" onClick={openAddForm} className="mt-4 rounded-lg bg-yellow-500 px-5 py-3 font-semibold text-gray-900 hover:bg-yellow-600">+ Add Expense</button>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1050px] w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["Expense", "Category", "Amount", "Date", "Status", "Actions"].map((heading) => (
                    <th key={heading} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredExpenses.map((expense) => (
                  <tr key={expense._id || expense.expenseId} className="transition hover:bg-gray-50">
                    <td className="px-6 py-5">
                      <p className="font-semibold text-gray-900">{expense.description}</p>
                      <p className="mt-1 text-xs text-gray-400">{expense.expenseId}</p>
                      {expense.notes && <p className="mt-1 max-w-xs truncate text-xs text-gray-500" title={expense.notes}>{expense.notes}</p>}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600">{expense.category}</td>
                    <td className="px-6 py-5 font-semibold text-gray-900">{formatCurrency(expense.amount)}</td>
                    <td className="px-6 py-5 text-sm text-gray-600">{formatDate(expense.date)}</td>
                    <td className="px-6 py-5">
                      <button type="button" onClick={() => toggleStatus(expense)} title="Click to change payment status" className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(expense.status)}`}>{expense.status}</button>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => openEditForm(expense)} className="font-semibold text-blue-600 hover:text-blue-800">Edit</button>
                        <button type="button" onClick={() => handleDelete(expense)} className="font-semibold text-red-600 hover:text-red-800">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-gray-100 px-6 py-4 text-sm text-gray-500">Showing {filteredExpenses.length} of {expenses.length} expenses</div>
      </div>
    </div>
  );
}

export default AdminExpenses;
