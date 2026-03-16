// ============================================================
// components/SearchBar.jsx — Document Search Input
// ============================================================
// A search bar with a debounce mechanism.
// Calls the onSearch callback 400ms after the user stops typing.
// ============================================================

import { useState, useEffect, useRef } from "react";

const SearchBar = ({ onSearch, placeholder = "Search documents..." }) => {
  const [query, setQuery] = useState("");
  const debounceTimer = useRef(null);

  // Debounced search: waits 400ms after last keystroke
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onSearch(query);
    }, 400);

    return () => clearTimeout(debounceTimer.current);
  }, [query, onSearch]);

  return (
    <div className="relative">
      {/* Search Icon */}
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      {/* Search Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-12 pr-4"
      />

      {/* Clear Button (shown when query is not empty) */}
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
