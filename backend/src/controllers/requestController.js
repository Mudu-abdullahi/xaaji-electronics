
const Request = require("../models/Request");
const Settings = require("../models/Settings");

// =========================================================
// CREATE SERVICE REQUEST
// =========================================================

const createRequest = async (req, res) => {
  try {
    // 1. Get business settings
    let settings = await Settings.findOne();

    // 2. Create default settings if none exist
    if (!settings) {
      settings = await Settings.create({});
    }

    // 3. Check whether the business accepts service requests
    if (!settings.acceptingRequests) {
      return res.status(503).json({
        success: false,
        message:
          "We are currently not accepting service requests. Please try again later.",
      });
    }

    // 4. Create the service request when accepting requests
    const request = await Request.create(req.body);

    res.status(201).json({
      success: true,
      message: "Service request submitted successfully",
      data: request,
    });
  } catch (error) {
    console.error("Create request error:", error);

    res.status(400).json({
      success: false,
      message: "Failed to create service request",
      error: error.message,
    });
  }
};

// =========================================================
// GET ALL SERVICE REQUESTS
// =========================================================

const getRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate(
        "assignedElectrician",
        "name phone location specialization profileImage"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error("Get requests error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch service requests",
      error: error.message,
    });
  }
};

// =========================================================
// GET ONE SERVICE REQUEST
// =========================================================

const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate(
      "assignedElectrician",
      "name phone location specialization profileImage"
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Get request error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch service request",
      error: error.message,
    });
  }
};

// =========================================================
// UPDATE SERVICE REQUEST
// =========================================================

const updateRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate(
      "assignedElectrician",
      "name phone location specialization profileImage"
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service request updated successfully",
      data: request,
    });
  } catch (error) {
    console.error("Update request error:", error);

    res.status(400).json({
      success: false,
      message: "Failed to update service request",
      error: error.message,
    });
  }
};

// =========================================================
// DELETE SERVICE REQUEST
// =========================================================

const deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service request deleted successfully",
    });
  } catch (error) {
    console.error("Delete request error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete service request",
      error: error.message,
    });
  }
};

// =========================================================
// EXPORT CONTROLLERS
// =========================================================

module.exports = {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
};
