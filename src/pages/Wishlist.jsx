import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/marketplace/ProductCard';
import Button from '../components/common/Button';
import { mockProducts } from '../data/mockProducts';

const Wishlist = () => {
  const navigate = useNavigate();
  // Mock wishlist - in real app, this would come from state/backend
  const [wishlistItems, setWishlistItems] = useState([
    mockProducts[0],
    mockProducts[2],
    mockProducts[4]
  ]);

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <div className="min-h-screen bg-off-white">
      <div className="container-custom py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-medium text-text-primary mb-2">
              My Wishlist
            </h1>
            <p className="text-text-secondary">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-text-muted hover:text-error transition-colors duration-card text-sm"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Wishlist Content */}
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlistItems.map(product => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} />
                
                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-card flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-card hover:bg-error hover:text-white"
                  aria-label="Remove from wishlist"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-sage bg-opacity-10 flex items-center justify-center">
              <svg className="w-12 h-12 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="font-heading text-2xl font-medium text-text-primary mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-text-secondary mb-6">
              Start adding items you like to keep track of them
            </p>
            <Button onClick={() => navigate('/')}>
              Browse Marketplace
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;