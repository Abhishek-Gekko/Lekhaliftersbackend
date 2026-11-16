
const CraneSubmission = require("../models/CraneSubmission");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

// Upload image buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "lekha-lifters/customer-cranes",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

// POST: Submit a crane
const submitCrane = async (req, res) => {
  let uploadedImage;

  try {
    const {
      customerName,
      companyName,
      email,
      craneBrand,
      craneModel,
      location,
      message,
      consentGiven,
    } = req.body;

    // Validate required fields
    if (
      !customerName ||
      !companyName ||
      !email ||
      !craneBrand ||
      !craneModel
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Validate consent
    if (consentGiven !== "true") {
      return res.status(400).json({
        success: false,
        message: "Customer consent is required.",
      });
    }

    // Validate image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a crane image.",
      });
    }

    // Upload image to Cloudinary
    uploadedImage = await uploadToCloudinary(req.file.buffer);

    // Save submission in MongoDB
    const newCrane = await CraneSubmission.create({
      customerName: customerName.trim(),
      companyName: companyName.trim(),
      email: email.trim().toLowerCase(),
      craneBrand: craneBrand.trim(),
      craneModel: craneModel.trim(),
      location: location?.trim() || "",
      message: message?.trim() || "",

      imageUrl: uploadedImage.secure_url,
      imagePublicId: uploadedImage.public_id,

      consentGiven: true,
      consentTimestamp: new Date(),
      consentVersion: "v1.0-2026",

      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Crane submitted successfully. It is awaiting admin approval.",
      crane: {
        id: newCrane._id,
        status: newCrane.status,
      },
    });
  } catch (error) {
    console.error("Crane submission error:", error);

    // Remove uploaded image if MongoDB save fails
    if (uploadedImage?.public_id) {
      try {
        await cloudinary.uploader.destroy(uploadedImage.public_id);
      } catch (cleanupError) {
        console.error("Cloudinary cleanup error:", cleanupError);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Unable to submit crane. Please try again.",
    });
  }
};

// GET: Fetch only approved cranes
const getApprovedCranes = async (req, res) => {
  try {
    const cranes = await CraneSubmission.find({
      status: "approved",
    })
      .select(
        "customerName companyName craneBrand craneModel location message imageUrl createdAt"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: cranes.length,
      cranes,
    });
  } catch (error) {
    console.error("Fetch cranes error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch cranes.",
    });
  }
};

module.exports = {
  submitCrane,
  getApprovedCranes,
};
