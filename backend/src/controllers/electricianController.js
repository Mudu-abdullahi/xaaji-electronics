const Electrician = require("../models/Electrician");

// Get all electricians
const getElectricians = async (req, res) => {
  try {
    const electricians = await Electrician.find();

    res.status(200).json({
      success: true,
      count: electricians.length,
      data: electricians,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch electricians",
      error: error.message,
    });
  }
};

// Get one electrician
const getElectricianById = async (req, res) => {
  try {
    const electrician = await Electrician.findById(req.params.id);

    if (!electrician) {
      return res.status(404).json({
        success: false,
        message: "Electrician not found",
      });
    }

    res.status(200).json({
      success: true,
      data: electrician,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch electrician",
      error: error.message,
    });
  }
};

// Create electrician
const createElectrician = async (req, res) => {
  try {
    const electrician = await Electrician.create(req.body);

    res.status(201).json({
      success: true,
      message: "Electrician created successfully",
      data: electrician,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create electrician",
      error: error.message,
    });
  }
};

// Update electrician
const updateElectrician = async (req, res) => {
  try {
    const electrician = await Electrician.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!electrician) {
      return res.status(404).json({
        success: false,
        message: "Electrician not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Electrician updated successfully",
      data: electrician,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update electrician",
      error: error.message,
    });
  }
};

// Delete electrician
const deleteElectrician = async (req, res) => {
  try {
    const electrician = await Electrician.findByIdAndDelete(
      req.params.id
    );

    if (!electrician) {
      return res.status(404).json({
        success: false,
        message: "Electrician not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Electrician deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete electrician",
      error: error.message,
    });
  }
};

module.exports = {
  getElectricians,
  getElectricianById,
  createElectrician,
  updateElectrician,
  deleteElectrician,
};