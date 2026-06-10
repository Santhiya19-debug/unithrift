import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/marketplace/ProductCard';
import { categories } from '../data/mockProducts';

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get both Category and Search queries from the URL
  const categoryQuery = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        
        if (data.success) {
          let filtered = data.products;

          // 1. Filter by Category
          if (categoryQuery) {
            filtered = filtered.filter(p => p.category === categoryQuery);
          }

          // 2. Filter by Search Query (Title or Description)
          if (searchQuery) {
            const term = searchQuery.toLowerCase();
            filtered = filtered.filter(p => 
              p.name.toLowerCase().includes(term) || 
              p.description.toLowerCase().includes(term)
            );
          }

          setProducts(filtered);
        }
      } catch (err) { 
        console.error("Fetch Error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchItems();
  }, [categoryQuery, searchQuery]); // Re-run when category OR search changes

  return (
    <div className="min-h-screen bg-[#F7F9F7] py-8 md:py-12 relative overflow-x-hidden">
      <div className="container-custom px-4">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-4xl font-heading font-medium text-text-primary">
              {searchQuery ? `Results for "${searchQuery}"` : (categoryQuery ? categoryQuery : 'All Listings')}
            </h1>
            <p className="text-xs text-text-secondary uppercase tracking-widest mt-1">
              {products.length} items found
            </p>
          </div>
          
          {/* FILTER ICON BUTTON */}
          <button 
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-gray-100 shadow-sm text-sm font-bold text-sage hover:bg-[#F0F4F0] transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
        </div>

        {/* Quick Category Chips */}
        <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
          {['All', ...categories.map(c => c.name)].map(cat => (
            <button
              key={cat}
              onClick={() => {
                // Keep search query if it exists, only change category
                const newParams = {};
                if (cat !== 'All') newParams.category = cat;
                if (searchQuery) newParams.search = searchQuery;
                setSearchParams(newParams);
              }}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                (categoryQuery === cat || (cat === 'All' && !categoryQuery))
                ? 'bg-sage text-white border-sage shadow-md'
                : 'bg-white text-gray-500 border-gray-100 hover:border-sage'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
          {loading ? (
            // Simple Loading Skeleton
            [...Array(10)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse aspect-[3/4] rounded-2xl"></div>
            ))
          ) : (
            products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>

        {!loading && products.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[2.5rem] border border-dashed border-gray-200 mt-10 shadow-inner">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-400 italic">No items match your search or category.</p>
            <button 
               onClick={() => setSearchParams({})}
               className="mt-4 text-sage font-bold text-xs uppercase underline tracking-widest"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* --- FILTER SIDEBAR DRAWER --- */}
      <div className={`fixed inset-0 z-[100] transition-all duration-300 ${showFilters ? 'visible' : 'invisible'}`}>
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${showFilters ? 'opacity-100' : 'opacity-0'}`} 
            onClick={() => setShowFilters(false)}
          />
          
          {/* Sidebar Panel */}
          <div className={`absolute right-0 top-0 h-full w-full max-w-xs bg-white shadow-2xl transition-transform duration-300 transform ${showFilters ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-heading font-bold text-sage italic">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-8">
              {/* Category Filter in Sidebar */}
              <div>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Jump to Category</h3>
                <div className="grid grid-cols-1 gap-2">
                  {categories.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => {
                        setSearchParams({ category: cat.name });
                        setShowFilters(false);
                      }}
                      className={`text-left px-4 py-3 rounded-xl text-sm transition-all ${categoryQuery === cat.name ? 'bg-sage/10 text-sage font-bold' : 'hover:bg-gray-50'}`}
                    >
                      {cat.icon} <span className="ml-2">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Add more filters here like Price, Condition, etc. */}
            </div>

            <div className="p-6 border-t border-gray-50">
               <button 
                onClick={() => { setSearchParams({}); setShowFilters(false); }}
                className="w-full py-4 border border-sage text-sage rounded-full text-xs font-bold uppercase tracking-widest hover:bg-sage hover:text-white transition-all"
               >
                 Reset All
               </button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Browse;