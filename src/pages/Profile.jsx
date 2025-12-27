import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/marketplace/ProductCard';
import Button from '../components/common/Button';
import { mockProducts } from '../data/mockProducts';

const Profile = () => {
  const navigate = useNavigate();
  
  // Mock user data - in real app, this would come from auth state/backend
  const [user] = useState({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@university.edu',
    joinDate: 'September 2024',
    verified: true
  });

  // Mock user's listings
  const [myListings] = useState([
    mockProducts[0],
    mockProducts[5],
    mockProducts[10]
  ]);

  const [activeTab, setActiveTab] = useState('listings'); // 'listings' or 'settings'

  const handleLogout = () => {
    // Mock logout - in real app, clear auth state
    if (confirm('Are you sure you want to logout?')) {
      navigate('/login');
    }
  };

  const handleDeleteListing = (productId) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      // Mock delete - in real app, call API
      console.log('Delete product:', productId);
      alert('Listing deleted successfully');
    }
  };

  return (
    <div className="min-h-screen bg-off-white">
      <div className="container-custom py-8 md:py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-card p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-sage text-white flex items-center justify-center text-2xl font-heading">
                {user.name.charAt(0)}
              </div>
              
              {/* User Info */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="font-heading text-2xl font-medium text-text-primary">
                    {user.name}
                  </h1>
                  {user.verified && (
                    <span className="badge-verified">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-text-secondary text-sm">{user.email}</p>
                <p className="text-text-muted text-sm">Member since {user.joinDate}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={() => navigate('/sell')}>
                Sell Item
              </Button>
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-4 border-b border-border-soft">
            <button
              onClick={() => setActiveTab('listings')}
              className={`pb-3 px-2 font-medium transition-colors duration-card ${
                activeTab === 'listings'
                  ? 'text-green-dark border-b-2 border-green-dark'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              My Listings ({myListings.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-3 px-2 font-medium transition-colors duration-card ${
                activeTab === 'settings'
                  ? 'text-green-dark border-b-2 border-green-dark'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'listings' ? (
          // My Listings
          <div>
            {myListings.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {myListings.map(product => (
                  <div key={product.id} className="relative group">
                    <ProductCard product={product} />
                    
                    {/* Action Buttons Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-card rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => navigate(`/edit/${product.id}`)}
                        className="p-2 bg-white rounded-full shadow-card hover:bg-sage hover:text-white transition-colors duration-card"
                        aria-label="Edit listing"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteListing(product.id)}
                        className="p-2 bg-white rounded-full shadow-card hover:bg-error hover:text-white transition-colors duration-card"
                        aria-label="Delete listing"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Empty State
              <div className="text-center py-16 bg-white rounded-lg shadow-card">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-sage bg-opacity-10 flex items-center justify-center">
                  <svg className="w-12 h-12 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h2 className="font-heading text-2xl font-medium text-text-primary mb-3">
                  No listings yet
                </h2>
                <p className="text-text-secondary mb-6">
                  Start selling items to see them here
                </p>
                <Button onClick={() => navigate('/sell')}>
                  Create Listing
                </Button>
              </div>
            )}
          </div>
        ) : (
          // Settings
          <div className="bg-white rounded-lg shadow-card p-6 md:p-8 space-y-6">
            <div>
              <h2 className="font-heading text-xl font-medium text-text-primary mb-4">
                Account Settings
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    className="input-field"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    College Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    className="input-field"
                    readOnly
                  />
                  <p className="mt-1 text-sm text-text-muted">
                    Email cannot be changed
                  </p>
                </div>

                <div className="pt-4">
                  <Button variant="secondary" className="w-full md:w-auto">
                    Change Password
                  </Button>
                </div>
              </div>
            </div>

            <hr className="border-border-soft" />

            <div>
              <h3 className="font-medium text-text-primary mb-3">Notifications</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-text-secondary">Email notifications</span>
                  <input type="checkbox" className="w-4 h-4 text-sage rounded focus:ring-sage" defaultChecked />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-text-secondary">New message alerts</span>
                  <input type="checkbox" className="w-4 h-4 text-sage rounded focus:ring-sage" defaultChecked />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-text-secondary">Product sold notifications</span>
                  <input type="checkbox" className="w-4 h-4 text-sage rounded focus:ring-sage" />
                </label>
              </div>
            </div>

            <hr className="border-border-soft" />

            <div>
              <h3 className="font-medium text-error mb-3">Danger Zone</h3>
              <button className="text-error hover:underline text-sm">
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;