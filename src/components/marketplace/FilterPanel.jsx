import React from 'react';
import { categories, locations } from '../../data/mockProducts';

/**
 * Filter Panel component
 * Provides filtering options for products
 */
const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onClearFilters 
}) => {
  const handleCategoryChange = (categoryName) => {
    onFilterChange('category', categoryName);
  };

  const handlePriceChange = (priceFilter) => {
    onFilterChange('price', priceFilter);
  };

  const handleLocationChange = (location) => {
    onFilterChange('location', location);
  };

  const hasActiveFilters = filters.category || filters.price || filters.location;

  return (
    <div className="bg-white rounded-lg shadow-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-xl font-medium text-text-primary">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-sage hover:text-green-dark transition-colors duration-card"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Price Filter */}
      <div>
        <h4 className="font-medium text-text-primary mb-3">Price</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="price"
              checked={filters.price === 'all'}
              onChange={() => handlePriceChange('all')}
              className="text-sage focus:ring-sage"
            />
            <span className="text-text-secondary">All Items</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="price"
              checked={filters.price === 'free'}
              onChange={() => handlePriceChange('free')}
              className="text-sage focus:ring-sage"
            />
            <span className="text-text-secondary">Free Only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="price"
              checked={filters.price === 'paid'}
              onChange={() => handlePriceChange('paid')}
              className="text-sage focus:ring-sage"
            />
            <span className="text-text-secondary">Paid Only</span>
          </label>
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="font-medium text-text-primary mb-3">Category</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={!filters.category}
              onChange={() => handleCategoryChange('')}
              className="text-sage focus:ring-sage"
            />
            <span className="text-text-secondary">All Categories</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat.name}
                onChange={() => handleCategoryChange(cat.name)}
                className="text-sage focus:ring-sage"
              />
              <span className="text-text-secondary">{cat.icon} {cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <h4 className="font-medium text-text-primary mb-3">Location</h4>
        <select
          value={filters.location || ''}
          onChange={(e) => handleLocationChange(e.target.value)}
          className="input-field"
        >
          <option value="">All Locations</option>
          {locations.map((loc, index) => (
            <option key={index} value={loc}>{loc}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;