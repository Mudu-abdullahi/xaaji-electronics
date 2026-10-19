const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const requestRoutes = require("./routes/requestRoutes");
const electricianRoutes = require("./routes/electricianRoutes");
const customerRoutes = require("./routes/customerRoutes");
const productRoutes = require("./routes/productRoutes");
const jobRoutes = require("./routes/jobRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

/*
  API Routes
*/

app.use("/api/requests", requestRoutes);
app.use("/api/electricians", electricianRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/settings", settingsRoutes);
/*
  Test Route
*/

app.get("/", (req, res) => {
  res.json({
    message: "Xaaji Electronics API is running",
  });
});

/*
  Start Server
*/

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});