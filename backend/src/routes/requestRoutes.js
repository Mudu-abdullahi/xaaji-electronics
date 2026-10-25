const express = require("express");
const requireAdmin = require("../middleware/authMiddleware");

const {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
} = require("../controllers/requestController");

const router = express.Router();

// =========================================================
// CREATE SERVICE REQUEST
// =========================================================

router.post("/", createRequest);

// =========================================================
// GET ALL SERVICE REQUESTS
// =========================================================

router.get("/", requireAdmin, getRequests);

// =========================================================
// GET ONE SERVICE REQUEST
// =========================================================

router.get("/:id", requireAdmin, getRequestById);

// =========================================================
// UPDATE SERVICE REQUEST
// =========================================================

router.put("/:id", requireAdmin, updateRequest);

// =========================================================
// DELETE SERVICE REQUEST
// =========================================================

router.delete("/:id", requireAdmin, deleteRequest);

module.exports = router;