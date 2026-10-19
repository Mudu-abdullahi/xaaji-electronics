const express = require("express");

const {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const router = express.Router();

// ========================================
// GET ALL REVIEWS
// GET /api/reviews
// ========================================

router.get("/", getReviews);

// ========================================
// GET ONE REVIEW
// GET /api/reviews/:id
// ========================================

router.get("/:id", getReviewById);

// ========================================
// CREATE REVIEW
// POST /api/reviews
// ========================================

router.post("/", createReview);

// ========================================
// UPDATE REVIEW
// PUT /api/reviews/:id
// ========================================

router.put("/:id", updateReview);

// ========================================
// DELETE REVIEW
// DELETE /api/reviews/:id
// ========================================

router.delete("/:id", deleteReview);

module.exports = router;