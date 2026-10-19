const Service = require("../models/Service");

// CREATE SERVICE
const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    console.error("Create service error:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to create service",
      error: error.message,
    });
  }
};

// GET ALL SERVICES
const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error("Get services error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error: error.message,
    });
  }
};

// GET ONE SERVICE
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error("Get service error:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to fetch service",
      error: error.message,
    });
  }
};

// UPDATE SERVICE
const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    console.error("Update service error:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to update service",
      error: error.message,
    });
  }
};

// DELETE SERVICE
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      data: service,
    });
  } catch (error) {
    console.error("Delete service error:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to delete service",
      error: error.message,
    });
  }
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};