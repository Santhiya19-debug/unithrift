import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Product Card component
 * Displays product information in a card format
 */
const ProductCard = ({ product }) => {
  const { id, name, price, isFree, images, location, category, seller } = product;

  return (
    <Link to={`/product/${id}`} className="block">
      <div className="product-card h-full flex flex-col">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img 
            src={images[0]} 
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* Category Tag - Top Right */}
          <div className="absolute top-3 right-3">
            <span className="tag-category">
              {category}
            </span>
          </div>

          {/* Free/Paid Tag - Top Left */}
          {isFree ? (
            <div className="absolute top-3 left-3">
              <span className="tag-free">Free</span>
            </div>
          ) : null}
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-medium text-text-primary text-lg mb-2 line-clamp-2">
            {name}
          </h3>
          
          {/* Price */}
          <p className="text-2xl font-semibold text-green-dark mb-3">
            {isFree ? 'Free' : `₹${price.toLocaleString()}`}
          </p>

          {/* Location and Seller */}
          <div className="mt-auto space-y-1">
            <p className="text-sm text-text-secondary flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {location}
            </p>
            
            {seller.verified && (
              <p className="text-xs text-text-muted flex items-center gap-1">
                <svg className="w-3 h-3 text-verified-text" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified Seller
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;