
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Existing models
const Enquiry = require("./models/Enquiry");
const Quotation = require("./models/Quotation");

// Crane submission imports
const upload = require("./middleware/upload");
const {
  submitCrane,
  getApprovedCranes,
} = require("./controllers/craneController");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Lekha Lifters backend is running");
});

// MongoDB connection
mongoose
  .connect(process.env.MONG_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB:", error);
  });

// ===================================
// EXISTING ENQUIRY API
// ===================================

app.post("/api/enquiries", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const newEnquiry = new Enquiry({
      name,
      email,
      phone,
      message,
    });

    await newEnquiry.save();

    res.status(201).json({
      success: true,
      message: "Sent successfully",
    });
  } catch (error) {
    console.log("Failed to save enquiry:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send",
    });
  }
});

// ===================================
// EXISTING QUOTATION API
// ===================================

app.post("/api/quotation", async (req, res) => {
  try {
    const {
      Customername,
      phone,
      email,
      brand,
      model,
      Companyname,
      Quantity,
      requirements,
    } = req.body;

    const newQuotation = new Quotation({
      Customername,
      phone,
      email,
      brand,
      model,
      Companyname,
      Quantity,
      requirements,
    });

    await newQuotation.save();

    res.status(201).json({
      success: true,
      message: "Sent successfully",
    });
  } catch (error) {
    console.log("Failed to send quotation:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send",
    });
  }
});

// ===================================
// NEW CRANE SUBMISSION API
// ===================================

// Customer submits crane with image
app.post(
  "/api/cranes/submit",
  upload.single("image"),
  submitCrane
);

// Website displays only approved cranes
app.get("/api/cranes/approved", getApprovedCranes);

// ===================================
// ERROR HANDLING
// ===================================

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(400).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

// ===================================
// START SERVER
// ===================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
