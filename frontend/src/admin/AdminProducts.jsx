import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/products";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    available: true,
  });

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch products"
        );
      }

      setProducts(result.data || []);
    } catch (error) {
      console.error("Fetch products error:", error);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================================================
  // OPEN ADD FORM
  // =========================================================

  const openAddForm = () => {
    setEditingProduct(null);

    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      image: "",
      available: true,
    });

    setError("");
    setShowForm(true);
  };

  // =========================================================
  // OPEN EDIT FORM
  // =========================================================

  const openEditForm = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      category: product.category || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      description: product.description || "",
      image: product.image || "",
      available: product.available ?? true,
    });

    setError("");
    setShowForm(true);
  };

  // =========================================================
  // CLOSE FORM
  // =========================================================

  const closeForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingProduct(null);
    setError("");
  };

  // =========================================================
  // SAVE PRODUCT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      const isEditing = Boolean(editingProduct);

      const url = isEditing
        ? `${API_URL}/${editingProduct._id}`
        : API_URL;

      const method = isEditing ? "PUT" : "POST";

      const productData = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description.trim(),
        image: formData.image.trim(),
        available: formData.available,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Failed to ${
              isEditing ? "update" : "create"
            } product`
        );
      }

      if (isEditing) {
        setProducts((previous) =>
          previous.map((product) =>
            product._id === editingProduct._id
              ? result.data
              : product
          )
        );
      } else {
        setProducts((previous) => [
          result.data,
          ...previous,
        ]);
      }

      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Product save error:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE PRODUCT
  // =========================================================

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${product.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/${product._id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete product"
        );
      }

      setProducts((previous) =>
        previous.filter(
          (item) => item._id !== product._id
        )
      );
    } catch (error) {
      console.error("Delete product error:", error);
      setError(error.message);
    }
  };

  // =========================================================
  // STATISTICS
  // =========================================================

  const availableCount = products.filter(
    (product) => product.available
  ).length;

  const outOfStockCount = products.filter(
    (product) => Number(product.stock) === 0
  ).length;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage electrical products sold by Xaaji Electronics.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchProducts}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Refresh
          </button>

          <button
            onClick={openAddForm}
            className="rounded-lg bg-yellow-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-yellow-600"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* STATISTICS */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Products
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {products.length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Available Products
          </p>

          <p className="mt-2 text-2xl font-bold text-green-600">
            {availableCount}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Out of Stock
          </p>

          <p className="mt-2 text-2xl font-bold text-red-600">
            {outOfStockCount}
          </p>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
          <p className="text-gray-500">
            Loading products...
          </p>
        </div>
      )}

      {/* EMPTY */}
      {!loading && products.length === 0 && (
        <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
          <p className="text-gray-500">
            No products found.
          </p>

          <button
            onClick={openAddForm}
            className="mt-4 rounded-lg bg-yellow-500 px-5 py-3 text-sm font-semibold text-white hover:bg-yellow-600"
          >
            Add Your First Product
          </button>
        </div>
      )}

      {/* PRODUCT TABLE */}
      {!loading && products.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Stock
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
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="transition hover:bg-gray-50"
                  >
                    {/* PRODUCT */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-14 w-14 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100 text-xl">
                            ⚡
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-gray-900">
                            {product.name}
                          </p>

                          <p className="mt-1 max-w-xs truncate text-sm text-gray-500">
                            {product.description ||
                              "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-700">
                      {product.category}
                    </td>

                    {/* PRICE */}
                    <td className="whitespace-nowrap px-6 py-5 text-sm font-semibold text-gray-900">
                      KSh {Number(product.price).toLocaleString()}
                    </td>

                    {/* STOCK */}
                    <td className="whitespace-nowrap px-6 py-5">
                      <span
                        className={
                          product.stock === 0
                            ? "font-semibold text-red-600"
                            : "font-semibold text-gray-700"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="whitespace-nowrap px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.available &&
                          product.stock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.available &&
                        product.stock > 0
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="whitespace-nowrap px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            openEditForm(product)
                          }
                          className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(product)
                          }
                          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
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

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter the product information below.
                </p>
              </div>

              <button
                onClick={closeForm}
                disabled={saving}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. LED Bulb 12W"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                />
              </div>

              {/* CATEGORY + PRICE */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Lighting"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Price (KSh)
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="250"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                  />
                </div>
              </div>

              {/* STOCK */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Stock Quantity
                </label>

                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="35"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe the product..."
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                />
              </div>

              {/* IMAGE URL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Image URL
                </label>

                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/product-image.jpg"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                />

                <p className="mt-2 text-xs text-gray-500">
                  We can connect this to Cloudinary later.
                </p>
              </div>

              {/* AVAILABLE */}
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                />

                <span className="text-sm font-medium text-gray-700">
                  Product is available
                </span>
              </label>

              {/* BUTTONS */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-yellow-500 px-6 py-3 text-sm font-semibold text-white hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
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

export default AdminProducts;