import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/marketplace/ProductCard';
import CategoryCard from '../components/marketplace/CategoryCard';
import SearchBar from '../components/marketplace/SearchBar';
import FilterPanel from '../components/marketplace/FilterPanel';
import Button from '../components/common/Button';
import { mockProducts, categories } from '../data/mockProducts';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    price: 'all',
    location: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...mockProducts];

    // Search
    if (searchQuery.trim()) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    if (filters.price === 'free') {
      filtered = filtered.filter(p => p.isFree);
    } else if (filters.price === 'paid') {
      filtered = filtered.filter(p => !p.isFree);
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(p => p.location === filters.location);
    }

    // Sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => {
        if (a.isFree) return -1;
        if (b.isFree) return 1;
        return a.price - b.price;
      });
    }

    setProducts(filtered);
  }, [searchQuery, filters, sortBy]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      price: 'all',
      location: ''
    });
    setSearchQuery('');
  };

  const handleCategoryClick = (categoryName) => {
    setFilters(prev => ({
      ...prev,
      category: categoryName
    }));
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-off-white">
      {/* Hero Section */}
      <section className="bg-sage">
        <div className="container-custom py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div className="text-white space-y-6">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium text-balance">
                Buy. Sell. Thrive.
              </h1>
              <p className="text-lg md:text-xl text-white opacity-90">
                Your campus marketplace for pre-loved essentials. From textbooks to furniture, find everything you need from fellow students.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => navigate('/sell')} className="bg-green-dark hover:bg-green-hover">
                  Start Selling
                </Button>
                <Button 
                  variant="secondary" 
                  className="border-white text-white hover:bg-white hover:bg-opacity-10"
                  onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                >
                  Browse Items
                </Button>
              </div>
            </div>

            {/* Right - Image placeholder */}
            <div className="hidden md:block">
              <div className="aspect-square rounded-lg bg-sage-muted bg-opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-spacing">
        <div className="container-custom">
          <h2 className="font-heading text-3xl font-medium text-text-primary mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, index) => {
              const bgColors = ['bg-sage-muted', 'bg-sage', 'bg-off-white'];
              return (
                <CategoryCard 
                  key={cat.id} 
                  category={cat}
                  bgColor={bgColors[index % bgColors.length]}
                  onClick={() => handleCategoryClick(cat.name)}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Search and Products Section */}
      <section className="section-spacing">
        <div className="container-custom">
          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters - Desktop Sidebar */}
            <aside className="hidden lg:block lg:w-64 flex-shrink-0">
              <FilterPanel 
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </aside>

            {/* Main Content */}
            <div className="flex-grow">
              {/* Mobile Filter Toggle + Sort */}
              <div className="flex items-center justify-between mb-6">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden btn-secondary flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-3">
                  <label className="text-sm text-text-secondary hidden sm:block">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="input-field py-2 w-auto"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                  </select>
                </div>
              </div>

              {/* Mobile Filters */}
              {showFilters && (
                <div className="lg:hidden mb-6">
                  <FilterPanel 
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              )}

              {/* Results Count */}
              <p className="text-text-secondary mb-4">
                {products.length} {products.length === 1 ? 'item' : 'items'} found
              </p>

              {/* Product Grid */}
              {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-text-secondary text-lg mb-4">No products found</p>
                  <Button onClick={handleClearFilters}>Clear Filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;