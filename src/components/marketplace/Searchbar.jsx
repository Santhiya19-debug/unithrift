import React from 'react';

/**
 * Search Bar component
 * Handles product search functionality
 */
const SearchBar = ({ searchQuery, onSearchChange, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-field pr-12"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sage hover:text-green-dark transition-colors duration-card"
          aria-label="Search"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;