
import { useEffect, useState } from "react";

const API_URL = "https://xaaji-electronics-api.onrender.com/api/inventory";

function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    product: "",
    category: "",
    quantity: "",
    unitPrice: "",
    reorderLevel: "",
    supplier: "",
    location: "",
  });

  // ===============================
  // FETCH INVENTORY
  // ===============================
  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch inventory");
      }

      setInventory(data.inventory || []);
    } catch (err) {
      console.error("Fetch inventory error:", err);
      setError(err.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // ===============================
  // FORM HANDLING
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // RESET FORM
  // ===============================
  const resetForm = () => {
    setFormData({
      product: "",
      category: "",
      quantity: "",
      unitPrice: "",
      reorderLevel: "",
      supplier: "",
      location: "",
    });

    setEditingItem(null);
  };

  // ===============================
  // OPEN ADD MODAL
  // ===============================
  const openAddModal = () => {
    resetForm();
    setShowModal(true);
    setError("");
    setSuccess("");
  };

  // ===============================
  // OPEN EDIT MODAL
  // ===============================
  const openEditModal = (item) => {
    setEditingItem(item);

    setFormData({
      product: item.product || "",
      category: item.category || "",
      quantity: item.quantity ?? "",
      unitPrice: item.unitPrice ?? "",
      reorderLevel: item.reorderLevel ?? "",
      supplier: item.supplier || "",
      location: item.location || "",
    });

    setShowModal(true);
    setError("");
    setSuccess("");
  };

  // ===============================
  // CLOSE MODAL
  // ===============================
  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  // ===============================
  // ADD / UPDATE INVENTORY
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.product ||
      !formData.category ||
      formData.quantity === "" ||
      formData.unitPrice === ""
    ) {
      setError(
        "Product, category, quantity, and unit cost are required."
      );
      return;
    }

    const payload = {
      product: formData.product,
      category: formData.category,
      quantity: Number(formData.quantity),
      unitPrice: Number(formData.unitPrice),
      reorderLevel:
        formData.reorderLevel === ""
          ? 5
          : Number(formData.reorderLevel),
      supplier: formData.supplier,
      location: formData.location,
    };

    try {
      const url = editingItem
        ? `${API_URL}/${editingItem._id}`
        : API_URL;

      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            `Failed to ${
              editingItem ? "update" : "create"
            } inventory item`
        );
      }

      if (editingItem) {
        setSuccess("Inventory item updated successfully.");
      } else {r
        setSuccess("Inventory item added successfully.");
      }

      closeModal();
      await fetchInventory();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Save inventory error:", err);
      setError(err.message || "Failed to save inventory item.");
    }
  };

  // ===============================
  // DELETE INVENTORY
  // ===============================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this inventory item?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete inventory item"
        );
      }

      setSuccess("Inventory item deleted successfully.");

      await fetchInventory();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Delete inventory error:", err);
      setError(err.message || "Failed to delete inventory item.");
    }
  };

  // ===============================
  // STATUS STYLE
  // ===============================
  const getStatusStyle = (status) => {
    if (status === "In Stock") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Low Stock") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (status === "Out of Stock") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  // ===============================
  // STATISTICS
  // ===============================
  const totalProducts = inventory.length;

  const inStock = inventory.filter(
    (item) => item.status === "In Stock"
  ).length;

  const lowStock = inventory.filter(
    (item) => item.status === "Low Stock"
  ).length;

  const outOfStock = inventory.filter(
    (item) => item.status === "Out of Stock"
  ).length;

  return (
    <div>
      {/* PAGE HEADER */}

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-yellow-600">
          Management
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Inventory
        </h1>

        <p className="mt-2 text-gray-600">
          Track electrical materials, stock levels, and products.
        </p>
      </div>

      {/* SUCCESS MESSAGE */}

      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      {/* ERROR MESSAGE */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* STATISTICS */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {/* TOTAL */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Products
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {loading ? "..." : totalProducts}
          </p>
        </div>

        {/* IN STOCK */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            In Stock
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {loading ? "..." : inStock}
          </p>
        </div>

        {/* LOW STOCK */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Low Stock
          </p>

          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {loading ? "..." : lowStock}
          </p>
        </div>

        {/* OUT OF STOCK */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Out of Stock
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {loading ? "..." : outOfStock}
          </p>
        </div>

      </div>

      {/* INVENTORY TABLE */}

      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* TABLE HEADER */}

        <div className="flex flex-col gap-4 border-b border-gray-200 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Stock Inventory
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage products and electrical materials in stock.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="rounded-lg bg-yellow-500 px-5 py-3 font-semibold text-gray-900 transition hover:bg-yellow-600"
          >
            + Add Product
          </button>

        </div>

        {/* LOADING */}

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading inventory...
          </div>
        ) : inventory.length === 0 ? (
          /* EMPTY STATE */

          <div className="p-10 text-center">
            <div className="text-5xl">
              📦
            </div>

            <h3 className="mt-4 text-lg font-bold text-gray-900">
              No inventory items
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Add your first electrical product to begin tracking inventory.
            </p>

            <button
              onClick={openAddModal}
              className="mt-5 rounded-lg bg-yellow-500 px-5 py-3 font-semibold text-gray-900 transition hover:bg-yellow-600"
            >
              + Add Product
            </button>
          </div>
        ) : (
          /* RESPONSIVE TABLE */

          <div className="overflow-x-auto">

            <table className="min-w-[1100px] w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Quantity
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Unit Cost
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {inventory.map((product) => (

                  <tr
                    key={product._id}
                    className="transition hover:bg-gray-50"
                  >

                    {/* PRODUCT */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-lg">
                          📦
                        </div>

                        <div>

                          <p className="font-semibold text-gray-900">
                            {product.product}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {product._id}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* CATEGORY */}

                    <td className="px-6 py-5 text-sm text-gray-700">
                      {product.category}
                    </td>

                    {/* QUANTITY */}

                    <td className="px-6 py-5">

                      <p className="font-semibold text-gray-900">
                        {product.quantity}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        units
                      </p>

                    </td>

                    {/* COST */}

                    <td className="px-6 py-5 text-sm font-medium text-gray-900">
                      KSh {Number(product.unitPrice).toLocaleString()}
                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-5">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          product.status
                        )}`}
                      >
                        {product.status}
                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-5">

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() => openEditModal(product)}
                          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(product._id)
                          }
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
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

      {/* ADD / EDIT MODAL */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-gray-200 p-6">

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  {editingItem
                    ? "Edit Inventory Item"
                    : "Add Inventory Item"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingItem
                    ? "Update the inventory information."
                    : "Add a new electrical product to inventory."}
                </p>

              </div>

              <button
                onClick={closeModal}
                className="rounded-lg px-3 py-2 text-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* PRODUCT + CATEGORY */}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Product Name *
                  </label>

                  <input
                    type="text"
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    placeholder="e.g. LED Bulb"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Category *
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g. Lighting"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                  />

                </div>

              </div>

              {/* QUANTITY + PRICE */}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Quantity *
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    min="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g. 50"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Unit Cost (KSh) *
                  </label>

                  <input
                    type="number"
                    name="unitPrice"
                    min="0"
                    value={formData.unitPrice}
                    onChange={handleChange}
                    placeholder="e.g. 150"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                  />

                </div>

              </div>

              {/* REORDER LEVEL */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Reorder Level
                </label>

                <input
                  type="number"
                  name="reorderLevel"
                  min="0"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                />

                <p className="mt-1 text-xs text-gray-500">
                  The stock level at which the item becomes Low Stock.
                </p>

              </div>

              {/* SUPPLIER + LOCATION */}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Supplier
                  </label>

                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    placeholder="Supplier name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Main Shop"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                  />

                </div>

              </div>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-yellow-500 px-5 py-3 font-semibold text-gray-900 transition hover:bg-yellow-600"
                >
                  {editingItem
                    ? "Update Product"
                    : "Add Product"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminInventory;
