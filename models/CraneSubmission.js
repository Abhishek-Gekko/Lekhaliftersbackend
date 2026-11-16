
const mongoose = require("mongoose");

const craneSubmissionSchema = new mongoose.Schema(
  {
    // Customer details
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // Crane details
    craneBrand: {
      type: String,
      required: true,
      trim: true,
    },

    craneModel: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    // Uploaded image details
    imageUrl: {
      type: String,
      required: true,
    },

    imagePublicId: {
      type: String,
      required: true,
    },

    // Customer consent
    consentGiven: {
      type: Boolean,
      required: true,
      validate: {
        validator: (value) => value === true,
        message: "Customer consent is required.",
      },
    },

    consentTimestamp: {
      type: Date,
      required: true,
    },

    consentVersion: {
      type: String,
      required: true,
    },

    // Admin approval status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CraneSubmission",
  craneSubmissionSchema
);
