import { useEffect, useMemo, useState } from "react";

const API_URL = "https://xaaji-electronics-api.onrender.com/api/jobs";

const initialJob = {
  customer: "",
  electrician: "",
  service: "",
  location: "",
  status: "Pending",
  date: "",
};

function AdminJobs() {
  // ================================
  // STATE
  // ================================
  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [newJob, setNewJob] = useState(initialJob);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ================================
  // FETCH JOBS
  // ================================
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch jobs"
        );
      }

      setJobs(Array.isArray(data.jobs) ? data.jobs : []);
    } catch (error) {
      console.error("Error fetching jobs:", error);

      setError(
        error.message ||
          "Unable to connect to the jobs server."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs when page loads
  useEffect(() => {
    fetchJobs();
  }, []);

  // ================================
  // CLEAR MESSAGES
  // ================================
  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  // ================================
  // FORM INPUT
  // ================================
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setNewJob((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ================================
  // CREATE JOB
  // ================================
  const handleCreateJob = async (event) => {
    event.preventDefault();

    clearMessages();

    // Basic validation
    if (
      !newJob.customer.trim() ||
      !newJob.electrician.trim() ||
      !newJob.service.trim() ||
      !newJob.location.trim() ||
      !newJob.date
    ) {
      setError(
        "Please fill in all required job information."
      );

      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: newJob.customer.trim(),
          electrician: newJob.electrician.trim(),
          service: newJob.service.trim(),
          location: newJob.location.trim(),
          status: newJob.status,
          date: newJob.date,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create job"
        );
      }

      setSuccessMessage(
        "Job created successfully."
      );

      // Reset form
      setNewJob(initialJob);

      // Close form
      setShowCreateForm(false);

      // Refresh jobs from MongoDB
      await fetchJobs();
    } catch (error) {
      console.error("Error creating job:", error);

      setError(
        error.message ||
          "Failed to create the job."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ================================
  // DELETE JOB
  // ================================
  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    clearMessages();

    try {
      setDeletingId(jobId);

      const response = await fetch(
        `${API_URL}/${jobId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete job"
        );
      }

      setJobs((previous) =>
        previous.filter(
          (job) => job._id !== jobId
        )
      );

      // Close modal if deleted job was open
      if (
        selectedJob &&
        selectedJob._id === jobId
      ) {
        setSelectedJob(null);
      }

      setSuccessMessage(
        "Job deleted successfully."
      );
    } catch (error) {
      console.error("Error deleting job:", error);

      setError(
        error.message ||
          "Failed to delete the job."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ================================
  // FILTER JOBS
  // ================================
  const filteredJobs = useMemo(() => {
    const searchValue = search
      .toLowerCase()
      .trim();

    return jobs.filter((job) => {
      const matchesSearch =
        !searchValue ||
        job.customer
          ?.toLowerCase()
          .includes(searchValue) ||
        job.electrician
          ?.toLowerCase()
          .includes(searchValue) ||
        job.service
          ?.toLowerCase()
          .includes(searchValue) ||
        job.location
          ?.toLowerCase()
          .includes(searchValue) ||
        job._id
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        job.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [jobs, search, statusFilter]);

  // ================================
  // STATISTICS
  // ================================
  const totalJobs = jobs.length;

  const pendingJobs = jobs.filter(
    (job) => job.status === "Pending"
  ).length;

  const scheduledJobs = jobs.filter(
    (job) => job.status === "Scheduled"
  ).length;

  const inProgressJobs = jobs.filter(
    (job) => job.status === "In Progress"
  ).length;

  const completedJobs = jobs.filter(
    (job) => job.status === "Completed"
  ).length;

  const cancelledJobs = jobs.filter(
    (job) => job.status === "Cancelled"
  ).length;

  // ================================
  // FORMAT DATE
  // ================================
  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
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

  // ================================
  // TEMPORARY JOB NUMBER
  // ================================
  const getJobNumber = (job, index) => {
    if (job.jobNumber) {
      return job.jobNumber;
    }

    return `JOB-${String(
      index + 1
    ).padStart(3, "0")}`;
  };

  // ================================
  // STATUS STYLE
  // ================================
  const getStatusClasses = (status) => {
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

  // ================================
  // RENDER
  // ================================
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ==================================
            HEADER
        ================================== */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-yellow-600">
              Xaaji Electronics
            </p>

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Jobs Management
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Manage electrical service jobs and assignments.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() => {
                clearMessages();
                fetchJobs();
              }}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                className={`h-5 w-5 ${
                  loading ? "animate-spin" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h5M20 20v-5h-5M5.64 18.36A9 9 0 1018.36 5.64L20 4"
                />
              </svg>

              Refresh
            </button>

            <button
              type="button"
              onClick={() => {
                clearMessages();
                setShowCreateForm(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-5 py-3 text-sm font-bold text-gray-900 shadow-sm transition hover:bg-yellow-400"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>

              Create Job
            </button>

          </div>
        </div>

        {/* ==================================
            ERROR MESSAGE
        ================================== */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-5 w-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>

              <div>
                <h3 className="font-semibold text-red-800">
                  Something went wrong
                </h3>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* ==================================
            SUCCESS MESSAGE
        ================================== */}
        {successMessage && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-start gap-3">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <div>
                <h3 className="font-semibold text-green-800">
                  Success
                </h3>

                <p className="mt-1 text-sm text-green-700">
                  {successMessage}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* ==================================
            STATISTICS
        ================================== */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

          {/* Total */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Jobs
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {totalJobs}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                <svg
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a3 3 0 006 0M9 5h6"
                  />
                </svg>
              </div>

            </div>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending
                </p>

                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {pendingJobs}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

            </div>
          </div>

          {/* Scheduled */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Scheduled
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {scheduledJobs}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

            </div>
          </div>

          {/* In Progress */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  In Progress
                </p>

                <p className="mt-2 text-3xl font-bold text-purple-600">
                  {inProgressJobs}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>

            </div>
          </div>

          {/* Completed */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {completedJobs}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

            </div>
          </div>

          {/* Cancelled */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Cancelled
                </p>

                <p className="mt-2 text-3xl font-bold text-red-600">
                  {cancelledJobs}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>

            </div>
          </div>

        </div>

        {/* ==================================
            SEARCH + FILTER
        ================================== */}
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Search */}
            <div className="relative flex-1">

              <svg
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                />
              </svg>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search customer, electrician, service or location..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-100"
              />

            </div>

            {/* Status */}
            <div className="flex items-center gap-3">

              <label
                htmlFor="statusFilter"
                className="text-sm font-semibold text-gray-600"
              >
                Status:
              </label>

              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
              >
                <option value="All">
                  All Statuses
                </option>

                <option value="Pending">
                  Pending
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

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>

            </div>

          </div>

        </div>

        {/* ==================================
            JOBS TABLE
        ================================== */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Service Jobs
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredJobs.length} job
                {filteredJobs.length !== 1
                  ? "s"
                  : ""}{" "}
                displayed
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                clearMessages();
                fetchJobs();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h5M20 20v-5h-5M5.64 18.36A9 9 0 1018.36 5.64L20 4"
                />
              </svg>

              Refresh Jobs
            </button>

          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center p-8">

              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-yellow-500"></div>

              <p className="mt-4 text-sm font-medium text-gray-500">
                Loading jobs from MongoDB...
              </p>

            </div>
          ) : filteredJobs.length === 0 ? (
            /* Empty */
            <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a3 3 0 006 0M9 5h6"
                  />
                </svg>
              </div>

              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No jobs found
              </h3>

              <p className="mt-2 max-w-md text-sm text-gray-500">
                {jobs.length === 0
                  ? "There are no jobs in your database yet. Create your first job to get started."
                  : "No jobs match your current search or status filter."}
              </p>

              {jobs.length === 0 && (
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setShowCreateForm(true);
                  }}
                  className="mt-5 rounded-xl bg-yellow-500 px-5 py-3 text-sm font-bold text-gray-900 transition hover:bg-yellow-400"
                >
                  Create First Job
                </button>
              )}

            </div>
          ) : (
            /* Table */
            <div className="overflow-x-auto">

              <table className="min-w-[1000px] w-full">

                <thead className="bg-gray-50">
                  <tr>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                      Job
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                      Electrician
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                      Service
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                      Location
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                      Date
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredJobs.map((job) => {
                    const originalIndex =
                      jobs.findIndex(
                        (item) =>
                          item._id === job._id
                      );

                    return (
                      <tr
                        key={job._id}
                        className="transition hover:bg-gray-50"
                      >

                        {/* Job */}
                        <td className="whitespace-nowrap px-5 py-4">

                          <div className="font-bold text-gray-900">
                            {getJobNumber(
                              job,
                              originalIndex
                            )}
                          </div>

                          <div className="mt-1 max-w-[140px] truncate text-xs text-gray-400">
                            ID: {job._id}
                          </div>

                        </td>

                        {/* Customer */}
                        <td className="px-5 py-4">

                          <div className="font-semibold text-gray-900">
                            {job.customer}
                          </div>

                        </td>

                        {/* Electrician */}
                        <td className="px-5 py-4">

                          <div className="font-medium text-gray-700">
                            {job.electrician}
                          </div>

                        </td>

                        {/* Service */}
                        <td className="px-5 py-4">

                          <div className="font-medium text-gray-700">
                            {job.service}
                          </div>

                        </td>

                        {/* Location */}
                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2 text-sm text-gray-600">

                            <svg
                              className="h-4 w-4 shrink-0 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                              />

                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>

                            {job.location}

                          </div>

                        </td>

                        {/* Date */}
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                          {formatDate(job.date)}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClasses(
                              job.status
                            )}`}
                          >
                            {job.status}
                          </span>

                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">

                          <div className="flex items-center justify-end gap-2">

                            {/* View */}
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedJob(job)
                              }
                              className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-100"
                            >
                              View
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteJob(
                                  job._id
                                )
                              }
                              disabled={
                                deletingId ===
                                job._id
                              }
                              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId ===
                              job._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </div>
      </div>

      {/* ==================================
          CREATE JOB MODAL
      ================================== */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-yellow-600">
                  Xaaji Electronics
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  Create New Job
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add a new electrical service job.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowCreateForm(false)
                }
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleCreateJob}
              className="p-5 sm:p-6"
            >

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Customer */}
                <div>
                  <label
                    htmlFor="customer"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Customer
                    <span className="text-red-500">
                      {" "}
                      *
                    </span>
                  </label>

                  <input
                    id="customer"
                    name="customer"
                    type="text"
                    value={newJob.customer}
                    onChange={handleInputChange}
                    placeholder="Enter customer name"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-100"
                  />
                </div>

                {/* Electrician */}
                <div>
                  <label
                    htmlFor="electrician"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Electrician
                    <span className="text-red-500">
                      {" "}
                      *
                    </span>
                  </label>

                  <input
                    id="electrician"
                    name="electrician"
                    type="text"
                    value={newJob.electrician}
                    onChange={handleInputChange}
                    placeholder="Enter electrician name"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-100"
                  />
                </div>

                {/* Service */}
                <div>
                  <label
                    htmlFor="service"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Service
                    <span className="text-red-500">
                      {" "}
                      *
                    </span>
                  </label>

                  <input
                    id="service"
                    name="service"
                    type="text"
                    value={newJob.service}
                    onChange={handleInputChange}
                    placeholder="e.g. Electrical Repair"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-100"
                  />
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Location
                    <span className="text-red-500">
                      {" "}
                      *
                    </span>
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={newJob.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Nairobi"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-100"
                  />
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="status"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Status
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={newJob.status}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-100"
                  >
                    <option value="Pending">
                      Pending
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

                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label
                    htmlFor="date"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Job Date
                    <span className="text-red-500">
                      {" "}
                      *
                    </span>
                  </label>

                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={newJob.date}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-100"
                  />
                </div>

              </div>

              {/* Form buttons */}
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => {
                    setNewJob(initialJob);
                    setShowCreateForm(false);
                  }}
                  disabled={submitting}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-yellow-500 px-6 py-3 text-sm font-bold text-gray-900 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Creating..."
                    : "Create Job"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ==================================
          VIEW JOB MODAL
      ================================== */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-yellow-600">
                  Job Details
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {selectedJob.jobNumber ||
                    "Service Job"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedJob(null)
                }
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

            </div>

            {/* Details */}
            <div className="space-y-4 p-5 sm:p-6">

              {/* Customer */}
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Customer
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {selectedJob.customer}
                </p>
              </div>

              {/* Electrician */}
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Electrician
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {selectedJob.electrician}
                </p>
              </div>

              {/* Service */}
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Service
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {selectedJob.service}
                </p>
              </div>

              {/* Location */}
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Location
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {selectedJob.location}
                </p>
              </div>

              {/* Date + Status */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Job Date
                  </p>

                  <p className="mt-1 font-bold text-gray-900">
                    {formatDate(
                      selectedJob.date
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClasses(
                      selectedJob.status
                    )}`}
                  >
                    {selectedJob.status}
                  </span>
                </div>

              </div>

              {/* MongoDB ID */}
              <div className="rounded-xl border border-dashed border-gray-200 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  MongoDB ID
                </p>

                <p className="mt-1 break-all font-mono text-xs text-gray-600">
                  {selectedJob._id}
                </p>
              </div>

            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 p-5 sm:flex-row sm:justify-end sm:p-6">

              <button
                type="button"
                onClick={() =>
                  setSelectedJob(null)
                }
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDeleteJob(
                    selectedJob._id
                  )
                }
                disabled={
                  deletingId ===
                  selectedJob._id
                }
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingId ===
                selectedJob._id
                  ? "Deleting..."
                  : "Delete Job"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminJobs;