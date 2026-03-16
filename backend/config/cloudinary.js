// ============================================================
// config/cloudinary.js — Cloudinary Configuration
// ============================================================
// Sets up the Cloudinary SDK with credentials from .env.
// Also configures Multer to use Cloudinary as the storage engine.
// ============================================================

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const path = require("path");

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// File extensions that Cloudinary treats as images
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "ico", "tiff"];

// Configure Multer storage to upload files directly to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname).replace(".", "").toLowerCase();
    const isImage = IMAGE_EXTENSIONS.includes(ext);

    return {
      folder: "cloud-dms",
      // Use "image" for image files, "raw" for everything else.
      // "raw" preserves the file byte-for-byte (PDF, DOCX, TXT, etc.)
      resource_type: isImage ? "image" : "raw",
      // Preserve original extension for raw files
      public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`,
      format: isImage ? ext : undefined,
    };
  },
});

// Create the Multer upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max file size
  },
});

module.exports = { cloudinary, upload, IMAGE_EXTENSIONS };
