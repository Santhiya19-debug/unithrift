import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

const ListingsManagement = () => {
  const navigate = useNavigate();

  // Mock listings data
  const [listings, setListings] = useState([
    { id: 1, name: 'Study Desk with Chair', seller: 'Rahul S.', category: 'Furniture', price: 2500, status: 'active', reports: 0, posted: '2024-12-15' },
    { id: 2, name: 'Engineering Textbooks', seller: 'Priya M.', category: 'Books', price: 800, status: 'active', reports: 0, posted: '2024-12-18' },
    { id: 3, name: 'Gaming Mouse', seller: 'Aditya B.', category: 'Electronics', price: 1000, status: 'flagged', reports: 2, posted: '2024-12-19' },
    { id: 4, name: 'Mini Fridge', seller: 'Amit K.', category: 'Hostel Essentials', price: 0, status: 'active', reports: 0, posted: '2024-12-19' },
    { id: 5, name: 'Suspicious Item', seller: 'Unknown User', category: 'Electronics', price: 50, status: 'flagged', reports: 5, posted: '2024-12-21' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedListing, setSelectedListing] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState('');

  // Filter listings
  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          listing.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || listing.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAction = (listing, action) => {
    setSelectedListing(listing);
    setActionType(action);
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    if (actionType === 'remove') {
      setListings(listings.filter(l => l.id !== selectedListing.id));
    } else if (actionType === 'unflag') {
      setListings(listings.map(l => 
        l.id === selectedListing.id ? { ...l, status: 'active', reports: 0 } : l
      ));
    }
    
    setShowConfirmDialog(false);
    setSelectedListing(null);
  };

  const StatusBadge = ({ status, reports }) => {
    if (status === 'flagged') {
      return (
        <span className="px-2 py-1 rounded text-xs font-medium bg-error bg-opacity-10 text-error">
          Flagged ({reports})
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded text-xs font-medium bg-success bg-opacity-10 text-success">
        Active
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-off-white">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-medium text-text-primary mb-2">
            Listings Management
          </h1>
          <p className="text-text-secondary">
            Monitor and manage all product listings on the platform
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search by product name or seller..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field md:w-48"
            >
              <option value="all">All Listings</option>
              <option value="active">Active</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              Showing {filteredListings.length} of {listings.length} listings
            </span>
            {listings.filter(l => l.status === 'flagged').length > 0 && (
              <span className="text-sm text-error">
                {listings.filter(l => l.status === 'flagged').length} listings need review
              </span>
            )}
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-off-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Posted
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {filteredListings.map(listing => (
                  <tr 
                    key={listing.id} 
                    className={`hover:bg-off-white transition-colors duration-card ${
                      listing.status === 'flagged' ? 'bg-error bg-opacity-5' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-text-primary">{listing.name}</p>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {listing.seller}
                    </td>
                    <td className="px-6 py-4">
                      <span className="tag-category">
                        {listing.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-primary font-medium">
                      {listing.price === 0 ? 'Free' : `₹${listing.price.toLocaleString()}`}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={listing.status} reports={listing.reports} />
                    </td>
                    <td className="px-6 py-4 text-text-secondary text-sm">
                      {new Date(listing.posted).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/product/${listing.id}`)}
                          className="text-sm text-sage hover:underline"
                        >
                          View
                        </button>
                        {listing.status === 'flagged' && (
                          <button
                            onClick={() => handleAction(listing, 'unflag')}
                            className="text-sm text-success hover:underline"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleAction(listing, 'remove')}
                          className="text-sm text-error hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-secondary">No listings found</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="font-heading text-xl font-medium text-text-primary mb-4">
              Confirm Action
            </h3>
            <p className="text-text-secondary mb-6">
              {actionType === 'remove' ? (
                <>
                  Are you sure you want to remove <strong>"{selectedListing?.name}"</strong>?
                  <br />
                  This action cannot be undone.
                </>
              ) : (
                <>
                  Approve <strong>"{selectedListing?.name}"</strong> and clear all reports?
                </>
              )}
            </p>
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                onClick={() => setShowConfirmDialog(false)} 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmAction} 
                className="flex-1"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingsManagement;