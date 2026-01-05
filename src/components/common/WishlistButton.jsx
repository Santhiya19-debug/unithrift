import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const WishlistButton = ({ productId, initialIsWishlisted, onUpdate }) => {
  const { token, isAuthenticated } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);

  const toggleWishlist = async (e) => {
    e.preventDefault(); // Prevents clicking the heart from opening the product page
    if (!isAuthenticated) return alert("Please login to save items!");

    try {
      const res = await fetch(`http://localhost:5000/api/wishlist/toggle/${productId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setIsWishlisted(data.isWishlisted);
        if (onUpdate) onUpdate(); 
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  return (
    <button onClick={toggleWishlist} className="p-2 rounded-full bg-white shadow-sm border border-gray-100">
      <svg 
        className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
};

export default WishlistButton;