
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/settings";

const DEFAULT_SETTINGS = {
  businessName: "Xaaji Electronics",
  businessEmail: "",
  phoneNumber: "",
  businessAddress: "",
  acceptingRequests: true,
  notifications: {
    newRequests: true,
    payments: true,
    lowStock: true,
  },
};

function AdminSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSettings() {
      try {
        setLoading(true);

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load settings.");
        }

        setSettings({
          ...DEFAULT_SETTINGS,
          ...result.settings,
          notifications: {
            ...DEFAULT_SETTINGS.notifications,
            ...(result.settings?.notifications || {}),
          },
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          setMessage(error.message || "Unable to load settings.");
          setMessageType("error");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchSettings();

    return () => controller.abort();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
  };

  const handleNotificationChange = (name, checked) => {
    setSettings((previous) => ({
      ...previous,
      notifications: {
        ...previous.notifications,
        [name]: checked,
      },
    }));

    setMessage("");
  };

  const toggleAvailability = () => {
    setSettings((previous) => ({
      ...previous,
      acceptingRequests: !previous.acceptingRequests,
    }));

    setMessage("");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (saving || loading) return;

    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(API_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save settings.");
      }

      setSettings({
        ...DEFAULT_SETTINGS,
        ...result.settings,
        notifications: {
          ...DEFAULT_SETTINGS.notifications,
          ...(result.settings?.notifications || {}),
        },
      });

      setMessage("Settings saved successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage(error.message || "Unable to save settings.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100";

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600" role="status">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="pb-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-yellow-600">
          System
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Settings
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your business information and system preferences.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Business Information */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:col-span-2">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900">
                Business Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Update the contact information for Xaaji Electronics.
              </p>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <label
                  htmlFor="businessName"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Business Name
                </label>

                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  value={settings.businessName}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="businessEmail"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Business Email
                </label>

                <input
                  id="businessEmail"
                  name="businessEmail"
                  type="email"
                  value={settings.businessEmail}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Phone Number
                </label>

                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={settings.phoneNumber}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="businessAddress"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Business Address
                </label>

                <textarea
                  id="businessAddress"
                  name="businessAddress"
                  rows={3}
                  value={settings.businessAddress}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <div className="space-y-6">
            {/* Business Availability */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Business Status
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Set whether your business is available for new requests.
              </p>

              <div
                className={`mt-6 flex items-center justify-between gap-3 rounded-xl p-4 ${
                  settings.acceptingRequests
                    ? "bg-green-50"
                    : "bg-gray-100"
                }`}
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {settings.acceptingRequests
                      ? "Accepting Requests"
                      : "Not Accepting Requests"}
                  </p>

                  <p className="mt-1 text-xs text-gray-600">
                    {settings.acceptingRequests
                      ? "Availability enabled"
                      : "Availability disabled"}
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.acceptingRequests}
                  aria-label="Accept new service requests"
                  onClick={toggleAvailability}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    settings.acceptingRequests
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      settings.acceptingRequests
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                Save your changes to persist this preference.
              </p>
            </section>

            {/* Notifications */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Notifications
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Configure your notification preferences.
              </p>

              <div className="mt-6 space-y-5">
                {[
                  {
                    name: "newRequests",
                    title: "New Requests",
                    description: "Customer service requests",
                  },
                  {
                    name: "payments",
                    title: "Payments",
                    description: "Payment records",
                  },
                  {
                    name: "lowStock",
                    title: "Low Stock",
                    description: "Inventory stock alerts",
                  },
                ].map((item) => (
                  <label
                    key={item.name}
                    className="flex cursor-pointer items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.title}
                      </p>

                      <p className="text-xs text-gray-500">
                        {item.description}
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={Boolean(settings.notifications[item.name])}
                      onChange={(event) =>
                        handleNotificationChange(
                          item.name,
                          event.target.checked
                        )
                      }
                      className="h-5 w-5 accent-yellow-500"
                    />
                  </label>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Save and feedback */}
        {message && (
          <div
            role={messageType === "error" ? "alert" : "status"}
            className={`mt-6 rounded-lg border px-4 py-3 text-sm font-medium ${
              messageType === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-gray-950 transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving Settings..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Account Settings */}
      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">
          Account Settings
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          Administrator account management and password changes should
          be implemented through an authenticated account system.
          They are not connected to the general business settings API.
        </p>
      </section>

      {/* Danger Zone */}
      <section className="mt-6 rounded-2xl border border-red-200 bg-red-50">
        <div className="border-b border-red-200 p-6">
          <h2 className="text-lg font-bold text-red-700">
            Danger Zone
          </h2>

          <p className="mt-1 text-sm text-red-600">
            Destructive actions require a separate secure workflow.
          </p>
        </div>

        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-gray-900">
              Delete Business Data
            </p>

            <p className="mt-1 text-sm text-gray-600">
              Data deletion is disabled to protect your records.
            </p>
          </div>

          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-lg bg-red-200 px-5 py-3 font-semibold text-red-500"
          >
            Delete Data
          </button>
        </div>
      </section>
    </div>
  );
}

export default AdminSettings;
