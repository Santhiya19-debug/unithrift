import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/marketplace/ProductCard';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { getMyProducts } from '../services/productService';

const Profile = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const [myListings, setMyListings] = useState([]);
  const [activeTab, setActiveTab] = useState('listings');
  const [loading, setLoading] = useState(true);

  const fetchMyListings = async () => {
    // Check for token existence before making the API call
    if (!token) return;
    setLoading(true);
    try {
      const data = await getMyProducts(token);
      // Ensure we are setting an array even if the backend returns a single object or null
      setMyListings(Array.isArray(data.products) ? data.products : (Array.isArray(data) ? data : []));
    } catch (err) {
      console.error("Profile Fetch Error:", err);
      setMyListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMyListings();
    }
  }, [token]);

  const handleDeleteListing = async (productId) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) throw new Error('Delete failed');
      
      // Filter out the deleted item locally for an instant UI update
      setMyListings(prev => prev.filter(item => (item.id || item._id) !== productId));
      alert('Listing removed successfully');
    } catch (err) {
      alert('Failed to delete listing: ' + err.message);
    }
  };

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Please log in to view your profile.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="container mx-auto max-w-7xl py-10 px-4">
        
        {/* Profile Header */}
        <div className="bg-white rounded-xl border border-gray-100 p-8 mb-10 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-emerald-700 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900">{user.email}</h1>
                  {user.isVerified && (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded">
                      Verified Member
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm">
                  Campus Merchant since {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'Joining...'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => navigate('/sell')} className="px-6 bg-emerald-700 hover:bg-emerald-800">Sell an Item</Button>
              <Button variant="secondary" onClick={logout} className="border-gray-200 text-gray-600 hover:bg-gray-50">
                Log Out
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-gray-200 flex gap-8">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-4 px-1 text-sm font-bold transition-all ${
              activeTab === 'listings' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            My Listings ({myListings.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-4 px-1 text-sm font-bold transition-all ${
              activeTab === 'settings' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Account Settings
          </button>
        </div>

        {/* Listings Tab Content */}
        {activeTab === 'listings' && (
          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Loading your marketplace items...</p>
              </div>
            ) : myListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {myListings.map(product => (
                  <div key={product.id || product._id} className="relative group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <ProductCard product={product} />
                    {/* Floating Action Buttons */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        onClick={(e) => { e.preventDefault(); navigate(`/edit/${product.id || product._id}`); }}
                        className="p-2 bg-white rounded-lg shadow-md hover:text-emerald-700 transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => { e.preventDefault(); handleDeleteListing(product.id || product._id); }}
                        className="p-2 bg-white rounded-lg shadow-md hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-xl border-2 border-dashed border-gray-100">
                <div className="text-5xl mb-4 grayscale opacity-50">📦</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">No active listings</h2>
                <p className="text-gray-500 mb-8 max-w-xs mx-auto">Ready to declutter your hostel room?</p>
                <Button onClick={() => navigate('/sell')} className="shadow-lg shadow-emerald-700/20 px-8">
                  Create Listing
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab Content */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Account Information</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Institutional Email</label>
                <p className="text-gray-900 font-semibold text-lg">{user.email}</p>
              </div>
              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Account Security</label>
                  <p className="text-gray-600 text-sm">Update your password regularly to keep your shop safe.</p>
                </div>
                <button className="text-emerald-700 text-sm font-bold hover:underline">Change</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
