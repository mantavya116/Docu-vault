// ============================================================
// components/Navbar.jsx — Navigation Bar
// ============================================================
// Shows the app logo, navigation links, and a logout button.
// Uses a gradient background with glass morphism effect.
// ============================================================

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Helper to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ──────────────────────────────────────── */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              DocuVault
            </span>
          </Link>

          {/* ── Navigation Links ──────────────────────────── */}
          <div className="hidden sm:flex items-center gap-1">
            {[
              { to: "/dashboard", label: "Dashboard" },
              { to: "/upload", label: "Upload" },
              { to: "/documents", label: "Documents" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── User Info & Logout ────────────────────────── */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </div>
            <button
              onClick={logout}
              className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>

        {/* ── Mobile Navigation ──────────────────────────── */}
        <div className="sm:hidden flex items-center gap-1 pb-3 -mt-1">
          {[
            { to: "/dashboard", label: "Dashboard" },
            { to: "/upload", label: "Upload" },
            { to: "/documents", label: "Documents" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex-1 text-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                isActive(link.to)
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
