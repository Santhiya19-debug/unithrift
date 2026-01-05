import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import {
  getAllProductsAdmin,
  removeProductAdmin,
  restoreProductAdmin
} from '../../services/adminService';

const ListingsManagement = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [selectedListing, setSelectedListing] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState('');

  // Fetch listings
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await getAllProductsAdmin(token);
      setListings(response);
    } catch (err) {
      alert(err.message || 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  // Confirm remove / restore
  const confirmAction = async () => {
    try {
      if (!selectedListing) return;

      if (actionType === 'remove') {
        await removeProductAdmin(selectedListing.id, token);
      }

      if (actionType === 'restore') {
        await restoreProductAdmin(selectedListing.id, token);
      }

      await fetchListings();
    } catch (err) {
      alert(err.message || 'Action failed');
    } finally {
      setShowConfirmDialog(false);
      setSelectedListing(null);
    }
  };

  // Filtering
  const filteredListings = listings.filter(listing => {
    const title = listing.title?.toLowerCase() || '';
    const seller = listing.seller?.toLowerCase() || '';

    const matchesSearch =
      title.includes(searchQuery.toLowerCase()) ||
      seller.includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || listing.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-10 text-center text-text-secondary">
        Syncing with Marketplace...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white">
      <div className="container-custom py-8">

        <div className="mb-8">
          <h1 className="font-heading text-3xl font-medium mb-2">
            Listings Management
          </h1>
          <p className="text-text-secondary">
            Enforce platform policies and review suspicious items.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search products or sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field flex-grow"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field md:w-48"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="removed">Removed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-off-white border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold">Product</th>
                <th className="px-6 py-4 text-left text-xs font-bold">Seller</th>
                <th className="px-6 py-4 text-left text-xs font-bold">Price</th>
                <th className="px-6 py-4 text-left text-xs font-bold">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.map(listing => (
                <tr key={listing.id} className="border-b hover:bg-off-white">
                  <td className="px-6 py-4">{listing.title}</td>
                  <td className="px-6 py-4">{listing.seller}</td>
                  <td className="px-6 py-4">₹{listing.price}</td>
                  <td className="px-6 py-4 font-bold">
                    {listing.status.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => navigate(`/product/${listing.id}`)}
                        className="text-sage text-sm hover:underline"
                      >
                        View
                      </button>

                      {listing.status === 'active' ? (
                        <button
                          onClick={() => {
                            setSelectedListing(listing);
                            setActionType('remove');
                            setShowConfirmDialog(true);
                          }}
                          className="text-error text-sm font-bold hover:underline"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedListing(listing);
                            setActionType('restore');
                            setShowConfirmDialog(true);
                          }}
                          className="text-success text-sm font-bold hover:underline"
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Moderation</h3>
            <p className="mb-6">
              Are you sure you want to {actionType}{' '}
              <strong>{selectedListing?.title}</strong>?
            </p>
            <div className="flex gap-4">
              <Button variant="secondary" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button onClick={confirmAction}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingsManagement;
