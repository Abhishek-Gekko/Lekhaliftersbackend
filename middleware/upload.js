
const multer = require("multer");

// Store uploaded image temporarily in memory
const storage = multer.memoryStorage();

// Allow only JPG, JPEG, PNG and WebP
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPG, PNG and WebP images are allowed."),
      false
    );
  }
};

// Configure Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: fileFilter,
});

module.exports = upload;
