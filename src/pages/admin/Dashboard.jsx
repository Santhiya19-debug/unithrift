import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Mock stats - in real app, fetch from API
  const stats = {
    totalUsers: 247,
    activeListings: 89,
    pendingReports: 12,
    totalTransactions: 156,
    newUsersToday: 8,
    newListingsToday: 15,
    resolvedReportsToday: 3
  };

  const recentActivity = [
    { id: 1, type: 'user', action: 'New user registered', user: 'Ananya Verma', time: '5 mins ago' },
    { id: 2, type: 'listing', action: 'New listing created', user: 'Rohan Singh', time: '12 mins ago' },
    { id: 3, type: 'report', action: 'Listing reported', user: 'System', time: '1 hour ago' },
    { id: 4, type: 'user', action: 'User verified', user: 'Priya Sharma', time: '2 hours ago' },
    { id: 5, type: 'listing', action: 'Listing removed', user: 'Admin Action', time: '3 hours ago' }
  ];

  const StatCard = ({ title, value, subtitle, onClick }) => (
    <div 
      onClick={onClick}
      className={`bg-white rounded-lg shadow-card p-6 ${onClick ? 'cursor-pointer hover:shadow-card-hover transition-shadow duration-card' : ''}`}
    >
      <h3 className="text-sm font-medium text-text-secondary mb-2">{title}</h3>
      <p className="text-3xl font-semibold text-text-primary mb-1">{value}</p>
      {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-off-white">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-medium text-text-primary mb-2">
            Admin Dashboard
          </h1>
          <p className="text-text-secondary">
            Overview of platform activity and statistics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers}
            subtitle={`+${stats.newUsersToday} today`}
            onClick={() => navigate('/admin/users')}
          />
          <StatCard 
            title="Active Listings" 
            value={stats.activeListings}
            subtitle={`+${stats.newListingsToday} today`}
            onClick={() => navigate('/admin/listings')}
          />
          <StatCard 
            title="Pending Reports" 
            value={stats.pendingReports}
            subtitle={`${stats.resolvedReportsToday} resolved today`}
            onClick={() => navigate('/admin/reports')}
          />
          <StatCard 
            title="Total Transactions" 
            value={stats.totalTransactions}
            subtitle="All time"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl font-medium text-text-primary">
              Recent Activity
            </h2>
            <button className="text-sm text-sage hover:text-green-dark transition-colors duration-card">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentActivity.map(activity => (
              <div 
                key={activity.id}
                className="flex items-start gap-4 pb-4 border-b border-border-soft last:border-0 last:pb-0"
              >
                <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                  activity.type === 'user' ? 'bg-sage' :
                  activity.type === 'listing' ? 'bg-green-dark' :
                  'bg-text-muted'
                }`} />
                <div className="flex-grow">
                  <p className="text-text-primary font-medium">{activity.action}</p>
                  <p className="text-sm text-text-secondary">{activity.user}</p>
                </div>
                <span className="text-sm text-text-muted whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;