// ============================================================
// pages/UploadPage.jsx — Document Upload
// ============================================================
// Drag-and-drop or click-to-browse file upload with a
// progress indicator and success feedback.
// ============================================================

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadDocument } from "../services/api";
import Navbar from "../components/Navbar";

// Allowed file types
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "text/plain",
];

const ALLOWED_EXTENSIONS = ["PDF", "DOC", "DOCX", "JPG", "PNG", "TXT"];

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Handle file selection (from input or drop)
  const handleFileSelect = (selectedFile) => {
    setError("");
    setSuccess(false);

    // Validate file type
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError(`Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`);
      return;
    }

    // Validate file size (10 MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10 MB");
      return;
    }

    setFile(selectedFile);
  };

  // Drag-and-drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Upload the file
  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate upload progress (Axios onUploadProgress)
      await uploadDocument(formData, {
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        },
      });

      setProgress(100);
      setSuccess(true);
      setFile(null);

      // Navigate to documents page after a brief delay
      setTimeout(() => navigate("/documents"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Format file size
  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Document</h1>

        {/* ── Success Message ────────────────────────────── */}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Document uploaded successfully! Redirecting...
          </div>
        )}

        {/* ── Error Message ──────────────────────────────── */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {/* ── Drop Zone ──────────────────────────────────── */}
        <div
          id="drop-zone"
          className={`card p-8 border-2 border-dashed cursor-pointer transition-all duration-200 ${
            dragActive
              ? "border-primary-500 bg-primary-50"
              : file
              ? "border-green-300 bg-green-50/50"
              : "border-gray-200 hover:border-primary-300 hover:bg-primary-50/30"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            id="file-input"
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
            onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
          />

          <div className="text-center">
            {file ? (
              // ── Selected file preview ──────────────────
              <>
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-800">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">{formatSize(file.size)}</p>
                <p className="text-xs text-primary-500 mt-2">Click to change file</p>
              </>
            ) : (
              // ── Drop zone placeholder ──────────────────
              <>
                <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  Drag & drop your file here
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  or click to browse
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  {ALLOWED_EXTENSIONS.map((ext) => (
                    <span
                      key={ext}
                      className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium"
                    >
                      .{ext}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Max file size: 10 MB</p>
              </>
            )}
          </div>
        </div>

        {/* ── Upload Progress ────────────────────────────── */}
        {uploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">{progress}% uploaded</p>
          </div>
        )}

        {/* ── Upload Button ──────────────────────────────── */}
        {file && !uploading && !success && (
          <button
            id="upload-submit"
            onClick={handleUpload}
            className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Document
          </button>
        )}
      </main>
    </div>
  );
};

export default UploadPage;
