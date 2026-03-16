// ============================================================
// models/Document.js — Document Schema
// ============================================================
// Defines the MongoDB schema for uploaded documents.
// Each document stores metadata + a reference to its Cloudinary URL.
// ============================================================

const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  // Original file name chosen by the user
  fileName: {
    type: String,
    required: [true, "File name is required"],
    trim: true,
  },

  // Cloudinary URL where the file is stored
  fileURL: {
    type: String,
    required: [true, "File URL is required"],
  },

  // File type / extension (e.g., "pdf", "jpg")
  fileType: {
    type: String,
    required: true,
  },

  // File size in bytes
  fileSize: {
    type: Number,
    default: 0,
  },

  // Cloudinary public_id (needed for deletion)
  cloudinaryId: {
    type: String,
    required: true,
  },

  // Reference to the user who uploaded this document
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Upload timestamp
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Document", documentSchema);
