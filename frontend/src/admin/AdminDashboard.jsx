import adminFetch, { API_BASE_URL } from "../config/adminFetch";
import { useEffect, useState } from "react";

function AdminDashboard() {
  // =========================
  // STATE
  // =========================

  const [products, setProducts] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);

  const [error, setError] = useState("");
  const [jobsError, setJobsError] = useState("");

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminFetch(
        `${API_BASE_URL}/api/products`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      console.log("Products API response:", data);

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.products)) {
        setProducts(data.products);
      } else if (Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        console.error(
          "Products response is not an array:",
          data
        );

        setProducts([]);
      }
    } catch (error) {
      console.error(
        "Error fetching products:",
        error
      );

      setProducts([]);

      setError(
        "Unable to load products from the server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH JOBS
  // =========================

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);
      setJobsError("");

      const response = await adminFetch(
        `${API_BASE_URL}/api/jobs`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();

      console.log("Jobs API response:", data);

      if (Array.isArray(data)) {
        setJobs(data);
      } else if (Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      } else if (Array.isArray(data.data)) {
        setJobs(data.data);
      } else {
        console.error(
          "Jobs response is not an array:",
          data
        );

        setJobs([]);
      }
    } catch (error) {
      console.error(
        "Error fetching jobs:",
        error
      );

      setJobs([]);

      setJobsError(
        "Unable to load jobs from the server."
      );
    } finally {
      setJobsLoading(false);
    }
  };

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    fetchProducts();
    fetchJobs();
  }, []);

  // =========================
  // REFRESH EVERYTHING
  // =========================

  const refreshDashboard = async () => {
    await Promise.all([
      fetchProducts(),
      fetchJobs(),
    ]);
  };

  // =========================
  // LOW STOCK PRODUCTS
  // =========================

  const lowStockProducts = Array.isArray(products)
    ? products.filter(
        (product) =>
          Number(product.stock || 0) <= 5
      )
    : [];

  // =========================
  // ACTIVE JOBS
  // =========================

  const activeJobs = Array.isArray(jobs)
    ? jobs.filter(
        (job) =>
          job.status === "Pending" ||
          job.status === "Scheduled" ||
          job.status === "In Progress"
      )
    : [];

  // =========================
  // IN PROGRESS JOBS
  // =========================

  const inProgressJobs = Array.isArray(jobs)
    ? jobs.filter(
        (job) =>
          job.status === "In Progress"
      )
    : [];

  // =========================
  // COMPLETED JOBS
  // =========================

  const completedJobs = Array.isArray(jobs)
    ? jobs.filter(
        (job) =>
          job.status === "Completed"
      )
    : [];

  // =========================
  // RECENT JOBS
  // =========================

  const recentJobs = Array.isArray(jobs)
    ? [...jobs]
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.date) -
            new Date(a.createdAt || a.date)
        )
        .slice(0, 5)
    : [];

  // =========================
  // STATISTICS
  // =========================

  const statistics = [
    {
      title: "Total Customers",
      value: "128",
      icon: "👥",
      description: "Registered customers",
    },

    {
      title: "Electricians",
      value: "24",
      icon: "👷",
      description: "Registered electricians",
    },

    {
      title: "Service Requests",
      value: "56",
      icon: "📋",
      description: "Total requests",
    },

    {
      title: "Active Jobs",
      value: jobsLoading
        ? "..."
        : activeJobs.length,
      icon: "🛠️",
      description: "Pending, scheduled or in progress",
    },

    {
      title: "Total Products",
      value: loading
        ? "..."
        : products.length,
      icon: "📦",
      description: "Products in inventory",
    },

    {
      title: "Low Stock",
      value: loading
        ? "..."
        : lowStockProducts.length,
      icon: "⚠️",
      description: "Products need restocking",
    },
  ];

  // =========================
  // RECENT SERVICE REQUESTS
  // =========================

  const recentRequests = [
    {
      customer: "Mohamed Ali",
      service: "Electrical Repair",
      status: "New",
    },

    {
      customer: "Amina Hassan",
      service: "Lighting Installation",
      status: "In Progress",
    },

    {
      customer: "Abdi Omar",
      service: "Electrical Wiring",
      status: "Completed",
    },
  ];

  // =========================
  // RECENT PRODUCTS
  // =========================

  const recentProducts = Array.isArray(products)
    ? products.slice(-5).reverse()
    : [];

  // =========================
  // FORMAT JOB DATE
  // =========================

  const formatDate = (date) => {
    if (!date) {
      return "No date";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "No date";
    }

    return parsedDate.toLocaleDateString(
      "en-KE",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  // =========================
  // JOB STATUS COLORS
  // =========================

  const getJobStatusClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Scheduled":
        return "bg-blue-100 text-blue-700";

      case "In Progress":
        return "bg-purple-100 text-purple-700";

      case "Completed":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="space-y-8">

      {/* =====================================
          PAGE HEADER
      ====================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-yellow-600">
            Overview
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Welcome to the Xaaji Electronics
            management system.
          </p>
        </div>

        <button
          onClick={refreshDashboard}
          disabled={loading || jobsLoading}
          className="w-fit rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading || jobsLoading
            ? "Refreshing..."
            : "🔄 Refresh"}
        </button>

      </div>

      {/* =====================================
          ERROR MESSAGES
      ====================================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>
        </div>
      )}

      {jobsError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            {jobsError}
          </p>
        </div>
      )}

      {/* =====================================
          STATISTICS
      ====================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

        {statistics.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  {stat.title}
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-2xl">
                {stat.icon}
              </div>

            </div>

            <p className="mt-4 text-sm text-gray-500">
              {stat.description}
            </p>

          </div>
        ))}

      </div>

      {/* =====================================
          JOB SUMMARY
      ====================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

        {/* Active Jobs */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Active Jobs
              </p>

              <p className="mt-2 text-3xl font-bold text-purple-600">
                {jobsLoading
                  ? "..."
                  : activeJobs.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
              🛠️
            </div>

          </div>

          <p className="mt-4 text-sm text-gray-500">
            Pending, scheduled and in-progress jobs
          </p>

        </div>

        {/* In Progress */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                In Progress
              </p>

              <p className="mt-2 text-3xl font-bold text-yellow-600">
                {jobsLoading
                  ? "..."
                  : inProgressJobs.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-2xl">
              ⚡
            </div>

          </div>

          <p className="mt-4 text-sm text-gray-500">
            Jobs currently being worked on
          </p>

        </div>

        {/* Completed */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Completed Jobs
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {jobsLoading
                  ? "..."
                  : completedJobs.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
              ✅
            </div>

          </div>

          <p className="mt-4 text-sm text-gray-500">
            Successfully completed service jobs
          </p>

        </div>

      </div>

      {/* =====================================
          RECENT REQUESTS + QUICK ACTIONS
      ====================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Recent Requests */}

        <div className="rounded-2xl border border-gray-200 bg-white xl:col-span-2">

          <div className="flex items-center justify-between border-b border-gray-200 p-6">

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Recent Service Requests
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest customer requests
              </p>
            </div>

            <button className="text-sm font-semibold text-yellow-600 hover:text-yellow-700">
              View All
            </button>

          </div>

          <div className="divide-y divide-gray-100">

            {recentRequests.map(
              (request) => (
                <div
                  key={request.customer}
                  className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div>

                    <h3 className="font-semibold text-gray-900">
                      {request.customer}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {request.service}
                    </p>

                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      request.status === "New"
                        ? "bg-blue-100 text-blue-700"
                        : request.status ===
                          "In Progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {request.status}
                  </span>

                </div>
              )
            )}

          </div>

        </div>

        {/* Quick Actions */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6">

          <h2 className="text-lg font-bold text-gray-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Common management tasks
          </p>

          <div className="mt-6 space-y-3">

            {/* Add Service */}

            <button className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition hover:border-yellow-500 hover:bg-yellow-50">

              <span className="text-xl">
                ⚡
              </span>

              <div>
                <p className="font-semibold text-gray-900">
                  Add Service
                </p>

                <p className="text-xs text-gray-500">
                  Create a new service
                </p>
              </div>

            </button>

            {/* Add Electrician */}

            <button className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition hover:border-yellow-500 hover:bg-yellow-50">

              <span className="text-xl">
                👷
              </span>

              <div>
                <p className="font-semibold text-gray-900">
                  Add Electrician
                </p>

                <p className="text-xs text-gray-500">
                  Register an electrician
                </p>
              </div>

            </button>

            {/* Add Inventory */}

            <button className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition hover:border-yellow-500 hover:bg-yellow-50">

              <span className="text-xl">
                📦
              </span>

              <div>
                <p className="font-semibold text-gray-900">
                  Add Inventory
                </p>

                <p className="text-xs text-gray-500">
                  Add a product to stock
                </p>
              </div>

            </button>

          </div>

        </div>

      </div>

      {/* =====================================
          RECENT JOBS
      ====================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white">

        <div className="flex items-center justify-between border-b border-gray-200 p-6">

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Recent Jobs
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest jobs from MongoDB
            </p>
          </div>

          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
            {jobs.length} Jobs
          </span>

        </div>

        <div className="divide-y divide-gray-100">

          {jobsLoading ? (
            <div className="p-6 text-sm text-gray-500">
              Loading jobs...
            </div>
          ) : recentJobs.length === 0 ? (
            <div className="p-6">

              <div className="rounded-xl bg-gray-50 p-6 text-center">

                <p className="text-3xl">
                  🛠️
                </p>

                <p className="mt-2 font-semibold text-gray-700">
                  No jobs found
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Create a job from the Admin Jobs page.
                </p>

              </div>

            </div>
          ) : (
            recentJobs.map(
              (job, index) => (
                <div
                  key={
                    job._id ||
                    job.id ||
                    index
                  }
                  className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"
                >

                  {/* Job information */}

                  <div className="flex min-w-0 items-center gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-xl">
                      🛠️
                    </div>

                    <div className="min-w-0">

                      <h3 className="font-semibold text-gray-900">
                        {job.customer ||
                          "Unknown Customer"}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {job.service ||
                          "Electrical Service"}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {job.electrician ||
                          "No electrician assigned"}{" "}
                        •{" "}
                        {job.location ||
                          "No location"}
                      </p>

                    </div>

                  </div>

                  {/* Date + Status */}

                  <div className="flex flex-wrap items-center gap-4 lg:justify-end">

                    <div className="text-sm text-gray-500">
                      {formatDate(job.date)}
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getJobStatusClasses(
                        job.status
                      )}`}
                    >
                      {job.status ||
                        "Pending"}
                    </span>

                  </div>

                </div>
              )
            )
          )}

        </div>

      </div>

      {/* =====================================
          PRODUCTS SECTION
      ====================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* =====================================
            RECENT PRODUCTS
        ====================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white">

          <div className="flex items-center justify-between border-b border-gray-200 p-6">

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Recent Products
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Recently added inventory
              </p>
            </div>

            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
              {products.length} Products
            </span>

          </div>

          <div className="divide-y divide-gray-100">

            {loading ? (
              <div className="p-6 text-sm text-gray-500">
                Loading products...
              </div>
            ) : recentProducts.length === 0 ? (
              <div className="p-6">

                <div className="rounded-xl bg-gray-50 p-5 text-center">

                  <p className="text-2xl">
                    📦
                  </p>

                  <p className="mt-2 font-semibold text-gray-700">
                    No products found
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Add products from the Admin Products page.
                  </p>

                </div>

              </div>
            ) : (
              recentProducts.map(
                (product, index) => (
                  <div
                    key={
                      product._id ||
                      product.id ||
                      index
                    }
                    className="flex items-center justify-between gap-4 p-5"
                  >

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                        📦
                      </div>

                      <div className="min-w-0">

                        <h3 className="truncate font-semibold text-gray-900">
                          {product.name ||
                            "Unnamed Product"}
                        </h3>

                        <p className="truncate text-xs text-gray-500">
                          {product.category ||
                            "Electrical"}
                        </p>

                      </div>

                    </div>

                    <div className="shrink-0 text-right">

                      <p className="font-semibold text-gray-900">
                        KSh{" "}
                        {Number(
                          product.price || 0
                        ).toLocaleString()}
                      </p>

                      <p
                        className={`text-xs font-medium ${
                          Number(
                            product.stock || 0
                          ) <= 5
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        Stock:{" "}
                        {product.stock ?? 0}
                      </p>

                    </div>

                  </div>
                )
              )
            )}

          </div>

        </div>

        {/* =====================================
            LOW STOCK
        ====================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white">

          <div className="border-b border-gray-200 p-6">

            <h2 className="text-lg font-bold text-gray-900">
              Low Stock Alert
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Products that may need restocking
            </p>

          </div>

          <div className="divide-y divide-gray-100">

            {loading ? (
              <div className="p-6 text-sm text-gray-500">
                Checking stock...
              </div>
            ) : lowStockProducts.length === 0 ? (
              <div className="p-6">

                <div className="rounded-xl bg-green-50 p-4">

                  <p className="font-semibold text-green-700">
                    ✅ Stock levels are good
                  </p>

                  <p className="mt-1 text-sm text-green-600">
                    No products currently need restocking.
                  </p>

                </div>

              </div>
            ) : (
              lowStockProducts.map(
                (product, index) => (
                  <div
                    key={
                      product._id ||
                      product.id ||
                      index
                    }
                    className="flex items-center justify-between gap-4 p-5"
                  >

                    <div className="min-w-0">

                      <h3 className="truncate font-semibold text-gray-900">
                        {product.name ||
                          "Unnamed Product"}
                      </h3>

                      <p className="truncate text-xs text-gray-500">
                        {product.category ||
                          "Electrical"}
                      </p>

                    </div>

                    <span className="shrink-0 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                      {product.stock ?? 0} left
                    </span>

                  </div>
                )
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;