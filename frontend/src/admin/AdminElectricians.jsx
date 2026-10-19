import { useEffect, useState } from "react";

const API_URL = "https://xaaji-electronics-api.onrender.com/api/electricians";

function AdminElectricians() {
  const [electricians, setElectricians] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit modal
  const [showForm, setShowForm] = useState(false);
  const [editingElectrician, setEditingElectrician] = useState(null);

  // Saving
  const [saving, setSaving] = useState(false);

  // Error / success
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Search
  const [search, setSearch] = useState("");

  // Form
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    specialization: "",
    experience: "",
    description: "",
    profileImage: "",
    available: true,
  });

  // =========================================================
  // GET ELECTRICIANS
  // =========================================================

  useEffect(() => {
    fetchElectricians();
  }, []);

  const fetchElectricians = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load electricians"
        );
      }

      if (result.success) {
        setElectricians(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch electricians:", error);
      setError(error.message || "Unable to load electricians.");
    } finally {
      setLoading(false);
    }
  };

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
    setEditingElectrician(null);

    setFormData({
      name: "",
      phone: "",
      email: "",
      location: "",
      specialization: "",
      experience: "",
      description: "",
      profileImage: "",
      available: true,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // =========================================================
  // OPEN EDIT FORM
  // =========================================================

  const openEditForm = (electrician) => {
    setEditingElectrician(electrician);

    setFormData({
      name: electrician.name || "",
      phone: electrician.phone || "",
      email: electrician.email || "",
      location: electrician.location || "",
      specialization: electrician.specialization || "",
      experience: electrician.experience ?? "",
      description: electrician.description || "",
      profileImage: electrician.profileImage || "",
      available: electrician.available ?? true,
    });

    setError("");
    setSuccess("");
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
    setEditingElectrician(null);
    setError("");
  };

  // =========================================================
  // ADD / UPDATE ELECTRICIAN
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const isEditing = Boolean(editingElectrician);

      const url = isEditing
        ? `${API_URL}/${editingElectrician._id}`
        : API_URL;

      const method = isEditing ? "PUT" : "POST";

      // Send JSON to backend
      const data = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        location: formData.location.trim(),
        specialization: formData.specialization.trim(),
        experience: Number(formData.experience) || 0,
        description: formData.description.trim(),
        profileImage: formData.profileImage.trim(),
        available: formData.available,
      };

      console.log("Sending electrician data:", data);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      console.log("Backend response:", result);

      if (!response.ok) {
        throw new Error(
          result.error ||
            result.message ||
            `Failed to ${
              isEditing ? "update" : "create"
            } electrician`
        );
      }

      // =====================================================
      // UPDATE TABLE
      // =====================================================

      if (isEditing) {
        setElectricians((previous) =>
          previous.map((electrician) =>
            electrician._id === editingElectrician._id
              ? result.data
              : electrician
          )
        );

        setSuccess("Electrician updated successfully.");
      } else {
        setElectricians((previous) => [
          ...previous,
          result.data,
        ]);

        setSuccess("Electrician added successfully.");
      }

      // Close form
      setShowForm(false);
      setEditingElectrician(null);
    } catch (error) {
      console.error("Electrician save error:", error);
      setError(error.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE ELECTRICIAN
  // =========================================================

  const handleDelete = async (electrician) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${electrician.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/${electrician._id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            result.message ||
            "Failed to delete electrician"
        );
      }

      setElectricians((previous) =>
        previous.filter(
          (item) => item._id !== electrician._id
        )
      );

      setSuccess("Electrician deleted successfully.");
    } catch (error) {
      console.error("Delete electrician error:", error);

      setError(
        error.message || "Failed to delete electrician."
      );
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredElectricians = electricians.filter(
    (electrician) => {
      const searchText = search.toLowerCase();

      return (
        electrician.name
          ?.toLowerCase()
          .includes(searchText) ||
        electrician.phone
          ?.toLowerCase()
          .includes(searchText) ||
        electrician.email
          ?.toLowerCase()
          .includes(searchText) ||
        electrician.location
          ?.toLowerCase()
          .includes(searchText) ||
        electrician.specialization
          ?.toLowerCase()
          .includes(searchText)
      );
    }
  );

  // =========================================================
  // STATISTICS
  // =========================================================

  const availableCount = electricians.filter(
    (electrician) => electrician.available
  ).length;

  const unavailableCount =
    electricians.length - availableCount;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-yellow-600">
          Management
        </p>

        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Electricians
            </h1>

            <p className="mt-2 text-gray-600">
              Manage electricians, profiles, availability,
              and specialties.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="rounded-xl bg-yellow-500 px-5 py-3 font-semibold text-gray-900 shadow-sm transition hover:bg-yellow-600"
          >
            + Add Electrician
          </button>
        </div>
      </div>

      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && !showForm && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Electricians
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {electricians.length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Available
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {availableCount}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Unavailable
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-600">
            {unavailableCount}
          </p>
        </div>

      </div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

        <input
          type="text"
          placeholder="Search by name, phone, location or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
        />

      </div>

      {/* =====================================================
          ELECTRICIANS
      ===================================================== */}

      <div className="mt-8">

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-600">
              Loading electricians...
            </p>
          </div>
        ) : filteredElectricians.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

            <p className="text-lg font-semibold text-gray-900">
              No electricians found
            </p>

            <p className="mt-2 text-gray-500">
              {search
                ? `No results for "${search}".`
                : "Add your first electrician to get started."}
            </p>

          </div>
        ) : (

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

            {filteredElectricians.map((electrician) => (

              <div
                key={electrician._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                {/* =================================================
                    LARGE PHOTO
                ================================================= */}

                <div className="relative h-80 w-full overflow-hidden bg-gray-100">

                  {electrician.profileImage ? (
                    <img
                      src={electrician.profileImage}
                      alt={electrician.name}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-yellow-50">
                      <div className="text-center">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-3xl font-bold text-yellow-700">
                          {electrician.name?.charAt(0)}
                        </div>

                        <p className="mt-3 text-sm text-gray-500">
                          No profile photo
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Availability */}

                  <div className="absolute right-4 top-4">

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold shadow ${
                        electrician.available
                          ? "bg-green-500 text-white"
                          : "bg-gray-700 text-white"
                      }`}
                    >
                      {electrician.available
                        ? "Available"
                        : "Unavailable"}
                    </span>

                  </div>

                </div>

                {/* =================================================
                    CARD CONTENT
                ================================================= */}

                <div className="p-5">

                  <h2 className="text-xl font-bold text-gray-900">
                    {electrician.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    📍 {electrician.location}
                  </p>

                  <p className="mt-4 font-semibold text-yellow-600">
                    {electrician.specialization}
                  </p>

                  {electrician.phone && (
                    <p className="mt-2 text-sm text-gray-600">
                      📞 {electrician.phone}
                    </p>
                  )}

                  {electrician.email && (
                    <p className="mt-1 break-all text-sm text-gray-600">
                      ✉️ {electrician.email}
                    </p>
                  )}

                  {/* Experience */}

                  <div className="mt-5 grid grid-cols-2 gap-3">

                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">
                        Experience
                      </p>

                      <p className="mt-1 font-bold text-gray-900">
                        {electrician.experience || 0} years
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">
                        Status
                      </p>

                      <p
                        className={`mt-1 font-bold ${
                          electrician.available
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      >
                        {electrician.available
                          ? "Available"
                          : "Unavailable"}
                      </p>
                    </div>

                  </div>

                  {/* Description */}

                  {electrician.description && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                      {electrician.description}
                    </p>
                  )}

                  {/* =================================================
                      ACTION BUTTONS
                  ================================================= */}

                  <div className="mt-5 grid grid-cols-2 gap-3">

                    <button
                      onClick={() =>
                        openEditForm(electrician)
                      }
                      className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(electrician)
                      }
                      className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* =========================================================
          ADD / EDIT MODAL
      ========================================================= */}

      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">

          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-gray-200 p-6">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingElectrician
                    ? "Edit Electrician"
                    : "Add Electrician"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingElectrician
                    ? "Update electrician information."
                    : "Add a new electrician to Xaaji Electronics."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-600 transition hover:bg-gray-200"
              >
                ×
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* Form Error */}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Name */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Ahmed Hassan"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                />
              </div>

              {/* Phone + Email */}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Phone *
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="0712345678"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ahmed@example.com"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                  />
                </div>

              </div>

              {/* Location + Specialization */}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Location *
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Nairobi"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Specialization *
                  </label>

                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Electrical Installation"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                  />
                </div>

              </div>

              {/* Experience */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Experience (Years)
                </label>

                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g. 8"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                />
              </div>

              {/* Profile Image URL */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Profile Image URL
                </label>

                <input
                  type="url"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                  placeholder="https://example.com/electrician-photo.jpg"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                />

                <p className="mt-2 text-xs text-gray-500">
                  For now, paste an image URL. We can connect
                  Cloudinary upload later.
                </p>

                {/* Image Preview */}

                {formData.profileImage && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">

                    <img
                      src={formData.profileImage}
                      alt="Preview"
                      className="h-48 w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />

                  </div>
                )}
              </div>

              {/* Description */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe the electrician's experience and services..."
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                />
              </div>

              {/* Available */}

              <div className="rounded-xl bg-gray-50 p-4">

                <label className="flex cursor-pointer items-center gap-3">

                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                  />

                  <div>
                    <p className="font-semibold text-gray-900">
                      Available for service
                    </p>

                    <p className="text-sm text-gray-500">
                      Customers can see this electrician as
                      available.
                    </p>
                  </div>

                </label>

              </div>

              {/* Buttons */}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-gray-900 transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingElectrician
                    ? "Update Electrician"
                    : "Add Electrician"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminElectricians;