const Review = require("../models/Review");

// ========================================
// GET ALL REVIEWS
// ========================================

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

// ========================================
// GET ONE REVIEW
// ========================================

const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(
      req.params.id
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error(
      "Error fetching review:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch review",
      error: error.message,
    });
  }
};

// ========================================
// CREATE REVIEW
// ========================================

const createReview = async (req, res) => {
  try {
    const {
      customer,
      rating,
      comment,
      service,
      electrician,
      status,
    } = req.body;

    // Required fields
    if (
      !customer ||
      !rating ||
      !comment ||
      !service
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide customer, rating, comment and service",
      });
    }

    // Validate rating
    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message:
          "Rating must be between 1 and 5",
      });
    }

    const review = await Review.create({
      customer,
      rating,
      comment,
      service,
      electrician: electrician || "",
      status: status || "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.error(
      "Error creating review:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create review",
      error: error.message,
    });
  }
};

// ========================================
// UPDATE REVIEW
// ========================================

const updateReview = async (req, res) => {
  try {
    const review =
      await Review.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error(
      "Error updating review:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};

// ========================================
// DELETE REVIEW
// ========================================

const deleteReview = async (req, res) => {
  try {
    const review =
      await Review.findByIdAndDelete(
        req.params.id
      );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error(
      "Error deleting review:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};

module.exports = {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};