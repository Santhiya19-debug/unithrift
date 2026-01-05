import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/marketplace/ProductCard';

const Wishlist = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the list of saved items from the backend
    const fetchWishlist = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/wishlist', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setItems(data.wishlist);
        }
      } catch (err) {
        console.error("Error loading wishlist", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token]);

  if (loading) return <div className="p-10 text-center">Loading your saved items...</div>;

  return (
    <div className="container-custom py-10">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      
      {items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map(product => (
            <ProductCard key={product._id} product={product} isWishlisted={true} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">You haven't saved any items yet.</p>
      )}
    </div>
  );
};

export default Wishlist;