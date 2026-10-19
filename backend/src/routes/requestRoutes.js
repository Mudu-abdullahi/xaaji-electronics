const express = require("express");

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

router.get("/", getRequests);

// =========================================================
// GET ONE SERVICE REQUEST
// =========================================================

router.get("/:id", getRequestById);

// =========================================================
// UPDATE SERVICE REQUEST
// =========================================================

router.put("/:id", updateRequest);

// =========================================================
// DELETE SERVICE REQUEST
// =========================================================

router.delete("/:id", deleteRequest);

module.exports = router;