const Customer = require("../models/Customer");

// =========================================================
// CREATE CUSTOMER / CONTACT MESSAGE
// =========================================================

const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully",
      data: customer,
    });
  } catch (error) {
    console.error("Create customer error:", error);

    res.status(400).json({
      success: false,
      message: "Failed to send your message",
      error: error.message,
    });
  }
};

// =========================================================
// GET ALL CUSTOMERS
// =========================================================

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    console.error("Get customers error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
      error: error.message,
    });
  }
};

// =========================================================
// GET ONE CUSTOMER
// =========================================================

const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error("Get customer error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch customer",
      error: error.message,
    });
  }
};

// =========================================================
// UPDATE CUSTOMER
// =========================================================

const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (error) {
    console.error("Update customer error:", error);

    res.status(400).json({
      success: false,
      message: "Failed to update customer",
      error: error.message,
    });
  }
};

// =========================================================
// DELETE CUSTOMER
// =========================================================

const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(
      req.params.id
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("Delete customer error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete customer",
      error: error.message,
    });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};