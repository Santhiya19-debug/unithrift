import React, { useState } from 'react';
import Button from '../../components/common/Button';

const UserManagement = () => {
  // Mock users data
  const [users, setUsers] = useState([
    { id: 1, name: 'Rahul Sharma', email: 'rahul.sharma@university.edu', verified: true, status: 'active', joined: '2024-09-15', listings: 5 },
    { id: 2, name: 'Priya Patel', email: 'priya.patel@university.edu', verified: true, status: 'active', joined: '2024-10-02', listings: 3 },
    { id: 3, name: 'Amit Kumar', email: 'amit.kumar@university.edu', verified: false, status: 'pending', joined: '2024-12-20', listings: 0 },
    { id: 4, name: 'Sarah Jones', email: 'sarah.jones@university.edu', verified: true, status: 'blocked', joined: '2024-08-10', listings: 2 },
    { id: 5, name: 'Vikram Singh', email: 'vikram.singh@university.edu', verified: true, status: 'active', joined: '2024-11-05', listings: 8 }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState('');

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAction = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    if (actionType === 'block') {
      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...u, status: 'blocked' } : u
      ));
    } else if (actionType === 'unblock') {
      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...u, status: 'active' } : u
      ));
    } else if (actionType === 'delete') {
      setUsers(users.filter(u => u.id !== selectedUser.id));
    }
    
    setShowConfirmDialog(false);
    setSelectedUser(null);
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      active: 'bg-success bg-opacity-10 text-success',
      blocked: 'bg-error bg-opacity-10 text-error',
      pending: 'bg-text-muted bg-opacity-10 text-text-muted'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-off-white">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-medium text-text-primary mb-2">
            User Management
          </h1>
          <p className="text-text-secondary">
            Manage users and their access to the platform
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search by name or email..."
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
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-text-secondary">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-off-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Listings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-off-white transition-colors duration-card">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-text-primary">{user.name}</p>
                        <p className="text-sm text-text-secondary">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-6 py-4">
                      {user.verified ? (
                        <span className="text-success">✓ Verified</span>
                      ) : (
                        <span className="text-text-muted">Not verified</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-text-primary">
                      {user.listings}
                    </td>
                    <td className="px-6 py-4 text-text-secondary text-sm">
                      {new Date(user.joined).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleAction(user, 'block')}
                            className="text-sm text-error hover:underline"
                          >
                            Block
                          </button>
                        ) : user.status === 'blocked' ? (
                          <button
                            onClick={() => handleAction(user, 'unblock')}
                            className="text-sm text-success hover:underline"
                          >
                            Unblock
                          </button>
                        ) : null}
                        <button
                          onClick={() => handleAction(user, 'delete')}
                          className="text-sm text-text-muted hover:text-error hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-secondary">No users found</p>
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
              Are you sure you want to {actionType} <strong>{selectedUser?.name}</strong>?
              {actionType === 'delete' && ' This action cannot be undone.'}
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

export default UserManagement;