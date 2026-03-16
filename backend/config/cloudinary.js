// ============================================================
// config/cloudinary.js — Cloudinary Configuration
// ============================================================
// Sets up the Cloudinary SDK with credentials from .env.
// Also configures Multer to use Cloudinary as the storage engine.
// ============================================================

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer storage to upload files directly to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "cloud-dms", // Cloudinary folder name
    // Allow common document and image formats
    allowed_formats: ["pdf", "doc", "docx", "jpg", "jpeg", "png", "txt"],
    // Use "raw" resource type for non-image files (PDF, DOC, TXT, etc.)
    resource_type: "auto",
  },
});

// Create the Multer upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max file size
  },
});

module.exports = { cloudinary, upload };
