
const express = require("express");
const requireAdmin = require("../middleware/authMiddleware");

const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const router = express.Router();

router.use(requireAdmin);

// GET all jobs
router.get("/", getJobs);

// GET one job
router.get("/:id", getJobById);

// CREATE job
router.post("/", createJob);

// UPDATE job
router.put("/:id", updateJob);

// DELETE job
router.delete("/:id", deleteJob);

module.exports = router;
