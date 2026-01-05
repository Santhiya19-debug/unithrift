import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const UserManagement = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState('');

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // 1. Fetch Real Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // 2. Filter Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const status = user.isBlocked ? 'blocked' : 'active';
    const matchesFilter = filterStatus === 'all' || status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // 3. Authority Actions (Real API calls)
  const confirmAction = async () => {
    const endpoint = actionType === 'block' ? 'block' : 'unblock';
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${selectedUser._id}/${endpoint}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchUsers(); // Refresh list on success
    } catch (err) {
      alert("Action failed");
    } finally {
      setShowConfirmDialog(false);
      setSelectedUser(null);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Campus Directory...</div>;

  return (
    <div className="min-h-screen bg-off-white">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-medium text-text-primary mb-2">User Management</h1>
          <p className="text-text-secondary">Oversee account status and campus access.</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-card p-6 mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field flex-grow"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field md:w-48"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-off-white border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase">Student/Faculty</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-text-secondary uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {filteredUsers.map(user => (
                <tr key={user._id} className="hover:bg-off-white">
                  <td className="px-6 py-4">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-text-muted">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${user.isBlocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {user.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!user.isBlocked ? (
                      <button 
                        onClick={() => { setSelectedUser(user); setActionType('block'); setShowConfirmDialog(true); }}
                        className="text-sm text-error font-bold hover:underline"
                      >
                        Block
                      </button>
                    ) : (
                      <button 
                        onClick={() => { setSelectedUser(user); setActionType('unblock'); setShowConfirmDialog(true); }}
                        className="text-sm text-success font-bold hover:underline"
                      >
                        Unblock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Access Change</h2>
            <p className="text-text-secondary mb-6">
              Are you sure you want to {actionType} <strong>{selectedUser?.name}</strong>?
            </p>
            <div className="flex gap-4">
              <Button variant="secondary" onClick={() => setShowConfirmDialog(false)} className="flex-1">Cancel</Button>
              <Button onClick={confirmAction} className="flex-1">Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;