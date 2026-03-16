// ============================================================
// controllers/documentController.js — Document Handlers
// ============================================================
// Handles uploading, listing, downloading, deleting,
// and searching documents.
// ============================================================

const Document = require("../models/Document");
const { cloudinary } = require("../config/cloudinary");

// ── POST /api/documents/upload ─────────────────────────────
// Upload a file to Cloudinary and save metadata to MongoDB
const uploadDocument = async (req, res) => {
  try {
    // Multer + Cloudinary have already uploaded the file at this point
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select a file.",
      });
    }

    // Extract file extension from the original name
    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();

    // Create a new document record in MongoDB
    const document = await Document.create({
      fileName: req.file.originalname,
      fileURL: req.file.path, // Cloudinary URL
      fileType: fileExtension,
      fileSize: req.file.size || 0,
      cloudinaryId: req.file.filename, // Cloudinary public_id
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during file upload",
    });
  }
};

// ── GET /api/documents?search=keyword ──────────────────────
// Get all documents for the logged-in user, with optional search
const getDocuments = async (req, res) => {
  try {
    const { search } = req.query;

    // Build the query — always filter by the current user
    let query = { userId: req.user._id };

    // If a search term is provided, filter by fileName (case-insensitive)
    if (search) {
      query.fileName = { $regex: search, $options: "i" };
    }

    // Fetch documents sorted by newest first
    const documents = await Document.find(query).sort({ uploadDate: -1 });

    res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    console.error("Get documents error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching documents",
    });
  }
};

// ── GET /api/documents/download/:id ────────────────────────
// Return the Cloudinary URL for a specific document
const downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    // Check if document exists
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Ensure the document belongs to the current user
    if (document.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this document",
      });
    }

    res.status(200).json({
      success: true,
      fileName: document.fileName,
      fileURL: document.fileURL,
    });
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while downloading document",
    });
  }
};

// ── DELETE /api/documents/:id ──────────────────────────────
// Delete a document from Cloudinary and MongoDB
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    // Check if document exists
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Ensure the document belongs to the current user
    if (document.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this document",
      });
    }

    // Remove the file from Cloudinary
    // Use "raw" resource_type for non-image files
    const resourceType = ["jpg", "jpeg", "png"].includes(document.fileType)
      ? "image"
      : "raw";

    await cloudinary.uploader.destroy(document.cloudinaryId, {
      resource_type: resourceType,
    });

    // Remove the document record from MongoDB
    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting document",
    });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  downloadDocument,
  deleteDocument,
};
