import adminFetch, { API_BASE_URL } from "../config/adminFetch";
import { useEffect, useMemo, useState } from "react";

const API_URL = `${API_BASE_URL}/api/reviews`;

function AdminReviews() {
  // ========================================
  // STATE
  // ========================================

  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  const [selectedReview, setSelectedReview] =
    useState(null);

  const [deletingId, setDeletingId] =
    useState(null);

  const [publishingId, setPublishingId] =
    useState(null);

  // ========================================
  // FETCH REVIEWS
  // ========================================

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminFetch(API_URL);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch reviews"
        );
      }

      if (Array.isArray(data)) {
        setReviews(data);
      } else if (Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      } else if (Array.isArray(data.data)) {
        setReviews(data.data);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error(
        "Error fetching reviews:",
        error
      );

      setReviews([]);

      setError(
        error.message ||
          "Unable to load reviews from the server."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOAD REVIEWS
  // ========================================

  useEffect(() => {
    fetchReviews();
  }, []);

  // ========================================
  // STATUS DISPLAY
  // ========================================

  const getDisplayStatus = (status) => {
    if (status === "Approved") {
      return "Published";
    }

    if (status === "Hidden") {
      return "Hidden";
    }

    return "Pending";
  };

  // ========================================
  // STATUS STYLE
  // ========================================

  const getStatusStyle = (status) => {
    const displayStatus =
      getDisplayStatus(status);

    if (displayStatus === "Published") {
      return "bg-green-100 text-green-700";
    }

    if (displayStatus === "Pending") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (displayStatus === "Hidden") {
      return "bg-gray-100 text-gray-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  // ========================================
  // RENDER STARS
  // ========================================

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(
          (star) => (
            <span
              key={star}
              className={
                star <= rating
                  ? "text-yellow-500"
                  : "text-gray-300"
              }
            >
              ★
            </span>
          )
        )}
      </div>
    );
  };

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {
    if (!date) {
      return "No date";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
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

  // ========================================
  // STATISTICS
  // ========================================

  const totalReviews = reviews.length;

  const publishedReviews =
    reviews.filter(
      (review) =>
        review.status === "Approved"
    ).length;

  const pendingReviews =
    reviews.filter(
      (review) =>
        review.status === "Pending"
    ).length;

  const averageRating = useMemo(() => {
    if (reviews.length === 0) {
      return "0.0";
    }

    const totalRating = reviews.reduce(
      (sum, review) =>
        sum +
        Number(review.rating || 0),
      0
    );

    return (
      totalRating / reviews.length
    ).toFixed(1);
  }, [reviews]);

  // ========================================
  // PUBLISH REVIEW
  // ========================================

  const handlePublish = async (
    reviewId
  ) => {
    try {
      setPublishingId(reviewId);
      setError("");
      setSuccessMessage("");

      const response = await adminFetch(
        `${API_URL}/${reviewId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status: "Approved",
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to publish review"
        );
      }

      setReviews((previous) =>
        previous.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                status: "Approved",
              }
            : review
        )
      );

      setSuccessMessage(
        "Review published successfully."
      );
    } catch (error) {
      console.error(
        "Error publishing review:",
        error
      );

      setError(
        error.message ||
          "Failed to publish review."
      );
    } finally {
      setPublishingId(null);
    }
  };

  // ========================================
  // HIDE REVIEW
  // ========================================

  const handleHide = async (
    reviewId
  ) => {
    try {
      setPublishingId(reviewId);
      setError("");
      setSuccessMessage("");

      const response = await adminFetch(
        `${API_URL}/${reviewId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status: "Hidden",
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to hide review"
        );
      }

      setReviews((previous) =>
        previous.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                status: "Hidden",
              }
            : review
        )
      );

      setSuccessMessage(
        "Review hidden successfully."
      );
    } catch (error) {
      console.error(
        "Error hiding review:",
        error
      );

      setError(
        error.message ||
          "Failed to hide review."
      );
    } finally {
      setPublishingId(null);
    }
  };

  // ========================================
  // DELETE REVIEW
  // ========================================

  const handleDelete = async (
    reviewId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this review?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(reviewId);
      setError("");
      setSuccessMessage("");

      const response = await adminFetch(
        `${API_URL}/${reviewId}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete review"
        );
      }

      setReviews((previous) =>
        previous.filter(
          (review) =>
            review._id !== reviewId
        )
      );

      if (
        selectedReview &&
        selectedReview._id === reviewId
      ) {
        setSelectedReview(null);
      }

      setSuccessMessage(
        "Review deleted successfully."
      );
    } catch (error) {
      console.error(
        "Error deleting review:",
        error
      );

      setError(
        error.message ||
          "Failed to delete review."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ========================================
  // RETURN
  // ========================================

  return (
    <div>
      {/* =====================================
          PAGE HEADER
      ====================================== */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-yellow-600">
            Management
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Reviews
          </h1>

          <p className="mt-2 text-gray-600">
            Monitor customer feedback and reviews.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchReviews}
          disabled={loading}
          className="w-fit rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Refreshing..."
            : "🔄 Refresh"}
        </button>

      </div>

      {/* =====================================
          ERROR
      ====================================== */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* =====================================
          SUCCESS
      ====================================== */}

      {successMessage && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-700">
            {successMessage}
          </p>
        </div>
      )}

      {/* =====================================
          STATISTICS
      ====================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {/* Total Reviews */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Total Reviews
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {loading
              ? "..."
              : totalReviews}
          </p>

        </div>

        {/* Average Rating */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Average Rating
          </p>

          <div className="mt-2 flex items-center gap-2">

            <p className="text-3xl font-bold text-gray-900">
              {loading
                ? "..."
                : averageRating}
            </p>

            <span className="text-yellow-500">
              ★
            </span>

          </div>

        </div>

        {/* Published */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Published
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {loading
              ? "..."
              : publishedReviews}
          </p>

        </div>

        {/* Pending */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Pending
          </p>

          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {loading
              ? "..."
              : pendingReviews}
          </p>

        </div>

      </div>

      {/* =====================================
          REVIEWS
      ====================================== */}

      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* Header */}

        <div className="border-b border-gray-200 p-6">

          <h2 className="text-lg font-bold text-gray-900">
            Customer Reviews
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Review customer feedback and manage published reviews.
          </p>

        </div>

        {/* Loading */}

        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-8">

            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-yellow-500"></div>

            <p className="mt-4 text-sm text-gray-500">
              Loading reviews from MongoDB...
            </p>

          </div>
        ) : reviews.length === 0 ? (
          /* Empty */

          <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
              ⭐
            </div>

            <h3 className="mt-4 text-lg font-bold text-gray-900">
              No reviews found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Customer reviews will appear here once they are submitted.
            </p>

          </div>
        ) : (
          /* Review List */

          <div className="divide-y divide-gray-100">

            {reviews.map(
              (review) => (
                <div
                  key={review._id}
                  className="p-6 transition hover:bg-gray-50"
                >

                  {/* Top */}

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                    <div className="flex items-start gap-4">

                      {/* Avatar */}

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-100 font-bold text-yellow-700">
                        {(
                          review.customer ||
                          "C"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      {/* Customer */}

                      <div>

                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="font-semibold text-gray-900">
                            {review.customer ||
                              "Unknown Customer"}
                          </h3>

                          <span className="text-xs text-gray-400">
                            {review._id}
                          </span>

                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                          Electrician:{" "}
                          {review.electrician ||
                            "Not assigned"}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Service:{" "}
                          {review.service ||
                            "Electrical Service"}
                        </p>

                      </div>

                    </div>

                    {/* Status */}

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        review.status
                      )}`}
                    >
                      {getDisplayStatus(
                        review.status
                      )}
                    </span>

                  </div>

                  {/* Rating */}

                  <div className="mt-5 flex items-center gap-3">

                    {renderStars(
                      Number(
                        review.rating || 0
                      )
                    )}

                    <span className="text-sm font-medium text-gray-700">
                      {review.rating}/5
                    </span>

                  </div>

                  {/* Comment */}

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">
                    "{review.comment}"
                  </p>

                  {/* Bottom */}

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-xs text-gray-400">
                      {formatDate(
                        review.createdAt
                      )}
                    </p>

                    <div className="flex flex-wrap gap-3">

                      {/* View */}

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedReview(
                            review
                          )
                        }
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-100"
                      >
                        View
                      </button>

                      {/* Publish */}

                      {review.status ===
                        "Pending" && (
                        <button
                          type="button"
                          onClick={() =>
                            handlePublish(
                              review._id
                            )
                          }
                          disabled={
                            publishingId ===
                            review._id
                          }
                          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {publishingId ===
                          review._id
                            ? "Publishing..."
                            : "Publish"}
                        </button>
                      )}

                      {/* Hide */}

                      {review.status ===
                        "Approved" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleHide(
                              review._id
                            )
                          }
                          disabled={
                            publishingId ===
                            review._id
                          }
                          className="rounded-lg border border-yellow-200 px-4 py-2 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {publishingId ===
                          review._id
                            ? "Updating..."
                            : "Hide"}
                        </button>
                      )}

                      {/* Delete */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            review._id
                          )
                        }
                        disabled={
                          deletingId ===
                          review._id
                        }
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId ===
                        review._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>

      {/* =====================================
          VIEW REVIEW MODAL
      ====================================== */}

      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-gray-200 p-6">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-yellow-600">
                  Review Details
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  Customer Review
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedReview(null)
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

            <div className="space-y-4 p-6">

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Customer
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {selectedReview.customer}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Electrician
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {selectedReview.electrician ||
                    "Not assigned"}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Service
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {selectedReview.service}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Rating
                </p>

                <div className="mt-2 flex items-center gap-3">

                  {renderStars(
                    Number(
                      selectedReview.rating ||
                        0
                    )
                  )}

                  <span className="font-semibold text-gray-700">
                    {
                      selectedReview.rating
                    }
                    /5
                  </span>

                </div>

              </div>

              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Comment
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  "{selectedReview.comment}"
                </p>

              </div>

              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      selectedReview.status
                    )}`}
                  >
                    {getDisplayStatus(
                      selectedReview.status
                    )}
                  </span>

                </div>

                <div className="text-right">

                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Date
                  </p>

                  <p className="mt-2 text-sm font-medium text-gray-700">
                    {formatDate(
                      selectedReview.createdAt
                    )}
                  </p>

                </div>

              </div>

            </div>

            {/* Footer */}

            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 p-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setSelectedReview(null)
                }
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Close
              </button>

              {selectedReview.status ===
                "Pending" && (
                <button
                  type="button"
                  onClick={() =>
                    handlePublish(
                      selectedReview._id
                    )
                  }
                  disabled={
                    publishingId ===
                    selectedReview._id
                  }
                  className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {publishingId ===
                  selectedReview._id
                    ? "Publishing..."
                    : "Publish Review"}
                </button>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminReviews;