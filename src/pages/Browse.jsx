import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/marketplace/ProductCard';
import { categories } from '../data/mockProducts';

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryQuery = searchParams.get('category') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false); // For mobile filter drawer

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        if (data.success) {
          // Filter by category if one is selected from Home page
          const filtered = categoryQuery 
            ? data.products.filter(p => p.category === categoryQuery)
            : data.products;
          setProducts(filtered);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchItems();
  }, [categoryQuery]);

  return (
    <div className="min-h-screen bg-[#F7F9F7] py-8 md:py-12">
      <div className="container-custom px-4">
        
        {/* Header with Filter Icon */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-4xl font-heading font-medium text-text-primary">
              {categoryQuery ? categoryQuery : 'All Listings'}
            </h1>
            <p className="text-xs text-text-secondary uppercase tracking-widest mt-1">
              {products.length} items found
            </p>
          </div>
          
          {/* FILTER ICON BUTTON */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 text-sm font-bold text-sage hover:bg-[#F0F4F0] transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
        </div>

        {/* Quick Category Chips (Aesthetic Horizontal Scroll) */}
        <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
          {['All', ...categories.map(c => c.name)].map(cat => (
            <button
              key={cat}
              onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat })}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                (categoryQuery === cat || (cat === 'All' && !categoryQuery))
                ? 'bg-sage text-white border-sage'
                : 'bg-white text-gray-500 border-gray-200 hover:border-sage'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid - PC Style even on Mobile (2 columns) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 mt-10">
            <p className="text-gray-400 italic">No items found in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;