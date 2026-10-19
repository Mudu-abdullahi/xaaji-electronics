
const Job = require("../models/Job");

// =========================
// GET ALL JOBS
// =========================

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

// =========================
// GET SINGLE JOB
// =========================

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Error fetching job:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch job",
      error: error.message,
    });
  }
};

// =========================
// CREATE JOB
// =========================

const createJob = async (req, res) => {
  try {
    const {
      customer,
      electrician,
      service,
      location,
      status,
      date,
    } = req.body;

    if (
      !customer ||
      !electrician ||
      !service ||
      !location ||
      !date
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required job information",
      });
    }

    const job = await Job.create({
      customer,
      electrician,
      service,
      location,
      status: status || "Pending",
      date,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Error creating job:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: error.message,
    });
  }
};

// =========================
// UPDATE JOB
// =========================

const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error("Error updating job:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update job",
      error: error.message,
    });
  }
};

// =========================
// DELETE JOB
// =========================

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete job",
      error: error.message,
    });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
