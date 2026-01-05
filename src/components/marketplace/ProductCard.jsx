import React from 'react';
import { Link } from 'react-router-dom';
import WishlistButton from '../common/WishlistButton'; // Import the new button

/**
 * Product Card component
 * Integrated with Wishlist functionality
 */
const ProductCard = ({ product, isWishlisted, onWishlistUpdate }) => {
  // Destructure with safe fallbacks
  const { 
    id, 
    title, 
    name, 
    price = 0, 
    isFree = false, 
    images = [], 
    location = 'N/A', 
    category = 'General', 
    seller = {} 
  } = product;

  const productId = id || product._id;
  const displayTitle = title || name || 'Untitled Product';
  const displayImage = images && images.length > 0 
    ? images[0] 
    : 'https://via.placeholder.com/400?text=No+Image';

  return (
    <div className="relative group transition-transform hover:scale-[1.02]">
      {/* 1. WISHLIST BUTTON (Layered on top of the Link) */}
      <div className="absolute top-3 left-3 z-20">
        <WishlistButton 
          productId={productId} 
          initialIsWishlisted={isWishlisted} 
          onUpdate={onWishlistUpdate}
        />
      </div>

      <Link to={`/product/${productId}`} className="block h-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden">
          
          {/* Product Image Area */}
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            <img 
              src={displayImage} 
              alt={displayTitle}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Image+Error'; }}
            />
            
            {/* Category Tag */}
            <div className="absolute top-2 right-2">
              <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-gray-700 shadow-sm border border-gray-100">
                {category}
              </span>
            </div>

            {/* Free Badge */}
            {isFree && (
              <div className="absolute bottom-2 left-2">
                <span className="bg-emerald-600 text-white px-2 py-1 rounded-md text-[10px] font-bold uppercase shadow-sm">
                  Free
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-2">
              {displayTitle}
            </h3>
            
            <p className="text-xl font-bold text-emerald-700 mb-3">
              {isFree ? 'Free' : `₹${Number(price).toLocaleString()}`}
            </p>

            <div className="mt-auto space-y-2">
              <div className="flex items-center gap-1.5 text-gray-500">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs truncate">{location}</span>
              </div>
              
              {(seller?.isVerified || seller?.verified) && (
                <div className="flex items-center gap-1 text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[10px] font-bold">Verified Seller</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;